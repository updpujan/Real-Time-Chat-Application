import { z } from 'zod';
export declare const createRoomSchema: z.ZodObject<{
    name: z.ZodString;
    maxMembers: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export declare const joinRoomSchema: z.ZodCoercedNumber<unknown>;
export declare const roomMessageSchema: z.ZodObject<{
    roomId: z.ZodNumber;
    content: z.ZodString;
}, z.core.$strip>;
export declare const roomMessageHistoryParamsSchema: z.ZodObject<{
    roomId: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const roomMessageHistoryQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=roomSchema.d.ts.map