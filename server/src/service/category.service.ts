import { db } from '@/src/db/db'
import { category } from '@/src/db/schemas/schema'
import { eq } from 'drizzle-orm'
import type { CreateCategoryData } from '../routes/category.route'

export const getCategories = async (serverId: string) => {
  try {
    return await db
      .select()
      .from(category)
      .where(eq(category.serverId, serverId))
      .orderBy(category.name)
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

export const createCategory = async (data: CreateCategoryData) => {
  const [newCategory] = await db
    .insert(category)
    .values({
      name: data.name,
      visibility: data.visibility,
      serverId: data.serverId,
    })
    .returning()

  if (!newCategory) {
    console.error('Failed to create category:', data.name)
    throw new Error('Failed to create category')
  }
  return newCategory;
}
