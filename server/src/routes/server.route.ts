import { Hono } from "hono";
import { createServerService, getServersService } from "../controllers/server.controller";
import requireAuth from "../middlewares/auth.middleware";
import { customZValidator as zv } from "@/src/middlewares/zodValidator.middleware"
import { createServerSchema } from "../types/server.type";

const serverHandler = new Hono()
    .get("/getservers", requireAuth, async (c) => getServersService(c))
    .post('/create', requireAuth, zv('json', createServerSchema), async (c) => {
        const body = c.req.valid('json');
        const response = await createServerService(c, body);
        return c.json(response, 201);
    })
    .get("getid", requireAuth, async (c) => {
        const userId = c.get("userId");
        if (!userId) {
            return c.json({ error: "User ID not found" }, 404);
        }
        return c.json({ userId }, 200);
    })


export default serverHandler;