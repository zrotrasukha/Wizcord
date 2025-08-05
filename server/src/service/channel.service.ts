import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { channel, serverMember } from "../db/schemas/schema";

export const getChannels = async (serverId: string) => {
  const channels = db
    .select()
    .from(channel)
    .where(eq(channel.serverId, serverId));
  return channels;
}
