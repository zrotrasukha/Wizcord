import { Hono } from "hono";
import { createServerService, getServersService } from "../controllers/server.controller";
import requireAuth from "../middlewares/auth.middleware";
import { customZValidator as zv } from "@/src/middlewares/zodValidator.middleware"
import { createServerSchema } from "../types/server.type";

const serverHandler = new Hono()
  .get("/getservers", requireAuth, async (c) => getServersService(c))
  .post('/create', requireAuth, zv('json', createServerSchema), async (c) => {
    const body = c.req.valid('json');
    return await createServerService(c, body);
  })
export default serverHandler;
