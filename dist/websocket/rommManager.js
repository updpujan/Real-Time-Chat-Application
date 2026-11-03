const rooms = new Map();
const getOrCreateRoom = (roomId) => {
    let room = rooms.get(roomId);
    if (!room) {
        room = new Set();
        rooms.set(roomId, room);
    }
    return room;
};
export const joinRoom = (roomId, socket) => {
    const room = getOrCreateRoom(roomId);
    room.add(socket);
};
export const leaveRoom = (roomId, socket) => {
    const room = rooms.get(roomId);
    if (!room) {
        return;
    }
    room.delete(socket);
    if (room.size === 0) {
        rooms.delete(roomId);
    }
};
export const getRoom = (roomId) => {
    return rooms.get(roomId);
};
export const removeSocketFromAllRooms = (socket) => {
    for (const [roomId, room] of rooms) {
        room.delete(socket);
        if (room.size === 0) {
            rooms.delete(roomId);
        }
    }
};
//# sourceMappingURL=rommManager.js.map