import type { AuthenticatedWebSocket } from './types.js';

const connectedUsers = new Map<number, AuthenticatedWebSocket>();

export const addConnection = (socket: AuthenticatedWebSocket) => {
  connectedUsers.set(socket.userId, socket);
};

export const removeConnection = (userId: number) => {
  connectedUsers.delete(userId);
};

export const getConnection = (userId: number): AuthenticatedWebSocket | undefined => {
  return connectedUsers.get(userId);
};

export const isUserOnline = (userId: number): boolean => {
  return connectedUsers.has(userId);
};

export const getOnlineUserCount = (): number => {
  return connectedUsers.size;
};
