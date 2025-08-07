import { Hono } from "hono";
import * as ChannelService from "@/src/service/channel.service";
import requireAuth from "../middlewares/auth.middleware";
import { customZValidator as zv } from "../middlewares/zodValidator.middleware";
import * as ChannelController from "@/src/controllers/channel.controller";
import { CREATED, INTERNAL_SERVER_ERROR } from "../utils/http-status-code";
import { createChannelSchema } from "../types/server.type";
import { z } from "zod/v4";

const getChannelSchema = z.object({
  serverId: z.string().min(1, "Server ID is required")
});

const channelHandler = new Hono()
  .get('/all', requireAuth, async (c) => {
    const serverIdArr = c.req.queries('serverId');
    const serverId = Array.isArray(serverIdArr) ? serverIdArr[0] : serverIdArr;
    console.log('lwda serverId', serverId);

    if (!serverId) {
      return c.json({ error: "lwda nahi mila serverId" }, 400);
    }
    const channels = await ChannelService.getChannels(serverId);
    if (!channels) {
      return c.json([], 404);
    }
    return c.json({ channels }, 200);
  })
  .post('/create', requireAuth, zv('json', createChannelSchema), async (c) => {
    const body = c.req.valid('json');
    const channel = await ChannelController.createchannels(c, body);
    if (!channel) {
      return c.json({ error: "Failed to create channel" }, INTERNAL_SERVER_ERROR);
    }
    return c.json({ channel }, CREATED);
  })


export default channelHandler;
