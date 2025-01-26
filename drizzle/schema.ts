import { pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const user = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name',{ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    password: text('password').notNull(),
    status: varchar('status',{ length: 20 }).default('active'),
    accessToken: text('access_token'),
    lastLogin: timestamp('last_seen').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
    uniqueIndex('email_idx').on(t.email),
]);