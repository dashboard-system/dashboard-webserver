import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['engineer', 'maintainer', 'admin', 'user'] })
    .notNull()
    .default('user'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})

export const dashboardData = sqliteTable('dashboard_data', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  dataType: text('data_type').notNull(),
  value: text('value').notNull(),
  timestamp: text('timestamp')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type DashboardData = typeof dashboardData.$inferSelect
export type NewDashboardData = typeof dashboardData.$inferInsert