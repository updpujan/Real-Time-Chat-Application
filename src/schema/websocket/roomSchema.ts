import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().trim().min(1).max(100),
  maxMembers: z.number().int().min(2).max(50).default(50),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.coerce.number().int().positive();

export const roomMessageSchema = z.object({
  roomId: z.number().int().positive(),
  content: z.string().trim().min(1).max(5000),
});

export const roomMessageHistoryParamsSchema = z.object({
  roomId: z.coerce.number().int().positive(),
});

export const roomMessageHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
