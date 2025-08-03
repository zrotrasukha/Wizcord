import type { Context } from "hono";
import * as ServerServices from "../service/server.service";
import { ensureUserExists } from "../service/user.service";
import { NOT_FOUND, OK } from "../utils/http-status-code";
import type { createServerType, ReturnServerType } from "../types/server.type";
import { server, serverMember } from "../db/schemas/schema";
import { db } from "../db/db";
import { createClerkClient } from "@clerk/backend";
import { and, eq } from "drizzle-orm";
import type { ChannelType } from "../../../client/src/types/app.types";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export const getServers = async (c: Context): Promise<Response> => {
  const userId = c.get("userId");
  const servers = await ServerServices.getServers(userId);
  return c.json({ servers }, OK);
}

export const createServer = async (c: Context, body: createServerType): Promise<Response> => {
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

  const createdServer: ReturnServerType[] = await ServerServices.createServer(userId, {
    name,
    description: description || '',
    icon: icon || ''
  });

  if (!createdServer[0]) {
    return c.json({ error: "Failed to create server" }, NOT_FOUND);
  }

  return c.json({ server: createdServer }, OK);
}

export const getServerChannels = async (c: Context, serverId: string)
  : Promise<Response> => {
  if (!serverId) {
    return c.json({ error: "Server ID is required" }, NOT_FOUND);
  }
  // Ensure user has access to the server
  const userId = c.get("userId");
  const serverAccess = await ServerServices.checkServerAccessForUser(serverId, userId);
  if (serverAccess) return c.json({ error: "Server Access denied" }, NOT_FOUND);

  // Fetch channels for the server
  const channels = ServerServices.getChannels(serverId);
  if (!channels) {
    return c.json({ error: "No channels found for this server" }, NOT_FOUND);
  }
  return c.json({ channels }, OK);
}
