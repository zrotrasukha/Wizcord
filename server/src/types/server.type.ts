import { z } from "zod/v4";
import { server } from "@/src/db/schemas/schema";
export type ServerType = typeof server.$inferSelect;
export type ReturnServerType = Omit<ServerType, 'name' | 'admin' | 'icon' | 'description'>;

export const joinServerType = z.url();

export const createServerSchema = z.object({
  name: z.string().min(1).max(225),
  icon: z.url().optional(),
  description: z.string().min(1).max(500).optional(),
})

export type createServerType = z.infer<typeof createServerSchema>;
