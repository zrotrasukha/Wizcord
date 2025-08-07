import { Hono } from "hono";
import * as ServerController from "../controllers/server.controller";
import requireAuth from "../middlewares/auth.middleware";
import { customZValidator as zv } from "@/src/middlewares/zodValidator.middleware"
import { createServerSchema } from "../types/server.type";

const serverHandler = new Hono()
  .post('/create', requireAuth, zv('json', createServerSchema), async (c) => {
    const body = c.req.valid('json');
    return await ServerController.createServer(c, body);
  })
  .get("/getservers", requireAuth, async (c) => ServerController.getServers(c))



export default serverHandler;
