import type { Context } from "hono";
import * as ServerServices from "../service/server.service";
import { ensureUserExists } from "../service/user.service";
import { NOT_FOUND, OK } from "../utils/http-status-code";
import type { CreateServerType } from "../types/server.type";
import { createClerkClient } from "@clerk/backend";
import type { serverType } from "@shared/app.type";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export const getServers = async (c: Context): Promise<Response> => {
  const userId = c.get("userId");
  const servers = await ServerServices.getServers(userId);
  return c.json({ servers }, OK);
}

export const createServer = async (c: Context, body: CreateServerType): Promise<Response> => {
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

  const createdServer: serverType[] = await ServerServices.createServer(userId, {
    name,
    description: description || '',
    icon: icon || ''
  });

  if (!createdServer[0]) {
    return c.json({ error: "Failed to create server" }, NOT_FOUND);
  }

  return c.json({ server: createdServer }, OK);
}

