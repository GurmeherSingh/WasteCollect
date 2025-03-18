import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const UserRole = {
  HOUSEHOLD: 'household',
  COLLECTOR: 'collector',
  RECYCLING: 'recycling',
  ADMIN: 'admin'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: Object.values(UserRole) }).notNull(),
  name: text("name").notNull(),
  rewardPoints: integer("reward_points").default(0),
});

export const pickups = pgTable("pickups", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  collectorId: integer("collector_id"),
  status: text("status", { enum: ['scheduled', 'completed', 'cancelled'] }).notNull(),
  scheduledDate: text("scheduled_date").notNull(),
  wasteType: text("waste_type").notNull(),
  quantity: integer("quantity").notNull(),
});

export const requirements = pgTable("requirements", {
  id: serial("id").primaryKey(),
  recyclingCenterId: integer("recycling_center_id").notNull(),
  wasteType: text("waste_type").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

export const pointTransactions = pgTable("point_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  points: integer("points").notNull(),
  type: text("type", { 
    enum: ['pickup_scheduled', 'pickup_completed', 'recycling_milestone', 'bonus']
  }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type", {
    enum: ['first_pickup', 'ten_pickups', 'hundred_points', 'consistent_recycler']
  }).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  pointsAwarded: integer("points_awarded").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  name: true,
});

export const insertPickupSchema = createInsertSchema(pickups);
export const insertRequirementSchema = createInsertSchema(requirements);
export const insertPointTransactionSchema = createInsertSchema(pointTransactions);
export const insertAchievementSchema = createInsertSchema(achievements);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Pickup = typeof pickups.$inferSelect;
export type Requirement = typeof requirements.$inferSelect;
export type PointTransaction = typeof pointTransactions.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;