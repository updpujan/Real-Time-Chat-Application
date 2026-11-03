import { getConnection } from '../websocket/connectionManager.js';
import { joinRoom, leaveRoom } from '../websocket/rommManager.js';
export const syncUserRoomConnections = (userId, roomId, action) => {
    const sockets = getConnection(userId);
    for (const socket of sockets) {
        if (action === 'join') {
            joinRoom(roomId, socket);
        }
        else {
            leaveRoom(roomId, socket);
        }
    }
};
//# sourceMappingURL=roomServices.js.map