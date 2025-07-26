import { getAuth } from "@hono/clerk-auth";
import type { Context, Next } from "hono";
import { UNAUTHORIZED } from "../utils/http-status-code";

const requireAuth = async (c:Context, next: Next) => {
    const auth = getAuth(c);
    if(!auth?.userId){
        return c.json({ error: "Unauthorized" }, UNAUTHORIZED);
    }
    c.set("userId", auth.userId);
    return await next();
}
export default requireAuth;