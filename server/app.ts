import { Hono } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth"
import { cors } from 'hono/cors'
import serverHandler from "./src/routes/server.route";
import onError from "./src/middlewares/error.middleware";
import { pinoLogger } from 'hono-pino'
import pino, { transport } from "pino";
import { logger } from 'hono/logger'

const app = new Hono().basePath('/api/')
app.use(logger());

// app.use(pinoLogger({
//     pino: pino(
//         transport({
//             target: 'pino-pretty',
//             options: {
//                 colorize: true
//             }
//         })
//     )
// }));

app.use('*', cors({
  origin: "http://localhost:3000",
  credentials: true,
}))
app.use("*", clerkMiddleware());
const route = app
  .route('/server', serverHandler)
  .get('/test', async (c) => {
    const a = 48 + 54;
    return c.json({ message: "Hello from Hono!", a }, 200);
  });
app.onError(onError);
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
})
export default app;
export type appType = typeof route;
