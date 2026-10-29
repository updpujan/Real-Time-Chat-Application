import { WebSocket, WebSocketServer } from 'ws';
import type { AuthenticatedWebSocket } from './types.js';
import { getRoom } from './rommManager.js';

export const broadcast = (
  wss: WebSocketServer,
  message: string,
  exclude?: AuthenticatedWebSocket,
) => {
  wss.clients.forEach((client) => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

export const broadcastToRoom = (
  roomId: number,
  message: string,
  excludedSocket?: AuthenticatedWebSocket,
  excludedUserId?: number,
): void => {
  const room = getRoom(roomId);

  if (!room) return;

  for (const socket of room) {
    if (socket === excludedSocket) continue;
    if (excludedUserId !== undefined && socket.userId === excludedUserId) {
      continue;
    }

    if (socket.readyState === 1) {
      socket.send(message);
    }
  }
};
