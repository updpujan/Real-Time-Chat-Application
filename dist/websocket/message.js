export const createWebSocketMessage = (type, data) => {
    return JSON.stringify({
        type,
        data,
    });
};
//# sourceMappingURL=message.js.map