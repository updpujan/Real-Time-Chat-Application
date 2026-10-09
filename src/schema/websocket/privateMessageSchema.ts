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
