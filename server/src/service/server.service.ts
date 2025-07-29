import { db } from '@/src/db/db';
import { server, serverMember } from '@/src/db/schemas/schema';
import { eq, or } from 'drizzle-orm';




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
