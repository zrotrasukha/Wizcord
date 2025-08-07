import { z } from "zod/v4";
import { server } from "@/src/db/schemas/schema";
export type ServerType = typeof server.$inferSelect;
export type ReturnServerType = Omit<ServerType, 'name' | 'admin' | 'icon' | 'description'>;

export const joinServerType = z.url();

export const createChannelSchema = z.object({
  name: z.string(),
  type: z.enum(["text", "voice"]),
  visibility: z.enum(["public", "private"]),
  serverId: z.string(),
  categoryId: z.string().nullable(),
});


export const createServerSchema = z.object({
  name: z.string(),
  icon: z.string().optional(),
  description: z.string().optional(),
});

export type CreateServerType = z.infer<typeof createServerSchema>;
