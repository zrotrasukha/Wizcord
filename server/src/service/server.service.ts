import { db } from '@/src/db/db';
import { server, serverMember } from '@/src/db/schemas/schema';
import { eq, or } from 'drizzle-orm';
import { createClerkClient } from '@clerk/backend'
import { ensureUserExists } from './user.service';
import type { Context } from 'hono';



export const getServers = async (userId: string) => {

    const servers = await db
        .select({
            serverId: server.id,
            name: server.name,
            icon: server.icon,
            admin: server.admin,
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
        .groupBy(server.id);
   return servers; 
}