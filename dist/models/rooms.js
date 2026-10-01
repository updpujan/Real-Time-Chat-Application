var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
let Room = class Room {
    id;
    name;
    createdBy;
    maxMembers;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Room.prototype, "id", void 0);
__decorate([
    Column({ length: 100 }),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    Column({ name: 'created_by' }),
    __metadata("design:type", Number)
], Room.prototype, "createdBy", void 0);
__decorate([
    Column({ name: 'max_members', default: 10 }),
    __metadata("design:type", Number)
], Room.prototype, "maxMembers", void 0);
__decorate([
    CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], Room.prototype, "createdAt", void 0);
Room = __decorate([
    Entity('rooms')
], Room);
export { Room };
//# sourceMappingURL=rooms.js.map