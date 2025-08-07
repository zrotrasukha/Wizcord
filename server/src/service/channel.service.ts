import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { channel, server, serverMember } from "../db/schemas/schema";
import type { Context } from "hono";
import { INTERNAL_SERVER_ERROR } from "../utils/http-status-code";
import type { CreateChannelType } from "@shared/app.type";


export const checkChannelCreatePermission = async (serverId: string, userId: string) => {
  const serverAccess = await db
    .select({ admin: server.admin })
    .from(server)
    .where(eq(server.id, serverId))
    .limit(1);

  if (serverAccess.length && serverAccess[0]?.admin === userId) return true;

  const memberData = await db
    .select({ role: serverMember.role })
    .from(serverMember)
    .where(and(
      eq(serverMember.serverId, serverId),
      eq(serverMember.userId, userId)
    ))
    .limit(1);

  if (!memberData.length) return false;

  const userRole = memberData[0]!.role;
  return userRole === 'ADMIN' || userRole === 'MODERATOR';
}

export const getChannels = async (serverId: string) => {
  const channels = await db
    .select()
    .from(channel)
    .where(eq(channel.serverId, serverId))
    .orderBy(desc(channel.createdAt))
    ;
  return channels;
}

export const createChannel = async (c: Context, body: CreateChannelType) => {
  const createChannelInput = {
    serverId: body.serverId,
    name: body.name,
    type: body.type,
    categoryId: body.categoryId || null,
    visibility: body.visibility || 'public',
  }

  const [newChannel] = await db
    .insert(channel)
    .values(createChannelInput)
    .returning({
      id: channel.id,
      name: channel.name,
      type: channel.type,
      visibility: channel.visibility,
      serverId: channel.serverId,
      categoryId: channel.categoryId,
      createdAt: channel.createdAt,
    });

  if (!createChannel) {
    return c.json({ error: "Failed to create channel" }, INTERNAL_SERVER_ERROR);
  }
  return newChannel;
}



