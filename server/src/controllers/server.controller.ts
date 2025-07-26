import type { Context } from "hono";
import { getServers } from "../service/server.service";
import { ensureUserExists } from "../service/user.service";
import { NOT_FOUND, OK } from "../utils/http-status-code";
import type { createServerType, serverType } from "../types/server.type";
import { server } from "../db/schemas/schema";
import { db } from "../db/db";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export const getServersService = async (c: Context): Promise<Response> => {
    const userId = c.get("userId");
    const servers = await getServers(userId);
    return c.json({ servers }, OK);
}

export const createServerService = async (c: Context, body: createServerType): Promise<Response> => {
    const userId = c.get("userId");
    const { name, description, icon } = body;
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress || '';
    const username = user.username || `user_${userId.slice(-8)}`; // Fallback username
    const avatar = user.imageUrl;
    
    const userInfo = {
        username,
        email,
        avatar: avatar || ''
    }
    await ensureUserExists(userId, userInfo)

    const createdServer: serverType[] = await db
        .insert(server)
        .values({
            name,
            admin: userId,
            description: description || '',
            icon: icon || '',
        }).returning();

    if (!createdServer[0]) {
        return c.json({ error: "Failed to create server" }, NOT_FOUND);
    }

    return c.json({ server: createdServer }, OK);
}