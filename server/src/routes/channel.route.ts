import { Hono } from "hono";
import * as ChannelService from "@/src/service/channel.service";

const channelHandler = new Hono()
  .get('/', async (c) => {
    const body = await c.req.json();
    const serverId = body.serverId as string;
    if (!serverId) {
      return c.json({ error: "Server ID is required" }, 400);
    }
    const channels = await ChannelService.getChannels(serverId);
    if (!channels) {
      return c.json([], 404);
    }
    return c.json({ channels }, 200);
  });



export default channelHandler; 
