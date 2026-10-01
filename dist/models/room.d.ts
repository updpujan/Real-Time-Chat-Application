import { Model, Optional } from 'sequelize';
interface RoomAttributes {
    id: number;
    name: string;
    createdBy: number;
    maxMembers: number;
    createdAt: Date;
    updatedAt: Date;
}
type RoomCreationAttributes = Optional<RoomAttributes, 'id' | 'maxMembers' | 'createdAt' | 'updatedAt'>;
declare class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
    id: number;
    name: string;
    createdBy: number;
    maxMembers: number;
    createdAt: Date;
    updatedAt: Date;
}
export default Room;
//# sourceMappingURL=room.d.ts.map