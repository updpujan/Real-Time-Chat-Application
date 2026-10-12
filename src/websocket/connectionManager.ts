import WebSocket from 'ws';
import type { AuthenticatedWebSocket } from './types.js';
import { createWebSocketMessage } from './message.js';
import type { WebSocketEventType } from './types.js';

const connectedUsers = new Map<number, Set<AuthenticatedWebSocket>>();

export const addConnection = (userId: number, socket: AuthenticatedWebSocket): boolean => {
  let userConnections = connectedUsers.get(userId);
  const wasOffline = !userConnections || userConnections.size === 0;
  if (!userConnections) {
    userConnections = new Set<AuthenticatedWebSocket>();
    connectedUsers.set(userId, userConnections);
  }
  userConnections.add(socket);
  return !wasOffline;
};

export const removeConnection = (userId: number, socket: AuthenticatedWebSocket): boolean => {
  const userConnections = connectedUsers.get(userId);
  if (!userConnections) {
    return false;
  }
  userConnections.delete(socket);

  if (userConnections.size === 0) {
    connectedUsers.delete(userId);
    return true;
  }
  return false;
};

export const getConnection = (userId: number): AuthenticatedWebSocket[] => {
  const userConnections = connectedUsers.get(userId);
  if (!userConnections) {
    return [];
  }

  return [...userConnections].filter((socket) => socket.readyState === WebSocket.OPEN);
};

export const broadcastPresence = (
  type: Extract<WebSocketEventType, 'user_online' | 'user_offline'>,
  userId: number,
): void => {
  const payload = createWebSocketMessage(type, { user: userId });

  for (const userConnections of connectedUsers.values()) {
    for (const socket of userConnections) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
      }
    }
  }
};

export const getOnlineUserIds = (): number[] => {
  return [...connectedUsers.entries()]
    .filter(([, connections]) => connections.size > 0)
    .map(([userId]) => userId);
};
