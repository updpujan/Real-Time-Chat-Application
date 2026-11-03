import WebSocket from 'ws';
import { createWebSocketMessage } from './message.js';
const connectedUsers = new Map();
export const addConnection = (userId, socket) => {
    let userConnections = connectedUsers.get(userId);
    const wasOffline = !userConnections || userConnections.size === 0;
    if (!userConnections) {
        userConnections = new Set();
        connectedUsers.set(userId, userConnections);
    }
    userConnections.add(socket);
    return !wasOffline;
};
export const removeConnection = (userId, socket) => {
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
export const getConnection = (userId) => {
    const userConnections = connectedUsers.get(userId);
    if (!userConnections) {
        return [];
    }
    return [...userConnections].filter((socket) => socket.readyState === WebSocket.OPEN);
};
export const broadcastPresence = (type, userId) => {
    const payload = createWebSocketMessage(type, { user: userId });
    for (const userConnections of connectedUsers.values()) {
        for (const socket of userConnections) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(payload);
            }
        }
    }
};
export const getOnlineUserIds = () => {
    return [...connectedUsers.entries()]
        .filter(([, connections]) => connections.size > 0)
        .map(([userId]) => userId);
};
//# sourceMappingURL=connectionManager.js.map