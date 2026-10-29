import type { Server } from 'node:http';
import { WebSocketServer } from 'ws';
import { z } from 'zod';

import authenticateWebSocket from './sessionAuth.js';
import type { AuthenticatedWebSocket } from './types.js';

import {
  addConnection,
  removeConnection,
  broadcastPresence,
  getConnection,
  getOnlineUserIds,
} from './connectionManager.js';
import { broadcast, broadcastToRoom } from './broadcast.js';
import { createWebSocketMessage } from './message.js';
import { joinRoom, removeSocketFromAllRooms } from './rommManager.js';
import { privateMessageSchema } from '../schema/websocket/privateMessageSchema.js';
import { sendPrivateMessage } from '../service/messageService.js';
import { roomMessageSchema } from '../schema/websocket/roomSchema.js';
import { sendRoomMessage } from '../service/messageService.js';
import RoomMember from '../models/roomMembers.js';

const HEARTBEAT_INTERVAL = 30_000;

export const initilizeWebSocket = (server: Server) => {
  const wss = new WebSocketServer({
    noServer: true,
  });

  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((client) => {
      const socket = client as AuthenticatedWebSocket;
      if (socket.isAlive == false) {
        socket.terminate();
        return;
      }

      socket.isAlive = false;
      if (socket.readyState == WebSocket.OPEN) {
        socket.ping();
      }
    });
  }, HEARTBEAT_INTERVAL);

  server.on('upgrade', async (request, socket, head) => {
    try {
      const userId = await authenticateWebSocket(request);
      wss.handleUpgrade(request, socket, head, (ws) => {
        const authenticatedSocket = ws as AuthenticatedWebSocket;
        authenticatedSocket.userId = Number(userId);
        wss.emit('connection', authenticatedSocket, request);
      });
    } catch (err) {
      socket.write(
        'HTTP/1.1 401 Unauthorized\r\n' + 'Connection: close\r\n' + `Error: ${err}\r\n` + '\r\n',
      );
      socket.destroy();
      console.log('WebSocket Authentication Failed:', err);
    }
  });

  wss.on('connection', async (socket: AuthenticatedWebSocket, _request) => {
    socket.isAlive = true;
    socket.on('pong', () => {
      socket.isAlive = true;
    });

    const isNewlyOnline = addConnection(socket.userId, socket);
    if (isNewlyOnline) {
      broadcastPresence('user_online', socket.userId);
    }

    socket.send(
      createWebSocketMessage('online_users', {
        userIds: getOnlineUserIds().filter((onlineUserId) => onlineUserId !== socket.userId),
      }),
    );

    const message = createWebSocketMessage('user_online', { userId: socket.userId });
    broadcast(wss, message, socket);

    const memberships = await RoomMember.findAll({
      where: { userId: socket.userId },
      attributes: ['roomId'],
    });

    for (const membership of memberships) {
      joinRoom(membership.roomId, socket);
    }

    socket.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());

        switch (parsedMessage.type) {
          case 'private_message': {
            const validation = privateMessageSchema.safeParse(parsedMessage.data);
            if (!validation.success) {
              socket.send(
                createWebSocketMessage('error', {
                  message: 'Invalid Private Message',
                  error: validation.error.issues.map((err) => err.message),
                }),
              );
              break;
            }

            const result = await sendPrivateMessage(socket.userId, validation.data);
            if (!result.success) {
              const errorMessage = result.reason;
              socket.send(createWebSocketMessage('error', { message: errorMessage }));
              break;
            }

            socket.send(
              createWebSocketMessage('private_message_saved', {
                messageId: result.message.id,
                senderId: result.message.senderId,
                receiverId: result.message.receiverId,
                content: result.message.content,
                createdAt: result.message.createdAt,
              }),
            );

            const rcipentId = result.message.receiverId;
            if (rcipentId != null) {
              const recipientSockets = getConnection(rcipentId);
              const messagePayload = createWebSocketMessage('private_message', {
                messageId: result.message.id,
                senderId: result.message.senderId,
                receiverId: result.message.receiverId,
                content: result.message.content,
                createdAt: result.message.createdAt,
              });
              for (const recipientSocket of recipientSockets) {
                if (recipientSocket.readyState === WebSocket.OPEN) {
                  recipientSocket.send(messagePayload);
                }
              }
            }
            break;
          }

          case 'typing':
          case 'stop_typing': {
            const validation = z
              .object({ receiverId: z.number().int().positive() })
              .safeParse(parsedMessage.data);

            if (!validation.success) {
              socket.send(createWebSocketMessage('error', { message: 'Invalid receiver id' }));
              break;
            }
            const receiverId = validation.data.receiverId;
            if (receiverId === socket.userId) {
              socket.send(
                createWebSocketMessage('error', { message: 'same id for sender and receiver' }),
              );
              break;
            }

            const recipientSockets = getConnection(receiverId);
            for (const recipientSocket of recipientSockets) {
              if (recipientSocket?.readyState === WebSocket.OPEN) {
                recipientSocket.send(
                  createWebSocketMessage(parsedMessage.type, { senderId: socket.userId }),
                );
              }
            }
            break;
          }

          case 'chat_message': {
            const message = createWebSocketMessage('chat_message', parsedMessage.data);
            broadcast(wss, message, socket);
            break;
          }

          case 'room_message': {
            const validation = roomMessageSchema.safeParse(parsedMessage.data);

            if (!validation.success) {
              socket.send(
                createWebSocketMessage('error', {
                  message: 'Invalid room message',
                  error: validation.error.issues.map((issue) => issue.message),
                }),
              );
              break;
            }

            const { roomId, content } = validation.data;

            const result = await sendRoomMessage(socket.userId, roomId, content);

            if (!result.success) {
              socket.send(
                createWebSocketMessage('error', {
                  message: result.reason,
                }),
              );
              break;
            }

            const savedMessage = result.message;

            socket.send(
              createWebSocketMessage('room_message_saved', {
                messageId: savedMessage.id,
                roomId: savedMessage.roomId,
                senderId: savedMessage.senderId,
                content: savedMessage.content,
                createdAt: savedMessage.createdAt,
              }),
            );

            const messagePayload = createWebSocketMessage('room_message', {
              messageId: savedMessage.id,
              roomId: savedMessage.roomId,
              senderId: savedMessage.senderId,
              content: savedMessage.content,
              createdAt: savedMessage.createdAt,
            });

            broadcastToRoom(roomId, messagePayload, socket);

            break;
          }

          default:
            console.log('Invalid type');
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('close', () => {
      removeSocketFromAllRooms(socket);
      const wasOnline = removeConnection(socket.userId, socket);
      if (wasOnline) {
        broadcastPresence('user_offline', socket.userId);
      }
    });
  });

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  return wss;
};
