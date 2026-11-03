import { getConnection } from './connectionManager.js';
import { joinRoom, leaveRoom } from './rommManager.js';
import { createWebSocketMessage } from './message.js';
import { broadcastToRoom } from './broadcast.js';
export const notifyRoomJoined = (userId, roomId) => {
    const userSockets = getConnection(userId);
    for (const userSocket of userSockets) {
        joinRoom(roomId, userSocket);
    }
    broadcastToRoomExceptUser(roomId, createWebSocketMessage('room_member_joined', {
        roomId,
        userId,
    }), userId);
};
export const notifyRoomLeft = (userId, roomId) => {
    const userSockets = getConnection(userId);
    for (const userSocket of userSockets) {
        leaveRoom(roomId, userSocket);
    }
    broadcastToRoom(roomId, createWebSocketMessage('room_member_left', {
        roomId,
        userId,
    }));
};
const broadcastToRoomExceptUser = (roomId, message, excludedUserId) => {
    broadcastToRoom(roomId, message, undefined, excludedUserId);
};
//# sourceMappingURL=roomMembershipEvents.js.map