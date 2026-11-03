import { WebSocketServer } from 'ws';
import type { AuthenticatedWebSocket } from './types.js';
export declare const broadcast: (wss: WebSocketServer, message: string, exclude?: AuthenticatedWebSocket) => void;
export declare const broadcastToRoom: (roomId: number, message: string, excludedSocket?: AuthenticatedWebSocket, excludedUserId?: number) => void;
//# sourceMappingURL=broadcast.d.ts.map