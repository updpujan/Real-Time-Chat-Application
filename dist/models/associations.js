import User from './users.js';
import Room from './room.js';
import RoomMember from './roomMembers.js';
import Message from './message.js';
// User ↔ Room
User.hasMany(Room, {
    foreignKey: 'createdBy',
    as: 'createdRooms',
});
Room.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator',
});
// User ↔ RoomMember
User.hasMany(RoomMember, {
    foreignKey: 'userId',
    as: 'roomMemberships',
});
RoomMember.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});
// Room ↔ RoomMember
Room.hasMany(RoomMember, {
    foreignKey: 'roomId',
    as: 'members',
});
RoomMember.belongsTo(Room, {
    foreignKey: 'roomId',
    as: 'room',
});
// User ↔ Message (sender)
User.hasMany(Message, {
    foreignKey: 'senderId',
    as: 'sentMessages',
});
Message.belongsTo(User, {
    foreignKey: 'senderId',
    as: 'sender',
});
// User ↔ Message (receiver)
User.hasMany(Message, {
    foreignKey: 'receiverId',
    as: 'receivedMessages',
});
Message.belongsTo(User, {
    foreignKey: 'receiverId',
    as: 'receiver',
});
// Room ↔ Message
Room.hasMany(Message, {
    foreignKey: 'roomId',
    as: 'messages',
});
Message.belongsTo(Room, {
    foreignKey: 'roomId',
    as: 'room',
});
//# sourceMappingURL=associations.js.map