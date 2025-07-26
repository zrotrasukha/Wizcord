import { Hono } from "hono";
import { getServersService } from "../controllers/server.controller";
import requireAuth from "../middlewares/auth.middleware";

const serverHandler = new Hono()
    .get("/getservers", requireAuth, async (c) => getServersService(c))
    .get("getid", requireAuth, async (c) => {
        const userId = c.get("userId");
        if (!userId) {
            return c.json({ error: "User ID not found" }, 404);
        }
        return c.json({ userId }, 200);
    })


export default serverHandler;