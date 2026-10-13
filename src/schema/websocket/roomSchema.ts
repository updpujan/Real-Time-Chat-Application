import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().trim().min(1).max(100),
  maxMembers: z.number().int().min(2).max(50).default(50),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.coerce.number().int().positive();
