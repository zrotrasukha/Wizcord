import * as ChannelServices from "@/src/service/channel.service"
import * as ServerServices from "@/src/service/server.service";
import { BAD_REQUEST, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../utils/http-status-code";
import type { Context } from "hono";
import { OK } from "../utils/http-status-code";
import { type CreateChannelType } from "@shared/app.type";

export const getServerChannels = async (c: Context)
  : Promise<Response> => {
  const serverId = c.req.param("serverId");
  if (!serverId) {
    return c.json({ error: "Server ID is required" }, NOT_FOUND);
  }
  // Ensure user has access to the server
  const userId = c.get("userId");
  const serverAccess = await ServerServices.checkServerAccessForUser(serverId, userId);
  if (serverAccess) return c.json({ error: "Server Access denied" }, NOT_FOUND);

  // Fetch channels for the server
  const channels = ChannelServices.getChannels(serverId);
  if (!channels) {
    return c.json({ error: "No channels found for this server" }, NOT_FOUND);
  }
  return c.json({ channels }, OK);
}


export const createchannels = async (c: Context, body: CreateChannelType) => {
  const { serverId } = body;
  try {
    const userId = c.get("userId");
    if (!userId) {
      return c.json({ error: "User ID is required" }, BAD_REQUEST);
    }
    // check if user has access to the server
    const hasPermission = await ChannelServices.checkChannelCreatePermission(serverId, userId);
    if (!hasPermission) {
      return c.json({ error: "You do not have permission to create channels in this server" }, FORBIDDEN);
    }
    // Create the channel
    const newChannel = await ChannelServices.createChannel(c, body);
    if (!newChannel) {
      return c.json({ error: "Failed to create channel" }, INTERNAL_SERVER_ERROR);
    }

    return c.json({ newChannel }, CREATED);
  }
  catch (error) {
    console.error("Error creating channel:", error);
    return c.json({ error: "Internal server error" }, 500);
  }

}
