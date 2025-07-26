import { eq } from "drizzle-orm"
import { db } from "../db/db"
import { user } from "@/src/db/schemas/schema"
import { z } from "zod/v4"
import { getAuth } from "@hono/clerk-auth"
import type { Context } from "hono"

const userInfoSchema = z.object({
    username: z.string().min(3).max(32).regex(/^\S+$/, "No spaces allowed").optional(),
    email: z.email().optional(),
    avatar: z.url().optional(),
})


export const ensureUserExists = async (userId: string, userInfo?: unknown) => {
    const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1)

    if (existingUser.length > 0) {
        return existingUser[0];
    }

    const parsedBody = userInfoSchema.safeParse(userInfo);

    if (!parsedBody.success) {
        throw new Error("Invalid user info");
    }

    const { username, email, avatar } = parsedBody.data;

    if(!username || !email) {
        throw new Error("username and email are required to create a new user");
    }

    const newUser = await db
    .insert(user)
    .values({
        id: userId,
        username,
        email,
        avatar: avatar || '',
    }).returning();
    
    return newUser[0];
}