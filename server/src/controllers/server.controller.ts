import type { Context } from "hono";
import { getServers } from "../service/server.service";
import { NOT_FOUND, OK } from "../utils/http-status-code";
import type { createServerType, serverType } from "../types/server.type";
import { server } from "../db/schemas/schema";
import { db } from "../db/db";

export const getServersService = async (c: Context): Promise<Response> => {
    const userId = c.get("userId");
    const servers = await getServers(userId);
    return c.json({ servers }, OK);
}

export const createServerService = async (c: Context, body: createServerType): Promise<Response> => {
    const userId = c.get("userId");
    const { name, description, icon } = body;
    
    const createdServers: serverType[] = await db
        .insert(server)
        .values({
            name,
            admin: userId,
            description: description || '',
            icon: icon || ''
        })
        .returning();
    const createdServer = createdServers[0];

    if (!createdServer) {
        return c.json({ error: "Failed to create server" }, NOT_FOUND);
    }
    return c.json({ server: createdServer }, OK);

}