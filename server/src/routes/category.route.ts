import { Hono } from "hono";
import * as CategoryController from '@/src/controllers/category.controller'
import { customZValidator as zv } from "../middlewares/zodValidator.middleware";
import { z } from "zod/v4";
import requireAuth from "../middlewares/auth.middleware";

export const createCategorySchema = z.object({
  name: z.string().min(1).max(150),
  visibility: z.enum(['public', 'private']).default('public'),
  serverId: z.string()
})

export const getCategoriesSchema = z.object({
  serverId: z.string()
})
export type CreateCategoryData = z.infer<typeof createCategorySchema>
const categoryHandler = new Hono()
  .post('/create', requireAuth, zv('json', createCategorySchema), async (c) => {
    const body = c.req.valid('json');
    return await CategoryController.createCategory(c, body);
  })
  .get('/all', requireAuth, async (c) => {
    const serverIdArr = c.req.queries('serverId');
    const serverId = Array.isArray(serverIdArr) ? serverIdArr[0] : serverIdArr;
    console.log('Server ID from query:', serverId);
    if (!serverId) {
      return c.json({ error: "Server ID is required" }, 400);
    }
    const response = await CategoryController.getCategories(c, serverId);
    return response;
  })


export default categoryHandler;
