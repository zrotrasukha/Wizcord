import * as ChannelServices from "@/src/service/channel.service"
import * as ServerServices from "@/src/service/server.service";
import { NOT_FOUND } from "../utils/http-status-code";
import type { Context } from "hono";
import { OK } from "../utils/http-status-code";

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
