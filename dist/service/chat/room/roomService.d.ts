import RoomMember from '../../../models/roomMembers.js';
import Room from '../../../models/room.js';
import type { CreateRoomInput } from '../../../schema/websocket/roomSchema.js';
interface RoomAccessResult {
    allowed: boolean;
    reason?: 'ROOM_NOT_FOUND' | 'NOT_MEMBER';
}
export declare const canUserAccessRoom: (userId: number, roomId: number) => Promise<RoomAccessResult>;
export declare const createRoom: (creatorId: number, input: CreateRoomInput) => Promise<Room>;
export declare const joinRoom: (roomId: number, userId: number) => Promise<RoomMember>;
export declare const leaveRoom: (roomId: number, userId: number) => Promise<void>;
export declare const getMyRooms: (userId: number) => Promise<RoomMember[]>;
export {};
//# sourceMappingURL=roomService.d.ts.map