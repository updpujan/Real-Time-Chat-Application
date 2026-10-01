import { Model, Optional } from 'sequelize';
interface RoomMemberAttributes {
    id: number;
    roomId: number;
    userId: number;
    joinedAt: Date;
}
type RoomMemberCreationAttributes = Optional<RoomMemberAttributes, 'id' | 'joinedAt'>;
declare class RoomMember extends Model<RoomMemberAttributes, RoomMemberCreationAttributes> implements RoomMemberAttributes {
    id: number;
    roomId: number;
    userId: number;
    joinedAt: Date;
}
export default RoomMember;
//# sourceMappingURL=roomMembers.d.ts.map