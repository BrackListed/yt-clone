import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    clerk_user_id: text("clerk_user_id").notNull().unique(),
    email: text("email").default("").unique(),
    username: text("username").notNull(),
    created_at: timestamp("created_at", {withTimezone: true}).defaultNow().notNull()
})