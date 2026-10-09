import type { AuthenticatedWebSocket } from './types.js';

const rooms = new Map<number, Set<AuthenticatedWebSocket>>();

export const getOrCreateRoom = (roomId: number): Set<AuthenticatedWebSocket> => {
  let room = rooms.get(roomId);

  if (!room) {
    room = new Set<AuthenticatedWebSocket>();
    rooms.set(roomId, room);
  }

  return room;
};

export const joinRoom = (roomId: number, socket: AuthenticatedWebSocket) => {
  const room = getOrCreateRoom(roomId);

  room.add(socket);
};

export const leaveRoom = (roomId: number, socket: AuthenticatedWebSocket) => {
  const room = rooms.get(roomId);

  if (!room) {
    return;
  }

  room.delete(socket);

  if (room.size === 0) {
    rooms.delete(roomId);
  }
};

export const getRoom = (roomId: number): Set<AuthenticatedWebSocket> | undefined => {
  return rooms.get(roomId);
};

export const isInRoom = (roomId: number, socket: AuthenticatedWebSocket): boolean => {
  const room = rooms.get(roomId);

  if (!room) {
    return false;
  }

  return room.has(socket);
};
