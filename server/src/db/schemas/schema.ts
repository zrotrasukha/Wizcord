import { timestamp, pgTable, varchar, text, uuid, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ['ADMIN', 'MODERATOR', 'MEMBER']);
export const channelType = pgEnum('channelType', ['text', 'voice']);
export const visibility = pgEnum('visibility', ['public', 'private',]);

export const user = pgTable(
  'users', {
  id: text('id').primaryKey(),
  username: varchar('username', { length: 225 }).notNull(),
  email: varchar('email', { length: 225 }).notNull(),
  avatar: text('avatar').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow()
}
)

export const server = pgTable(
  'server', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 225 }).notNull(),
  admin: text('admin').notNull().references(() => user.id),
  icon: text('icon'),
  description: text('description'),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow()
}
);

export const serverMember = pgTable(
  'server_member', {
  id: uuid('id').primaryKey().defaultRandom(),
  serverId: uuid('serverId').notNull().references(() => server.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => user.id),
  role: roleEnum().notNull().default('MEMBER'),
  joinedAt: timestamp('joinedAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow()
}
)

export const category = pgTable(
  'category',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    visibility: visibility().notNull(),
    name: varchar('channelName', { length: 150 }),
    serverId: uuid('serverId').references(() => server.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow()
  }
)

export const channel = pgTable(
  'channels', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  type: channelType().notNull(),
  visibility: visibility().notNull().default('public'),
  serverId: uuid('serverId').references(() => server.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('categoryId').references(() => category.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow()
}
)

export const message = pgTable(
  'messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  serverId: uuid('serverId').notNull().references(() => server.id, { onDelete: 'cascade' }),
  channelId: uuid('channelId').references(() => channel.id, { onDelete: 'cascade' }).notNull(),
  authorId: text('authorId').notNull().references(() => user.id),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow()
}
)
