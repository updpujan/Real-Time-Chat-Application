import { z } from 'zod';
export declare const privateMessageSchema: z.ZodObject<{
    receiverId: z.ZodNumber;
    content: z.ZodString;
}, z.core.$strip>;
export type PrivateMessageInput = z.infer<typeof privateMessageSchema>;
export declare const deleteMessageParamsSchema: z.ZodObject<{
    messId: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const messageHistoryParamsSchema: z.ZodObject<{
    type: z.ZodEnum<{
        group: "group";
        private: "private";
    }>;
    id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const messageHistoryQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const chatSearchQuerySchema: z.ZodObject<{
    q: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=privateMessageSchema.d.ts.map