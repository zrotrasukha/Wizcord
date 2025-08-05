import { db } from '@/src/db/db';
import { channel, server, serverMember } from '@/src/db/schemas/schema';
import { and, eq, or } from 'drizzle-orm';
import type { Context } from 'hono';
import { NOT_FOUND } from '../utils/http-status-code';

export const getServers = async (userId: string) => {
  const servers = await db
    .select({
      id: server.id,
      name: server.name,
      admin: server.admin,
      icon: server.icon,
      description: server.description,
      createdAt: server.createdAt,
      updatedAt: server.updatedAt
    })
    .from(server)
    .leftJoin(serverMember, eq(serverMember.serverId, server.id))
    .where(or(
      eq(serverMember.userId, userId),
      eq(server.admin, userId)
    ))
    .groupBy(server.id)
  return servers;
}

export const createServer = async (
  userId: string,
  body:
    {
      name: string;
      description?: string;
      icon?: string
    }) => {

  const createdServer = await db
    .insert(server)
    .values({
      name: body.name,
      admin: userId,
      description: body.description || '',
      icon: body.icon || '',
    }).returning({
      id: server.id,
      name: server.name,
      icon: server.icon,
      description: server.description,
      createdAt: server.createdAt,
      updatedAt: server.updatedAt,
    })
  return createdServer;
}
export const checkServerAccessForUser =
  async (serverId: string, userId: string)
    : Promise<boolean> => {
    const serverAccess = await db.select()
      .from(serverMember)
      .where(and(
        eq(serverMember.serverId, serverId),
        eq(serverMember.userId, userId)
      ))
      .limit(1);
    if (serverAccess.length === 0) return false
    return true;
  }




