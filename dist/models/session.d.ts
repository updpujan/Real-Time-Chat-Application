import { Model, Optional } from 'sequelize';
interface SessionAttributes {
    sid: string;
    expires: Date;
    data: string;
    createdAt: Date;
    updatedAt: Date;
}
type SessionCreationAttributes = Optional<SessionAttributes, 'createdAt' | 'updatedAt'>;
declare class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
    sid: string;
    expires: Date;
    data: string;
    createdAt: Date;
    updatedAt: Date;
}
export default Session;
//# sourceMappingURL=session.d.ts.map