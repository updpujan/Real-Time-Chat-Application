import type { Server } from 'node:http';
import { WebSocketServer } from 'ws';

import authenticateWebSocket from './sessionAuth.js';
import type { AuthenticatedWebSocket } from './types.js';

import {
  addConnection,
  removeConnection,
  getOnlineUserCount,
  getConnection,
} from './connectionManager.js';

import { broadcast, broadcastToRoom } from './broadcast.js';

import { createWebSocketMessage } from './message.js';

import { isInRoom, joinRoom, leaveRoom } from './rommManager.js';
import { canUserAccessRoom } from '../service/chat/room/roomService.js';

import { privateMessageSchema } from '../schema/websocket/privateMessageSchema.js';
import { sendPrivateMessage } from '../service/messageService.js';

export const initilizeWebSocket = (server: Server) => {
  const wss = new WebSocketServer({
    noServer: true,
  });

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

  wss.on('connection', (socket: AuthenticatedWebSocket, _request) => {
    addConnection(socket);

    const message = createWebSocketMessage('user_online', { userId: socket.userId });
    broadcast(wss, message, socket);

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
              const recipentSocket = getConnection(rcipentId);
              if (recipentSocket?.readyState === WebSocket.OPEN) {
                recipentSocket.send(
                  createWebSocketMessage('private_message', {
                    messageId: result.message.id,
                    senderId: result.message.senderId,
                    receiverId: result.message.receiverId,
                    content: result.message.content,
                    createdAt: result.message.createdAt,
                  }),
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

          case 'join_room': {
            const roomId = Number(parsedMessage.data.roomId);

            const result = await canUserAccessRoom(socket.userId, roomId);

            if (!result.allowed) {
              const message =
                result.reason === 'ROOM_NOT_FOUND'
                  ? createWebSocketMessage('error', {
                      message: 'Room not found',
                    })
                  : createWebSocketMessage('error', {
                      message: 'You are not a member of this room',
                    });

              socket.send(message);

              break;
            }

            joinRoom(roomId, socket);

            const message = createWebSocketMessage('room_joined', {
              roomId,
              userId: socket.userId,
            });

            broadcastToRoom(roomId, message);

            break;
          }

          case 'leave_room': {
            const roomId = Number(parsedMessage.data.roomId);
            if (isInRoom(roomId, socket)) {
              leaveRoom(roomId, socket);
              console.log('Room left');
              break;
            }
            console.log('Not in room');

            break;
          }

          case 'room_message': {
            const roomId = Number(parsedMessage.data.roomId);
            if (!isInRoom(roomId, socket)) {
              console.log('Not in room');
              break;
            }
            const message = createWebSocketMessage('room_message', {
              roomId,
              userId: socket.userId,
              message: parsedMessage.data.message,
            });
            broadcastToRoom(roomId, message, socket);
            break;
          }

          case 'typing': {
            const roomId = Number(parsedMessage.data.roomId);
            joinRoom(roomId, socket);
            break;
          }

          case 'user_online': {
            const roomId = Number(parsedMessage.data.roomId);
            joinRoom(roomId, socket);
            break;
          }

          case 'user_offline': {
            const roomId = Number(parsedMessage.data.roomId);
            joinRoom(roomId, socket);
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
      removeConnection(socket.userId);

      console.log('WebSocket client disconnected');
      console.log(`Online users: ${getOnlineUserCount()}`);
      const message = createWebSocketMessage('user_offline', { userId: socket.userId });
      broadcast(wss, message);
    });
  });

  return wss;
};
