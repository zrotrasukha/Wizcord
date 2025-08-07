import type { Context } from "hono";
import * as CategoryService from "@/src/service/category.service";
import { type CreateCategoryData } from "../routes/category.route";

export const getCategories = async (c: Context, serverId: string): Promise<Response> => {
  if (!serverId) {
    return c.json({ error: "Server ID is required" }, 400);
  }
  const categories = await CategoryService.getCategories(serverId);
  if (!categories) {
    return c.json([], 404);
  }
  return c.json({ categories }, 200);

}

export const createCategory = async (c: Context, body: CreateCategoryData) => {
  const serverId = body.serverId;
  if (!serverId) {
    return c.json({ error: "Server ID is required" }, 400);
  }
  const categoryName = body.name;
  if (!categoryName) {
    return c.json({ error: "Category name is required" }, 400);
  }

  const newCategory = await CategoryService.createCategory(body);
  if (!newCategory) {
    return c.json({ error: "Failed to create category" }, 500);
  }

  return c.json({ newCategory }, 201);
}
