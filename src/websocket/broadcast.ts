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
  exclude?: AuthenticatedWebSocket,
) => {
  const room = getRoom(roomId);

  if (!room) {
    return;
  }

  room.forEach((socket) => {
    if (socket !== exclude && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
};
