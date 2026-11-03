import type { AuthenticatedWebSocket } from './types.js';
export declare const joinRoom: (roomId: number, socket: AuthenticatedWebSocket) => void;
export declare const leaveRoom: (roomId: number, socket: AuthenticatedWebSocket) => void;
export declare const getRoom: (roomId: number) => Set<AuthenticatedWebSocket> | undefined;
export declare const removeSocketFromAllRooms: (socket: AuthenticatedWebSocket) => void;
//# sourceMappingURL=rommManager.d.ts.map