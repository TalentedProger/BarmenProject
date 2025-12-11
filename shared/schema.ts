import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import {
  sqliteTable,
  text as sqliteText,
  integer as sqliteInteger,
  real as sqliteReal,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Google Auth and Email/Password
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  nickname: varchar("nickname").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  googleId: varchar("google_id").unique(), // Google OAuth ID
  passwordHash: varchar("password_hash"), // For email/password auth
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ingredients table
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // alcohol, juice, syrup, fruit, ice, spice
  subtype: varchar("subtype", { length: 50 }), // Подкатегория: Вино красное, Вино белое, Вермут и т.д.
  color: varchar("color", { length: 7 }).notNull(), // hex color for visualization
  abv: decimal("abv", { precision: 5, scale: 2 }).default("0"), // alcohol by volume percentage
  pricePerLiter: decimal("price_per_liter", { precision: 10, scale: 2 }).notNull(),
  tasteProfile: jsonb("taste_profile").notNull(), // {sweet: 0-10, sour: 0-10, bitter: 0-10, alcohol: 0-10}
  unit: varchar("unit", { length: 10 }).notNull().default("ml"), // ml, g, piece
  sourceUrl: varchar("source_url", { length: 500 }), // URL товара на сайте источника
  sourceName: varchar("source_name", { length: 100 }), // Название магазина/источника
  sourceIcon: varchar("source_icon", { length: 500 }), // URL иконки магазина
  imageUrl: varchar("image_url", { length: 500 }), // URL изображения товара
  volume: integer("volume"), // Объем упаковки в мл
  createdAt: timestamp("created_at").defaultNow(),
});

// Glass types table
export const glassTypes = pgTable("glass_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  capacity: integer("capacity").notNull(), // in ml
  shape: varchar("shape", { length: 20 }).notNull(), // old-fashioned, highball, martini, shot
  createdAt: timestamp("created_at").defaultNow(),
});

// Cocktail recipes table
export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  instructions: text("instructions"),
  createdBy: varchar("created_by").references(() => users.id),
  glassTypeId: integer("glass_type_id").references(() => glassTypes.id),
  totalVolume: integer("total_volume").notNull(), // in ml
  totalAbv: decimal("total_abv", { precision: 5, scale: 2 }).notNull(),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
  tasteBalance: jsonb("taste_balance").notNull(), // calculated taste profile
  difficulty: varchar("difficulty", { length: 20 }).default("easy"), // easy, medium, hard
  category: varchar("category", { length: 50 }).notNull(), // classic, summer, shot, non-alcoholic
  isPublic: boolean("is_public").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  ratingCount: integer("rating_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Recipe ingredients junction table
export const recipeIngredients = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "cascade" }),
  ingredientId: integer("ingredient_id").references(() => ingredients.id),
  amount: decimal("amount", { precision: 8, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 10 }).notNull(),
  order: integer("order").notNull(), // for layering order
  createdAt: timestamp("created_at").defaultNow(),
});

// User favorite recipes
export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Recipe ratings
export const recipeRatings = pgTable("recipe_ratings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Course progress - tracking user's progress through course modules
export const courseProgress = pgTable("course_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  courseId: varchar("course_id", { length: 50 }).notNull(), // e.g., "mixology-basics"
  moduleId: integer("module_id").notNull(), // Module number (1-12)
  lessonId: integer("lesson_id"), // Lesson within module
  status: varchar("status", { length: 20 }).notNull().default("not_started"), // not_started, in_progress, completed
  testScore: integer("test_score"), // Score in percentage (0-100)
  testAttempts: integer("test_attempts").default(0),
  practiceSubmitted: boolean("practice_submitted").default(false),
  practiceData: jsonb("practice_data"), // Submitted practice work data
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course enrollments - tracking which users are enrolled in which courses
export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  courseId: varchar("course_id", { length: 50 }).notNull(), // e.g., "mixology-basics"
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  certificateUrl: varchar("certificate_url", { length: 500 }),
  overallProgress: integer("overall_progress").default(0), // Percentage 0-100
  status: varchar("status", { length: 20 }).notNull().default("enrolled"), // enrolled, in_progress, completed, dropped
});

// Zod schemas
export const insertIngredientSchema = createInsertSchema(ingredients);
export const insertGlassTypeSchema = createInsertSchema(glassTypes);
export const insertRecipeSchema = createInsertSchema(recipes);
export const insertRecipeIngredientSchema = createInsertSchema(recipeIngredients);
export const insertUserFavoriteSchema = createInsertSchema(userFavorites);
export const insertRecipeRatingSchema = createInsertSchema(recipeRatings);
export const insertCourseProgressSchema = createInsertSchema(courseProgress);
export const insertCourseEnrollmentSchema = createInsertSchema(courseEnrollments);

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  nickname: z.string().min(2, "Никнейм должен содержать минимум 2 символа").max(50, "Никнейм не может быть длиннее 50 символов"),
});

export const loginSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(1, "Пароль обязателен"),
});

export const insertUserSchema = createInsertSchema(users, {
  nickname: z.string().min(2, "Никнейм должен содержать минимум 2 символа").max(50, "Никнейм не может быть длиннее 50 символов"),
  email: z.string().email("Неверный формат email"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type Ingredient = typeof ingredients.$inferSelect;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type GlassType = typeof glassTypes.$inferSelect;
export type InsertGlassType = z.infer<typeof insertGlassTypeSchema>;
export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type InsertRecipeIngredient = z.infer<typeof insertRecipeIngredientSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type RecipeRating = typeof recipeRatings.$inferSelect;
export type InsertRecipeRating = z.infer<typeof insertRecipeRatingSchema>;
export type CourseProgress = typeof courseProgress.$inferSelect;
export type InsertCourseProgress = z.infer<typeof insertCourseProgressSchema>;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = z.infer<typeof insertCourseEnrollmentSchema>;
