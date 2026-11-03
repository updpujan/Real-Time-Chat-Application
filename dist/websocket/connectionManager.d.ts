import type { AuthenticatedWebSocket } from './types.js';
import type { WebSocketEventType } from './types.js';
export declare const addConnection: (userId: number, socket: AuthenticatedWebSocket) => boolean;
export declare const removeConnection: (userId: number, socket: AuthenticatedWebSocket) => boolean;
export declare const getConnection: (userId: number) => AuthenticatedWebSocket[];
export declare const broadcastPresence: (type: Extract<WebSocketEventType, "user_online" | "user_offline">, userId: number) => void;
export declare const getOnlineUserIds: () => number[];
//# sourceMappingURL=connectionManager.d.ts.map