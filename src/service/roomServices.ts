import { getConnection } from '../websocket/connectionManager.js';
import { joinRoom, leaveRoom } from '../websocket/rommManager.js';

export const syncUserRoomConnections = (
  userId: number,
  roomId: number,
  action: 'join' | 'leave',
): void => {
  const sockets = getConnection(userId);

  for (const socket of sockets) {
    if (action === 'join') {
      joinRoom(roomId, socket);
    } else {
      leaveRoom(roomId, socket);
    }
  }
};
