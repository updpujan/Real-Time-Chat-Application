import { z } from 'zod';

export const privateMessageSchema = z.object({
  receiverId: z.number().int().positive(),
  content: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message cannot exceed 5000 characters'),
});

export type PrivateMessageInput = z.infer<typeof privateMessageSchema>;

export const deleteMessageParamsSchema = z.object({
  messId: z.coerce.number().int().positive(),
});

export const messageHistoryParamsSchema = z.object({
  type: z.enum(['private', 'group']),
  id: z.coerce.number().int().positive(),
});

export const messageHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
