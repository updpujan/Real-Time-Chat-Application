import { WebSocket } from 'ws';
import { getRoom } from './rommManager.js';
export const broadcast = (wss, message, exclude) => {
    wss.clients.forEach((client) => {
        if (client !== exclude && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};
export const broadcastToRoom = (roomId, message, excludedSocket, excludedUserId) => {
    const room = getRoom(roomId);
    if (!room)
        return;
    for (const socket of room) {
        if (socket === excludedSocket)
            continue;
        if (excludedUserId !== undefined && socket.userId === excludedUserId) {
            continue;
        }
        if (socket.readyState === 1) {
            socket.send(message);
        }
    }
};
//# sourceMappingURL=broadcast.js.map