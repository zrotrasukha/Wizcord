import { server, channel } from '../server/src/db/schemas/schema.ts'

export type serverType = typeof server.$inferSelect;
export type channelType = typeof channel.$inferSelect;


export type CreateChannelType = Omit<channelType, 'id' | 'createdAt' | 'updatedAt'>;

