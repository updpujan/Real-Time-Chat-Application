import { WebSocketEventType } from './types.js';
export const createWebSocketMessage = <T>(type: WebSocketEventType, data: T): string => {
  return JSON.stringify({
    type,
    data,
  });
};
