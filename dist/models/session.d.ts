import { Model, Optional } from 'sequelize';
interface SessionAttributes {
    id: string;
    userId: number;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
type SessionCreationAttributes = Optional<SessionAttributes, 'createdAt' | 'updatedAt'>;
declare class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
    id: string;
    userId: number;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export default Session;
//# sourceMappingURL=session.d.ts.map