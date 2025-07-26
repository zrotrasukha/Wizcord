import type { Context } from "hono";
import { getServers } from "../service/server.service";
import { NOT_FOUND, OK } from "../utils/http-status-code";
import type { serverType } from "../types/server.type";

export const getServersService =  async (c:Context) :Promise<Response> => {
    const userId = c.get("userId");
    const servers = await getServers(userId);
    return c.json({ servers }, OK);
}