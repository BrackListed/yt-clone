import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    clerk_user_id: text("clerk_user_id").notNull().unique(),
    email: text("email").default("").unique(),
    username: text("username").notNull(),
    created_at: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
    image_url: text("image_url"),
})

export const uploads = pgTable("uploads", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").references(() => users.id, {onDelete: "cascade"}),
    video_url: text("video_url").notNull().unique(),
    title: text("title").notNull(),
    duration: text('duration').notNull(),
    thumbnail: text('thumbnail').notNull(),
    likes: integer("likes").notNull().default(0),
    dislikes: integer("dislikes").notNull().default(0),
    created_at: timestamp("created_at", {withTimezone: true}).defaultNow().notNull()
})

export const userUploadRelations = relations(users, ({many}) => ({
    uploads: many(uploads)
}))

export const uploadUserRelations = relations(uploads, ({one}) => ({
    users: one(users, {fields: [uploads.user_id], references: [users.id] })
}))

