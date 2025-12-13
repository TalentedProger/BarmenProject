var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  courseEnrollments: () => courseEnrollments,
  courseProgress: () => courseProgress,
  glassTypes: () => glassTypes,
  ingredients: () => ingredients,
  insertCourseEnrollmentSchema: () => insertCourseEnrollmentSchema,
  insertCourseProgressSchema: () => insertCourseProgressSchema,
  insertGlassTypeSchema: () => insertGlassTypeSchema,
  insertIngredientSchema: () => insertIngredientSchema,
  insertRecipeIngredientSchema: () => insertRecipeIngredientSchema,
  insertRecipeRatingSchema: () => insertRecipeRatingSchema,
  insertRecipeSchema: () => insertRecipeSchema,
  insertUserFavoriteSchema: () => insertUserFavoriteSchema,
  insertUserSchema: () => insertUserSchema,
  loginSchema: () => loginSchema,
  recipeIngredients: () => recipeIngredients,
  recipeRatings: () => recipeRatings,
  recipes: () => recipes,
  registerSchema: () => registerSchema,
  sessions: () => sessions,
  userFavorites: () => userFavorites,
  users: () => users
});
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
  uuid
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var sessions, users, ingredients, glassTypes, recipes, recipeIngredients, userFavorites, recipeRatings, courseProgress, courseEnrollments, insertIngredientSchema, insertGlassTypeSchema, insertRecipeSchema, insertRecipeIngredientSchema, insertUserFavoriteSchema, insertRecipeRatingSchema, insertCourseProgressSchema, insertCourseEnrollmentSchema, registerSchema, loginSchema, insertUserSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    users = pgTable("users", {
      id: varchar("id").primaryKey().notNull(),
      email: varchar("email").unique(),
      nickname: varchar("nickname").notNull(),
      profileImageUrl: varchar("profile_image_url"),
      googleId: varchar("google_id").unique(),
      // Google OAuth ID
      passwordHash: varchar("password_hash"),
      // For email/password auth
      emailVerified: boolean("email_verified").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    ingredients = pgTable("ingredients", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 100 }).notNull(),
      category: varchar("category", { length: 50 }).notNull(),
      // alcohol, juice, syrup, fruit, ice, spice
      subtype: varchar("subtype", { length: 50 }),
      // Подкатегория: Вино красное, Вино белое, Вермут и т.д.
      color: varchar("color", { length: 7 }).notNull(),
      // hex color for visualization
      abv: decimal("abv", { precision: 5, scale: 2 }).default("0"),
      // alcohol by volume percentage
      pricePerLiter: decimal("price_per_liter", { precision: 10, scale: 2 }).notNull(),
      tasteProfile: jsonb("taste_profile").notNull(),
      // {sweet: 0-10, sour: 0-10, bitter: 0-10, alcohol: 0-10}
      unit: varchar("unit", { length: 10 }).notNull().default("ml"),
      // ml, g, piece
      sourceUrl: varchar("source_url", { length: 500 }),
      // URL товара на сайте источника
      sourceName: varchar("source_name", { length: 100 }),
      // Название магазина/источника
      sourceIcon: varchar("source_icon", { length: 500 }),
      // URL иконки магазина
      imageUrl: varchar("image_url", { length: 500 }),
      // URL изображения товара
      volume: integer("volume"),
      // Объем упаковки в мл
      createdAt: timestamp("created_at").defaultNow()
    });
    glassTypes = pgTable("glass_types", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 50 }).notNull(),
      capacity: integer("capacity").notNull(),
      // in ml
      shape: varchar("shape", { length: 20 }).notNull(),
      // old-fashioned, highball, martini, shot
      createdAt: timestamp("created_at").defaultNow()
    });
    recipes = pgTable("recipes", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: varchar("name", { length: 100 }).notNull(),
      description: text("description"),
      instructions: text("instructions"),
      createdBy: varchar("created_by").references(() => users.id),
      glassTypeId: integer("glass_type_id").references(() => glassTypes.id),
      totalVolume: integer("total_volume").notNull(),
      // in ml
      totalAbv: decimal("total_abv", { precision: 5, scale: 2 }).notNull(),
      totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
      tasteBalance: jsonb("taste_balance").notNull(),
      // calculated taste profile
      difficulty: varchar("difficulty", { length: 20 }).default("easy"),
      // easy, medium, hard
      category: varchar("category", { length: 50 }).notNull(),
      // classic, summer, shot, non-alcoholic
      isPublic: boolean("is_public").default(true),
      rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
      ratingCount: integer("rating_count").default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    recipeIngredients = pgTable("recipe_ingredients", {
      id: serial("id").primaryKey(),
      recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "cascade" }),
      ingredientId: integer("ingredient_id").references(() => ingredients.id),
      amount: decimal("amount", { precision: 8, scale: 2 }).notNull(),
      unit: varchar("unit", { length: 10 }).notNull(),
      order: integer("order").notNull(),
      // for layering order
      createdAt: timestamp("created_at").defaultNow()
    });
    userFavorites = pgTable("user_favorites", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
      recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "cascade" }),
      createdAt: timestamp("created_at").defaultNow()
    });
    recipeRatings = pgTable("recipe_ratings", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
      recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "cascade" }),
      rating: integer("rating").notNull(),
      // 1-5 stars
      review: text("review"),
      createdAt: timestamp("created_at").defaultNow()
    });
    courseProgress = pgTable("course_progress", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      courseId: varchar("course_id", { length: 50 }).notNull(),
      // e.g., "mixology-basics"
      moduleId: integer("module_id").notNull(),
      // Module number (1-12)
      lessonId: integer("lesson_id"),
      // Lesson within module
      status: varchar("status", { length: 20 }).notNull().default("not_started"),
      // not_started, in_progress, completed
      testScore: integer("test_score"),
      // Score in percentage (0-100)
      testAttempts: integer("test_attempts").default(0),
      practiceSubmitted: boolean("practice_submitted").default(false),
      practiceData: jsonb("practice_data"),
      // Submitted practice work data
      completedAt: timestamp("completed_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    courseEnrollments = pgTable("course_enrollments", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      courseId: varchar("course_id", { length: 50 }).notNull(),
      // e.g., "mixology-basics"
      enrolledAt: timestamp("enrolled_at").defaultNow(),
      completedAt: timestamp("completed_at"),
      certificateUrl: varchar("certificate_url", { length: 500 }),
      overallProgress: integer("overall_progress").default(0),
      // Percentage 0-100
      status: varchar("status", { length: 20 }).notNull().default("enrolled")
      // enrolled, in_progress, completed, dropped
    });
    insertIngredientSchema = createInsertSchema(ingredients);
    insertGlassTypeSchema = createInsertSchema(glassTypes);
    insertRecipeSchema = createInsertSchema(recipes);
    insertRecipeIngredientSchema = createInsertSchema(recipeIngredients);
    insertUserFavoriteSchema = createInsertSchema(userFavorites);
    insertRecipeRatingSchema = createInsertSchema(recipeRatings);
    insertCourseProgressSchema = createInsertSchema(courseProgress);
    insertCourseEnrollmentSchema = createInsertSchema(courseEnrollments);
    registerSchema = z.object({
      email: z.string().email("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email"),
      password: z.string().min(6, "\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432"),
      nickname: z.string().min(2, "\u041D\u0438\u043A\u043D\u0435\u0439\u043C \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 2 \u0441\u0438\u043C\u0432\u043E\u043B\u0430").max(50, "\u041D\u0438\u043A\u043D\u0435\u0439\u043C \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0434\u043B\u0438\u043D\u043D\u0435\u0435 50 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432")
    });
    loginSchema = z.object({
      email: z.string().email("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email"),
      password: z.string().min(1, "\u041F\u0430\u0440\u043E\u043B\u044C \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D")
    });
    insertUserSchema = createInsertSchema(users, {
      nickname: z.string().min(2, "\u041D\u0438\u043A\u043D\u0435\u0439\u043C \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 2 \u0441\u0438\u043C\u0432\u043E\u043B\u0430").max(50, "\u041D\u0438\u043A\u043D\u0435\u0439\u043C \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0434\u043B\u0438\u043D\u043D\u0435\u0435 50 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432"),
      email: z.string().email("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email")
    }).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
  }
});

// client/src/lib/alkoteka-real-products.ts
var ALKOTEKA_REAL_PRODUCTS;
var init_alkoteka_real_products = __esm({
  "client/src/lib/alkoteka-real-products.ts"() {
    "use strict";
    ALKOTEKA_REAL_PRODUCTS = [
      // === ВИСКИ (10 товаров) ===
      { name: "\u0412\u0438\u0441\u043A\u0438 Jack Daniel's 0.7\u043B", category: "alcohol", color: "#D2691E", abv: 40, pricePerLiter: 3e3, volume: 700, tasteProfile: { sweet: 2, sour: 0, bitter: 4, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/dzhek-daniels-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 Jameson 0.7\u043B", category: "alcohol", color: "#DAA520", abv: 40, pricePerLiter: 2571, volume: 700, tasteProfile: { sweet: 1, sour: 0, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/dzheymson-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 Ballantine's Finest 0.7\u043B", category: "alcohol", color: "#CD853F", abv: 40, pricePerLiter: 2e3, volume: 700, tasteProfile: { sweet: 1, sour: 0, bitter: 4, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/ballantayns-finest-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 Grant's Family Reserve 0.7\u043B", category: "alcohol", color: "#D2691E", abv: 40, pricePerLiter: 1857, volume: 700, tasteProfile: { sweet: 1, sour: 0, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/grants-family-reserve-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 Jim Beam White 0.7\u043B", category: "alcohol", color: "#D2691E", abv: 40, pricePerLiter: 2143, volume: 700, tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/jim-beam-white-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 Tullamore Dew 0.7\u043B", category: "alcohol", color: "#DAA520", abv: 40, pricePerLiter: 2429, volume: 700, tasteProfile: { sweet: 1, sour: 0, bitter: 2, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/tullamore-dew-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 Johnnie Walker Red Label 0.7\u043B", category: "alcohol", color: "#CD853F", abv: 40, pricePerLiter: 2714, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 5, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/johnnie-walker-red-label-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 William Lawson's 0.7\u043B", category: "alcohol", color: "#D2691E", abv: 40, pricePerLiter: 1571, volume: 700, tasteProfile: { sweet: 1, sour: 0, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/william-lawsons-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 Chivas Regal 12 \u043B\u0435\u0442 0.7\u043B", category: "alcohol", color: "#DAA520", abv: 40, pricePerLiter: 4286, volume: 700, tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/chivas-regal-12-let-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 White Horse 0.7\u043B", category: "alcohol", color: "#CD853F", abv: 40, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 4, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/white-horse-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      // === ВОДКА (10 товаров) ===
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0420\u0443\u0441\u0441\u043A\u0438\u0439 \u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442 Original 0.5\u043B", category: "alcohol", color: "#FFFFFF", abv: 40, pricePerLiter: 1400, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/russkiy-standart-original-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 Beluga Noble 0.7\u043B", category: "alcohol", color: "#FFFFFF", abv: 40, pricePerLiter: 2857, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/beluga-noble-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 Green Mark 0.5\u043B", category: "alcohol", color: "#FFFFFF", abv: 40, pricePerLiter: 1e3, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/green-mark-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0426\u0430\u0440\u0441\u043A\u0430\u044F Original 0.5\u043B", category: "alcohol", color: "#FFFFFF", abv: 40, pricePerLiter: 1200, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/tsarskaya-original-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 Imperia 0.5\u043B", category: "alcohol", color: "#FFFFFF", abv: 40, pricePerLiter: 1600, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/imperia-russian-standart-premium-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 Finlandia 0.5\u043B", category: "alcohol", color: "#FFFFFF", abv: 40, pricePerLiter: 2200, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/finlandia-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u041C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u0430\u044F \u041E\u0441\u043E\u0431\u0430\u044F 0.5\u043B", category: "alcohol", color: "#FFFFFF", abv: 40, pricePerLiter: 900, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/moskovskaya-osobaya-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 Platinum 0.5\u043B", category: "alcohol", color: "#FFFFFF", abv: 40, pricePerLiter: 1800, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/platinum-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 Nemiroff Original 0.5\u043B", category: "alcohol", color: "#FFFFFF", abv: 40, pricePerLiter: 1400, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/nemiroff-original-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 Absolut 0.7\u043B", category: "alcohol", color: "#FFFFFF", abv: 40, pricePerLiter: 2143, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/absolyut-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      // === ДЖИН (10 товаров) ===
      { name: "\u0414\u0436\u0438\u043D Bombay Sapphire 0.7\u043B", category: "alcohol", color: "#F0F8FF", abv: 47, pricePerLiter: 2857, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/bombey-sapfir-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0414\u0436\u0438\u043D Tanqueray London Dry 0.7\u043B", category: "alcohol", color: "#F8F8FF", abv: 43, pricePerLiter: 2571, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 4, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/tankerey-london-dry-dzhin-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0414\u0436\u0438\u043D Gordon's London Dry 0.7\u043B", category: "alcohol", color: "#F0F8FF", abv: 37.5, pricePerLiter: 1571, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/gordons-london-dry-gin-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0414\u0436\u0438\u043D Beefeater London Dry 0.7\u043B", category: "alcohol", color: "#F8F8FF", abv: 40, pricePerLiter: 2e3, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/beefeater-london-dry-gin-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0414\u0436\u0438\u043D Greenall's London Dry 0.7\u043B", category: "alcohol", color: "#F0F8FF", abv: 40, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/greenalls-original-london-dry-gin-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0414\u0436\u0438\u043D Gin Mare 0.7\u043B", category: "alcohol", color: "#E0FFFF", abv: 42.7, pricePerLiter: 5714, volume: 700, tasteProfile: { sweet: 0, sour: 1, bitter: 4, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/gin-mare-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0414\u0436\u0438\u043D Hendrick's 0.7\u043B", category: "alcohol", color: "#F0F8FF", abv: 41.4, pricePerLiter: 5429, volume: 700, tasteProfile: { sweet: 0, sour: 1, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/hendricks-gin-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0414\u0436\u0438\u043D Plymouth Original 0.7\u043B", category: "alcohol", color: "#F8F8FF", abv: 41.2, pricePerLiter: 3429, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/plymouth-original-dry-gin-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0414\u0436\u0438\u043D Monkey 47 Schwarzwald 0.5\u043B", category: "alcohol", color: "#F0F8FF", abv: 47, pricePerLiter: 8e3, volume: 500, tasteProfile: { sweet: 0, sour: 1, bitter: 4, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/monkey-47-schwarzwald-dry-gin-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0414\u0436\u0438\u043D Gin Sul 0.5\u043B", category: "alcohol", color: "#E0FFFF", abv: 43, pricePerLiter: 7400, volume: 500, tasteProfile: { sweet: 0, sour: 1, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/gin-sul-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      // === ЛИКЁРЫ (10 товаров) ===
      { name: "\u041B\u0438\u043A\u0451\u0440 Baileys Original 0.7\u043B", category: "alcohol", color: "#D2B48C", abv: 17, pricePerLiter: 2143, volume: 700, tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 4 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/baileys-original-irish-cream-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0451\u0440 Cointreau 0.7\u043B", category: "alcohol", color: "#FFA500", abv: 40, pricePerLiter: 3571, volume: 700, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/cointreau-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0451\u0440 J\xE4germeister 0.7\u043B", category: "alcohol", color: "#8B4513", abv: 35, pricePerLiter: 2429, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 6, alcohol: 7 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/jagermeister-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0451\u0440 Amaretto Disaronno 0.7\u043B", category: "alcohol", color: "#CD853F", abv: 28, pricePerLiter: 2857, volume: 700, tasteProfile: { sweet: 8, sour: 0, bitter: 2, alcohol: 6 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/amaretto-disaronno-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0451\u0440 Kahl\xFAa 0.7\u043B", category: "alcohol", color: "#3E2723", abv: 20, pricePerLiter: 2e3, volume: 700, tasteProfile: { sweet: 8, sour: 0, bitter: 3, alcohol: 5 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/kahlua-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0451\u0440 Sambuca Molinari 0.7\u043B", category: "alcohol", color: "#FFFACD", abv: 40, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 7, sour: 0, bitter: 2, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/sambuca-molinari-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0451\u0440 Aperol 0.7\u043B", category: "alcohol", color: "#FF4500", abv: 11, pricePerLiter: 2143, volume: 700, tasteProfile: { sweet: 4, sour: 3, bitter: 5, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/aperol-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0451\u0440 Campari Bitter 0.7\u043B", category: "alcohol", color: "#DC143C", abv: 25, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 3, sour: 1, bitter: 8, alcohol: 6 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/campari-bitter-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0451\u0440 Becherovka 0.5\u043B", category: "alcohol", color: "#D2691E", abv: 38, pricePerLiter: 1800, volume: 500, tasteProfile: { sweet: 4, sour: 0, bitter: 5, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/becherovka-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0451\u0440 Malibu 0.7\u043B", category: "alcohol", color: "#FFFACD", abv: 21, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 5 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/malibu-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      // === НАСТОЙКИ (10 товаров) ===
      { name: "\u017Bubr\xF3wka 0.7\u043B", category: "alcohol", color: "#F0E68C", abv: 40, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/zubrovka-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0421\u0442\u0430\u0440\u043A\u0430 0.5\u043B", category: "alcohol", color: "#8B4513", abv: 43, pricePerLiter: 2600, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 4, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/starka-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0427\u0435\u0440\u043D\u0430\u044F \u0441\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u0430 \u043D\u0430 \u043A\u043E\u043D\u044C\u044F\u043A\u0435 0.5\u043B", category: "alcohol", color: "#4B0082", abv: 25, pricePerLiter: 1800, volume: 500, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 6 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/chernaya-smorodina-na-konyake-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041A\u0435\u0434\u0440\u043E\u0432\u0430\u044F \u043D\u0430 \u043A\u0435\u0434\u0440\u043E\u0432\u044B\u0445 \u043E\u0440\u0435\u0445\u0430\u0445 0.5\u043B", category: "alcohol", color: "#8B4513", abv: 40, pricePerLiter: 1600, volume: 500, tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/kedrovaya-na-kedrovykh-orekhakh-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041F\u0435\u0440\u0446\u043E\u0432\u043A\u0430 0.5\u043B", category: "alcohol", color: "#B22222", abv: 35, pricePerLiter: 1400, volume: 500, tasteProfile: { sweet: 1, sour: 0, bitter: 4, alcohol: 7 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/pertsovka-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0420\u044F\u0431\u0438\u043D\u043E\u0432\u0430\u044F \u043D\u0430 \u043A\u043E\u043D\u044C\u044F\u043A\u0435 0.5\u043B", category: "alcohol", color: "#8B0000", abv: 30, pricePerLiter: 1800, volume: 500, tasteProfile: { sweet: 6, sour: 2, bitter: 2, alcohol: 6 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/ryabinovaya-na-konyake-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041E\u0445\u043E\u0442\u043D\u0438\u0447\u044C\u044F 0.5\u043B", category: "alcohol", color: "#8B4513", abv: 38, pricePerLiter: 1400, volume: 500, tasteProfile: { sweet: 2, sour: 0, bitter: 5, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/okhotnichya-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D \u043D\u0430 \u043A\u043E\u043D\u044C\u044F\u043A\u0435 0.5\u043B", category: "alcohol", color: "#FFFACD", abv: 30, pricePerLiter: 1800, volume: 500, tasteProfile: { sweet: 6, sour: 5, bitter: 0, alcohol: 6 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/limon-na-konyake-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041A\u043B\u044E\u043A\u0432\u0435\u043D\u043D\u0430\u044F \u043D\u0430 \u043A\u043E\u043D\u044C\u044F\u043A\u0435 0.5\u043B", category: "alcohol", color: "#DC143C", abv: 30, pricePerLiter: 1800, volume: 500, tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 6 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/kl\u044Ekvennaya-na-konyake-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u041C\u0435\u0434\u043E\u0432\u0430\u044F \u043D\u0430 \u043A\u043E\u043D\u044C\u044F\u043A\u0435 0.5\u043B", category: "alcohol", color: "#FFD700", abv: 30, pricePerLiter: 1800, volume: 500, tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 6 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/medovaya-na-konyake-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      // === РОМ (10 товаров) ===
      { name: "\u0420\u043E\u043C Bacardi Carta Blanca 0.5\u043B", category: "alcohol", color: "#FFFACD", abv: 40, pricePerLiter: 2400, volume: 500, tasteProfile: { sweet: 2, sour: 0, bitter: 0, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/bakardi-beliy-rom-500-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0420\u043E\u043C Captain Morgan Spiced Gold 0.7\u043B", category: "alcohol", color: "#8B4513", abv: 35, pricePerLiter: 2e3, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/kapitan-morgan-spiced-gold-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0420\u043E\u043C Havana Club A\xF1ejo 3 a\xF1os 0.7\u043B", category: "alcohol", color: "#DAA520", abv: 40, pricePerLiter: 2143, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 1, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/havana-club-anejo-3-anos-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0420\u043E\u043C Malibu Original 0.7\u043B", category: "alcohol", color: "#FFFACD", abv: 21, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 5 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/malibu-original-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0420\u043E\u043C Bacardi Carta Negra 0.7\u043B", category: "alcohol", color: "#3E2723", abv: 40, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 2, sour: 0, bitter: 2, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/bacardi-carta-negra-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0420\u043E\u043C Captain Morgan Original 1\u043B", category: "alcohol", color: "#8B4513", abv: 35, pricePerLiter: 2e3, volume: 1e3, tasteProfile: { sweet: 4, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/captain-morgan-original-spiced-gold-1000-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0420\u043E\u043C Havana Club A\xF1ejo 7 a\xF1os 0.7\u043B", category: "alcohol", color: "#8B4513", abv: 40, pricePerLiter: 3571, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 2, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/havana-club-anejo-7-anos-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0420\u043E\u043C Bacardi Carta Oro 0.7\u043B", category: "alcohol", color: "#DAA520", abv: 40, pricePerLiter: 2143, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 1, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/bacardi-carta-oro-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0420\u043E\u043C Diplom\xE1tico Reserva Exclusiva 0.7\u043B", category: "alcohol", color: "#8B4513", abv: 40, pricePerLiter: 5714, volume: 700, tasteProfile: { sweet: 6, sour: 0, bitter: 2, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/diplomatico-reserva-exclusiva-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0420\u043E\u043C Plantation 3 Stars 0.7\u043B", category: "alcohol", color: "#FFFACD", abv: 41.2, pricePerLiter: 2571, volume: 700, tasteProfile: { sweet: 2, sour: 0, bitter: 1, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/plantation-3-stars-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      // === ТЕКИЛА (10 товаров) ===
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 Olmeca Blanco 0.7\u043B", category: "alcohol", color: "#F5F5DC", abv: 38, pricePerLiter: 2e3, volume: 700, tasteProfile: { sweet: 1, sour: 1, bitter: 2, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/tekila-olmeka-blanco-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 Olmeca Gold 0.7\u043B", category: "alcohol", color: "#FFD700", abv: 38, pricePerLiter: 2e3, volume: 700, tasteProfile: { sweet: 2, sour: 1, bitter: 2, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/olmeca-gold-tekila-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 Sauza Silver 0.7\u043B", category: "alcohol", color: "#F5F5DC", abv: 38, pricePerLiter: 1857, volume: 700, tasteProfile: { sweet: 1, sour: 1, bitter: 2, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/sauza-silver-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 Sauza Gold 0.7\u043B", category: "alcohol", color: "#FFD700", abv: 38, pricePerLiter: 1857, volume: 700, tasteProfile: { sweet: 2, sour: 1, bitter: 2, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/sauza-gold-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 Sierra Silver 0.7\u043B", category: "alcohol", color: "#F5F5DC", abv: 38, pricePerLiter: 1429, volume: 700, tasteProfile: { sweet: 1, sour: 1, bitter: 2, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/sierra-silver-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 Sierra Gold 0.7\u043B", category: "alcohol", color: "#FFD700", abv: 38, pricePerLiter: 1429, volume: 700, tasteProfile: { sweet: 2, sour: 1, bitter: 2, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/sierra-gold-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 Jose Cuervo Especial Gold 0.7\u043B", category: "alcohol", color: "#FFD700", abv: 38, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 2, sour: 1, bitter: 2, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/jose-cuervo-especial-gold-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 Jose Cuervo Especial Silver 0.7\u043B", category: "alcohol", color: "#F5F5DC", abv: 38, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 1, sour: 1, bitter: 2, alcohol: 8 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/jose-cuervo-especial-silver-700-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 Patr\xF3n Silver 0.75\u043B", category: "alcohol", color: "#F5F5DC", abv: 40, pricePerLiter: 6667, volume: 750, tasteProfile: { sweet: 1, sour: 1, bitter: 1, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/patron-silver-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 Patr\xF3n Reposado 0.75\u043B", category: "alcohol", color: "#FFD700", abv: 40, pricePerLiter: 7333, volume: 750, tasteProfile: { sweet: 2, sour: 1, bitter: 1, alcohol: 9 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/krepkiy-alkogol/patron-reposado-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      // === ИГРИСТОЕ ВИНО (10 товаров) ===
      { name: "\u0418\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0432\u0438\u043D\u043E \u0410\u0431\u0440\u0430\u0443-\u0414\u044E\u0440\u0441\u043E \u0411\u0440\u044E\u0442 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 12, pricePerLiter: 933, volume: 750, tasteProfile: { sweet: 1, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/abrau-durso-brut-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0418\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0432\u0438\u043D\u043E \u0410\u0431\u0440\u0430\u0443-\u0414\u044E\u0440\u0441\u043E \u041F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 12, pricePerLiter: 933, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/abrau-durso-polusladkoe-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0418\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0432\u0438\u043D\u043E Bosca Anniversary 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 7.5, pricePerLiter: 667, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/bosca-anniversary-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0418\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0432\u0438\u043D\u043E Asti Martini 0.75\u043B", category: "alcohol", color: "#F0E68C", abv: 7.5, pricePerLiter: 2e3, volume: 750, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/asti-martini-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0418\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0432\u0438\u043D\u043E Cinzano Asti 0.75\u043B", category: "alcohol", color: "#F0E68C", abv: 7, pricePerLiter: 1600, volume: 750, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/cinzano-asti-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0418\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0432\u0438\u043D\u043E Lambrusco Rosso 0.75\u043B", category: "alcohol", color: "#DC143C", abv: 8, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/lambrusco-rosso-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0418\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0432\u0438\u043D\u043E Prosecco DOC 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 11, pricePerLiter: 1333, volume: 750, tasteProfile: { sweet: 3, sour: 4, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/prosecco-doc-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0418\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0432\u0438\u043D\u043E Freixenet Carta Nevada 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 11.5, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/freixenet-carta-nevada-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0418\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0432\u0438\u043D\u043E Cava Brut 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 11.5, pricePerLiter: 1467, volume: 750, tasteProfile: { sweet: 1, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/cava-brut-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0418\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0432\u0438\u043D\u043E Cr\xE9mant de Loire Brut 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 12, pricePerLiter: 1867, volume: 750, tasteProfile: { sweet: 1, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/cremant-de-loire-brut-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      // === ШАМПАНСКОЕ (10 товаров) ===
      { name: "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435 Mo\xEBt & Chandon Brut Imperial 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 12, pricePerLiter: 6667, volume: 750, tasteProfile: { sweet: 2, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/moet-chandon-brut-imperial-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435 Veuve Clicquot Brut 0.75\u043B", category: "alcohol", color: "#FFD700", abv: 12, pricePerLiter: 8e3, volume: 750, tasteProfile: { sweet: 2, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/veuve-clicquot-brut-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435 Dom P\xE9rignon Vintage 0.75\u043B", category: "alcohol", color: "#FFD700", abv: 12.5, pricePerLiter: 26667, volume: 750, tasteProfile: { sweet: 1, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/dom-perignon-vintage-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435 Piper-Heidsieck Brut 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 12, pricePerLiter: 5333, volume: 750, tasteProfile: { sweet: 2, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/piper-heidsieck-brut-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435 Taittinger Brut R\xE9serve 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 12.5, pricePerLiter: 7333, volume: 750, tasteProfile: { sweet: 2, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/taittinger-brut-reserve-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435 G.H.Mumm Cordon Rouge 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 12, pricePerLiter: 6e3, volume: 750, tasteProfile: { sweet: 2, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/mumm-cordon-rouge-brut-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435 Laurent-Perrier Brut 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 12, pricePerLiter: 7333, volume: 750, tasteProfile: { sweet: 1, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/laurent-perrier-brut-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435 Bollinger Special Cuv\xE9e 0.75\u043B", category: "alcohol", color: "#FFD700", abv: 12, pricePerLiter: 10667, volume: 750, tasteProfile: { sweet: 2, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/bollinger-special-cuvee-brut-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435 Pommery Brut Royal 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 12.5, pricePerLiter: 6e3, volume: 750, tasteProfile: { sweet: 2, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/pommery-brut-royal-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" },
      { name: "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435 Ruinart Blanc de Blancs 0.75\u043B", category: "alcohol", color: "#FFFACD", abv: 12.5, pricePerLiter: 13333, volume: 750, tasteProfile: { sweet: 1, sour: 5, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://alkoteka.com/catalog/shampanskoe-i-igristoe/ruinart-blanc-de-blancs-750-ml/", sourceName: "Alkoteka", sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-sodas-part1.ts
var KRASNOEIBELOE_SODAS_PART1;
var init_krasnoeibeloe_sodas_part1 = __esm({
  "client/src/lib/krasnoeibeloe-sodas-part1.ts"() {
    "use strict";
    KRASNOEIBELOE_SODAS_PART1 = [
      // === СТРАНИЦА 1 ===
      { name: "\u041A\u043E\u043B\u0430 \u0414\u043E\u0431\u0440\u044B\u0439 0.3\u043B", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 150, volume: 300, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gaz_voda_dobryy_kola_pet/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 \u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0421\u0442\u0430\u0438\u043B 0.5\u043B", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 100, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/silnogaz_napitok_b_a_eksport_stail_klassik_kola_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 \u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0421\u0442\u0430\u0438\u043B 2\u043B", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 45, volume: 2e3, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/silnogaz_napitok_b_a_eksport_stail_klassik_kola/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 Fresh Bar 0.48\u043B", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 125, volume: 480, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovnnyy_napitok_fresh_bar_kola/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D\u043E\u0432\u0430\u044F \u0414\u043E\u0431\u0440\u044B\u0439 1\u043B", category: "soda", color: "#FFA500", abv: 0, pricePerLiter: 70, volume: 1e3, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_b_a_silnogaz_dobryy_apelsin/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 \u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0421\u0442\u0430\u0438\u043B 0.33\u043B \u0436/\u0431", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 150, volume: 330, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/silnogaz_napitok_b_a_eksport_stail_kola_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D\u043E\u0432\u0430\u044F \u0414\u043E\u0431\u0440\u044B\u0439 2\u043B", category: "soda", color: "#FFA500", abv: 0, pricePerLiter: 45, volume: 2e3, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_b_a_silnogaz_dobryy_apelsin_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F Fresh Bar Cola Banana 0.48\u043B", category: "soda", color: "#FFD700", abv: 0, pricePerLiter: 125, volume: 480, tasteProfile: { sweet: 7, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_fresh_bar_cola_banana/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 \u0414\u043E\u0431\u0440\u044B\u0439 0.33\u043B \u0441\u0442", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 150, volume: 330, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_dobryy_kola_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 \u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0421\u0442\u0430\u0438\u043B 1\u043B", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 60, volume: 1e3, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/silnogaz_napitok_b_a_eksport_stail_klassik_kola_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 \u041B\u044E\u0431\u0438\u043C\u0430\u044F 2\u043B", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 40, volume: 2e3, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_lyubimaya_kola_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 \u0414\u043E\u0431\u0440\u044B\u0439 0.33\u043B \u0436/\u0431", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 150, volume: 330, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_b_a_silnogaz_dobryy_kola_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 \u0414\u043E\u0431\u0440\u044B\u0439 1\u043B", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 70, volume: 1e3, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_b_a_silnogaz_dobryy_kola_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D-\u041B\u0430\u0439\u043C \u0414\u043E\u0431\u0440\u044B\u0439 2\u043B", category: "soda", color: "#32CD32", abv: 0, pricePerLiter: 45, volume: 2e3, tasteProfile: { sweet: 4, sour: 5, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_b_a_silnogaz_dobryy_limon_laym/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0426\u0438\u0442\u0440\u0443\u0441 Fresh Bar 0.48\u043B", category: "soda", color: "#FFD700", abv: 0, pricePerLiter: 125, volume: 480, tasteProfile: { sweet: 5, sour: 5, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/silnogaz_napitok_b_a_fresh_bar_tsitrus_ays/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 Fresh Bar 1.5\u043B", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 60, volume: 1500, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_fresh_bar_kola/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D-\u041B\u0430\u0439\u043C \u0414\u043E\u0431\u0440\u044B\u0439 1\u043B", category: "soda", color: "#32CD32", abv: 0, pricePerLiter: 70, volume: 1e3, tasteProfile: { sweet: 4, sour: 5, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_b_a_silnogaz_dobryy_limon_laym_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041C\u0438\u043B\u043A\u0438\u0441 \u043A\u043B\u0443\u0431\u043D\u0438\u043A\u0430 0.25\u043B \u0436/\u0431", category: "soda", color: "#FF69B4", abv: 0, pricePerLiter: 200, volume: 250, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/21499-molochno-klubnichnyy-napitok-milkis-gaz-0-25/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041C\u0438\u043B\u043A\u0438\u0441 0.25\u043B \u0436/\u0431", category: "soda", color: "#E6E6FA", abv: 0, pricePerLiter: 200, volume: 250, tasteProfile: { sweet: 6, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/21498-molochnyy-napitok-milkis-gaz-0-25/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u0414\u0436\u0443\u0441\u0438 \u0411\u0435\u0440\u0440\u0438 \u0422\u0440\u043E\u043F\u0438\u043A 0.75\u043B", category: "soda", color: "#FF6347", abv: 0, pricePerLiter: 80, volume: 750, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_b_a_silnogaz_dzhusi_berri_tropik/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D\u0430\u0434 1.5\u043B", category: "soda", color: "#FFFACD", abv: 0, pricePerLiter: 60, volume: 1500, tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/silnogaz_napitok_b_a_limonad/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u0424\u0440\u0438\u043C\u0435\u043D \u0414\u0436\u0438\u043D \u0410\u0440\u0431\u0443\u0437 \u0438 \u041B\u0430\u0439\u043C 0.33\u043B \u0441\u0442", category: "soda", color: "#90EE90", abv: 0, pricePerLiter: 180, volume: 330, tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_bezalkogolnyy_frimen_dzhin_arbuz_i_laym_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u0424\u0440\u0438\u043C\u0435\u043D \u0420\u043E\u043C \u0410\u043D\u0430\u043D\u0430\u0441 \u0438 \u041A\u043E\u043A\u043E\u0441 0.33\u043B \u0441\u0442", category: "soda", color: "#FFD700", abv: 0, pricePerLiter: 180, volume: 330, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_bezalkogolnyy_frimen_rom_ananas_i_kokos_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 \u0414\u043E\u0431\u0440\u044B\u0439 2\u043B", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 45, volume: 2e3, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_b_a_silnogaz_dobryy_kola/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-sodas-part2.ts
var KRASNOEIBELOE_SODAS_PART2;
var init_krasnoeibeloe_sodas_part2 = __esm({
  "client/src/lib/krasnoeibeloe-sodas-part2.ts"() {
    "use strict";
    KRASNOEIBELOE_SODAS_PART2 = [
      // === СТРАНИЦА 2 ===
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F Fresh Bar Jelly Bears 0.48\u043B", category: "soda", color: "#FF6347", abv: 0, pricePerLiter: 125, volume: 480, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_fresh_bar_jelly_bears/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D\u0430\u0434 \u0420\u0438\u0447 \u0438\u043D\u0434\u0438\u0430\u043D \u0442\u043E\u043D\u0438\u043A 1\u043B", category: "soda", color: "#FFD700", abv: 0, pricePerLiter: 70, volume: 1e3, tasteProfile: { sweet: 3, sour: 4, bitter: 2, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gaz_voda_rich_indiana_tonik_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041A\u0440\u0430\u0444\u0442 \u0420\u043E\u044F\u043B \u041A\u043B\u0443\u0431\u043D\u0438\u043A\u0430 \u0438 \u041A\u0438\u0432\u0438 0.41\u043B \u0441\u0442", category: "soda", color: "#FF1493", abv: 0, pricePerLiter: 145, volume: 410, tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_kraft_royal_klubnika_i_kivi_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D\u043E\u0432\u0430\u044F \u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0421\u0442\u0430\u0438\u043B 2\u043B", category: "soda", color: "#FFA500", abv: 0, pricePerLiter: 45, volume: 2e3, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_export_style_apelsin/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D-\u041B\u0430\u0439\u043C \u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0421\u0442\u0430\u0438\u043B 2\u043B", category: "soda", color: "#32CD32", abv: 0, pricePerLiter: 45, volume: 2e3, tasteProfile: { sweet: 4, sour: 5, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_export_style_limon_laym/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041A\u0440\u0430\u0444\u0442 \u0420\u043E\u044F\u043B \u0424\u0435\u0439\u0445\u043E\u0430 \u0438 \u044F\u0433\u043E\u0434\u044B \u0410\u0441\u0430\u0438 0.41\u043B \u0441\u0442", category: "soda", color: "#9370DB", abv: 0, pricePerLiter: 145, volume: 410, tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_kraft_royal_feykhoa_i_yagody_asai_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D\u0430\u0434 \u042D\u0432\u0435\u0440\u0432\u0435\u0441\u0441 \u0411\u0438\u0442\u0442\u0435\u0440 \u041B\u0435\u043C\u043E\u043D 1\u043B", category: "soda", color: "#FFFFE0", abv: 0, pricePerLiter: 80, volume: 1e3, tasteProfile: { sweet: 4, sour: 5, bitter: 2, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_b_a_silnogaz_evervess_bitter_lemon/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F Fresh Bar \u041C\u0435\u0440\u0440\u0438 \u0411\u0435\u0440\u0440\u0438 0.48\u043B", category: "soda", color: "#DC143C", abv: 0, pricePerLiter: 125, volume: 480, tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_fresh_bar_merry_berry/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D\u0430\u0434 \u0420\u0438\u0447 \u0431\u0438\u0442\u0442\u0435\u0440 \u043B\u0438\u043C\u043E\u043D 1\u043B", category: "soda", color: "#FFFFE0", abv: 0, pricePerLiter: 70, volume: 1e3, tasteProfile: { sweet: 4, sour: 5, bitter: 2, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gaz_voda_rich_biter_limon/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 \u0414\u043E\u0431\u0440\u044B\u0439 \u0431\u0435\u0437 \u0441\u0430\u0445\u0430\u0440\u0430 1\u043B", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 75, volume: 1e3, tasteProfile: { sweet: 3, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_bezalkogolnyy_silnogazirovannyy_dobryy_kola_bez_sakhara/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 Fresh Bar \u0412\u0430\u043D\u0438\u043B\u043B\u0430 0.48\u043B", category: "soda", color: "#8B4513", abv: 0, pricePerLiter: 125, volume: 480, tasteProfile: { sweet: 7, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_fresh_bar_kola_vanilla/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D\u0430\u0434 \u0421\u0442\u0430\u0440\u044B\u0435 \u0414\u043E\u0431\u0440\u044B\u0435 \u0422\u0440\u0430\u0434\u0438\u0446\u0438\u0438 0.5\u043B \u0441\u0442", category: "soda", color: "#FFFACD", abv: 0, pricePerLiter: 120, volume: 500, tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_starye_dobrye_traditsii_limonad_steklo/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D\u0430\u0434 \u041B\u0430\u0439\u043C\u043E\u043D \u0424\u0440\u0435\u0448 0.33\u043B \u0436/\u0431", category: "soda", color: "#32CD32", abv: 0, pricePerLiter: 150, volume: 330, tasteProfile: { sweet: 5, sour: 5, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_laymon_fresh_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u0413\u0440\u0438\u043D\u043C\u0438 \u0421\u0442\u0440\u0435\u0441\u0441 \u041A\u043E\u043D\u0442\u0440\u043E\u043B 0.33\u043B \u0436/\u0431", category: "soda", color: "#8B008B", abv: 0, pricePerLiter: 180, volume: 330, tasteProfile: { sweet: 5, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_grinmi_stress_kontrol_yagody_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u0413\u0440\u0438\u043D\u043C\u0438 \u0418\u043C\u043C\u0443\u043D\u0438\u0442\u0438 \u041F\u0440\u043E\u0442\u0435\u043A\u0442 0.33\u043B \u0436/\u0431", category: "soda", color: "#FFD700", abv: 0, pricePerLiter: 180, volume: 330, tasteProfile: { sweet: 5, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_grinmi_immuniti_protekt_tsitrus_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D\u0430\u0434 \u041B\u0430\u0439\u043C\u043E\u043D \u0444\u0440\u0435\u0448 \u043C\u0430\u043A\u0441 1\u043B", category: "soda", color: "#32CD32", abv: 0, pricePerLiter: 70, volume: 1e3, tasteProfile: { sweet: 5, sour: 5, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/gazirovannyy_napitok_laymon_fresh_maks_1l/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 Fresh Bar \u041B\u0438\u043C\u043E\u043D 0.48\u043B", category: "soda", color: "#FFD700", abv: 0, pricePerLiter: 125, volume: 480, tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_fresh_bar_kola_limon/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F Fresh Bar \u041C\u0435\u043B\u043E\u043D\u0435\u0439\u0434 \u041C\u043E\u0445\u0438\u0442\u043E 0.48\u043B", category: "soda", color: "#98FB98", abv: 0, pricePerLiter: 125, volume: 480, tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_fresh_bar_meloneyd_mokhito/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      // === СТРАНИЦА 3 ===
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u0415\u0441\u0441\u0435\u043D\u0442\u0443\u043A\u0438 \u0422\u0430\u0440\u0445\u0443\u043D 0.5\u043B \u0441\u0442", category: "soda", color: "#90EE90", abv: 0, pricePerLiter: 120, volume: 500, tasteProfile: { sweet: 5, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_essentuki_tarkhun_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u0417\u0438\u0437\u0437\u0438 D \u0432\u0438\u0442\u0430\u043C\u0438\u043D 0.33\u043B \u0436/\u0431", category: "soda", color: "#FFD700", abv: 0, pricePerLiter: 180, volume: 330, tasteProfile: { sweet: 5, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_zizzi_d_vitamin_bezalkogolnyy_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u0417\u0438\u0437\u0437\u0438 \u0412 \u0432\u0438\u0442\u0430\u043C\u0438\u043D 0.33\u043B \u0436/\u0431", category: "soda", color: "#FF6347", abv: 0, pricePerLiter: 180, volume: 330, tasteProfile: { sweet: 5, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_zizzi_v_vitamin_bezalkogolnyy_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u0417\u0438\u0437\u0437\u0438 \u0421 \u0432\u0438\u0442\u0430\u043C\u0438\u043D 0.33\u043B \u0436/\u0431", category: "soda", color: "#FFA500", abv: 0, pricePerLiter: 180, volume: 330, tasteProfile: { sweet: 5, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_zizzi_s_vitamin_bezalkogolnyy_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041C\u0438\u043B\u043A \u0412\u044D\u0439\u0432 \u0421\u043B\u0430\u0434\u043A\u0430\u044F \u0432\u0430\u0442\u0430 0.5\u043B", category: "soda", color: "#FFB6C1", abv: 0, pricePerLiter: 120, volume: 500, tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_milk_veyv_s_so_vkusom_sladkaya_vata/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041C\u0438\u043B\u043A \u0412\u044D\u0439\u0432 \u043A\u043B\u0443\u0431\u043D\u0438\u043A\u0430 0.33\u043B \u0436/\u0431", category: "soda", color: "#FF69B4", abv: 0, pricePerLiter: 180, volume: 330, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_milk_veyv_s_klubnika_bezalkogolnyy_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041C\u0438\u043B\u043A \u0412\u044D\u0439\u0432 \u043C\u0430\u043D\u0433\u043E \u043C\u0430\u0440\u0430\u043A\u0443\u0439\u044F 0.33\u043B \u0436/\u0431", category: "soda", color: "#FFD700", abv: 0, pricePerLiter: 180, volume: 330, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_milk_veyv_s_mango_marakuyya_bezalkogolnyy_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041D\u0430\u0442\u0430\u0445\u0442\u0430\u0440\u0438 \u0413\u0440\u0443\u0448\u0430 1.5\u043B", category: "soda", color: "#F0E68C", abv: 0, pricePerLiter: 80, volume: 1500, tasteProfile: { sweet: 6, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_natakhtari_grusha_bezalkogolnyy_srednegazirovannyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041D\u0430\u0442\u0430\u0445\u0442\u0430\u0440\u0438 \u0413\u0440\u0443\u0448\u0430 0.5\u043B \u0441\u0442", category: "soda", color: "#F0E68C", abv: 0, pricePerLiter: 140, volume: 500, tasteProfile: { sweet: 6, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_natakhtari_grusha_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041D\u0430\u0442\u0430\u0445\u0442\u0430\u0440\u0438 \u0421\u0430\u043F\u0435\u0440\u0430\u0432\u0438 1.5\u043B", category: "soda", color: "#8B0000", abv: 0, pricePerLiter: 80, volume: 1500, tasteProfile: { sweet: 5, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_natakhtari_saperavi_bezalkogolnyy_srednegazirovannyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041D\u0430\u0442\u0430\u0445\u0442\u0430\u0440\u0438 \u0421\u0430\u043F\u0435\u0440\u0430\u0432\u0438 0.5\u043B \u0441\u0442", category: "soda", color: "#8B0000", abv: 0, pricePerLiter: 140, volume: 500, tasteProfile: { sweet: 5, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_natakhtari_saperavi_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u041D\u0430\u0442\u0430\u0445\u0442\u0430\u0440\u0438 \u0424\u0435\u0439\u0445\u043E\u0430 0.5\u043B \u0441\u0442", category: "soda", color: "#90EE90", abv: 0, pricePerLiter: 140, volume: 500, tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_natakhtari_feykhoa_st_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043C\u043E\u043D\u0430\u0434 \u0420\u0438\u0447 \u0411\u0438\u0442\u0442\u0435\u0440 \u041B\u0435\u043C\u043E\u043D 1.5\u043B", category: "soda", color: "#FFFFE0", abv: 0, pricePerLiter: 67, volume: 1500, tasteProfile: { sweet: 4, sour: 5, bitter: 2, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_rich_bitter_lemon/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u0430\u044F \u0420\u0438\u0447 \u041A\u043E\u043A\u0442\u0435\u0439\u043B\u044C \u0421\u043F\u0440\u0438\u0442\u0446 0.33\u043B \u0436/\u0431", category: "soda", color: "#FF6347", abv: 0, pricePerLiter: 180, volume: 330, tasteProfile: { sweet: 6, sour: 4, bitter: 1, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_rich_kokteyl_spritts_krasnyy_apelsin_zh_b_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043B\u0430 \u042D\u0432\u0435\u0440\u0432\u0435\u0441\u0441 0.25\u043B \u0441\u0442", category: "soda", color: "#00BFFF", abv: 0, pricePerLiter: 200, volume: 250, tasteProfile: { sweet: 6, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/gazirovannaya-voda/napitok_evervess_kola_bezalkogolnyy_silnogazirovannyy_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-sodas.ts
var KRASNOEIBELOE_SODAS;
var init_krasnoeibeloe_sodas = __esm({
  "client/src/lib/krasnoeibeloe-sodas.ts"() {
    "use strict";
    init_krasnoeibeloe_sodas_part1();
    init_krasnoeibeloe_sodas_part2();
    KRASNOEIBELOE_SODAS = [
      ...KRASNOEIBELOE_SODAS_PART1,
      ...KRASNOEIBELOE_SODAS_PART2
    ];
  }
});

// client/src/lib/krasnoeibeloe-juices-part1.ts
var KRASNOEIBELOE_JUICES_PART1;
var init_krasnoeibeloe_juices_part1 = __esm({
  "client/src/lib/krasnoeibeloe-juices-part1.ts"() {
    "use strict";
    KRASNOEIBELOE_JUICES_PART1 = [
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u043C\u0443\u043B\u044C\u0442\u0438\u0444\u0440\u0443\u043A\u0442 1.93\u043B", category: "juice", color: "#FF8C00", abv: 0, pricePerLiter: 41, volume: 1930, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_multifruktovyy_divnyy_sad_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u041A\u0440\u0430\u043B \u0413\u0440\u0430\u043D\u0430\u0442\u043E\u0432\u044B\u0439 1\u043B", category: "juice", color: "#8B0000", abv: 0, pricePerLiter: 150, volume: 1e3, tasteProfile: { sweet: 6, sour: 5, bitter: 1, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/__445/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u0414\u043E\u0431\u0440\u044B\u0439 \u041C\u0443\u043B\u044C\u0442\u0438\u0444\u0440\u0443\u043A\u0442 2\u043B", category: "juice", color: "#FF8C00", abv: 0, pricePerLiter: 55, volume: 2e3, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/24646-nektar-dobryy-multifrukt-2-0-6/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0420\u0438\u0447 \u0413\u0440\u0435\u0439\u043F\u0444\u0440\u0443\u0442 1\u043B", category: "juice", color: "#FFB6C1", abv: 0, pricePerLiter: 90, volume: 1e3, tasteProfile: { sweet: 4, sour: 6, bitter: 3, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/22220-sok-rich-greypfrut-1l-/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u0420\u0438\u0447 \u0412\u0438\u0448\u043D\u044F 1\u043B", category: "juice", color: "#8B0000", abv: 0, pricePerLiter: 85, volume: 1e3, tasteProfile: { sweet: 7, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/21901-nektar-rich-vishnya-1l-/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0414\u043E\u0431\u0440\u044B\u0439 \u041F\u0430\u043B\u043F\u0438 \u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D", category: "juice", color: "#FFA500", abv: 0, pricePerLiter: 78, volume: 900, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/sokosoderzhashchie-napitki/21851-napitok-dobryy-apelsin-s-myakotyu-0-9/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0420\u0438\u0447 \u042F\u0431\u043B\u043E\u043A\u043E 1\u043B", category: "juice", color: "#F0E68C", abv: 0, pricePerLiter: 85, volume: 1e3, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/22223-sok-rich-yabloko-1l-/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0420\u0438\u0447 \u0422\u043E\u043C\u0430\u0442 \u0441 \u0441\u043E\u043B\u044C\u044E 1\u043B", category: "juice", color: "#DC143C", abv: 0, pricePerLiter: 85, volume: 1e3, tasteProfile: { sweet: 3, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/22222-sok-rich-tomat-1l-/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0420\u0438\u0447 \u0410\u043D\u0430\u043D\u0430\u0441 \u0441 \u043C\u044F\u043A\u043E\u0442\u044C\u044E 1\u043B", category: "juice", color: "#FFD700", abv: 0, pricePerLiter: 90, volume: 1e3, tasteProfile: { sweet: 8, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/__395/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u041A\u0440\u0430\u043B \u043C\u0430\u043D\u0433\u043E 1\u043B", category: "juice", color: "#FF8C00", abv: 0, pricePerLiter: 140, volume: 1e3, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_kral_mango/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u041A\u0440\u0430\u043B \u0413\u0440\u0430\u043D\u0430\u0442\u043E\u0432\u044B\u0439 0.25\u043B", category: "juice", color: "#8B0000", abv: 0, pricePerLiter: 280, volume: 250, tasteProfile: { sweet: 6, sour: 5, bitter: 1, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/sok_granatovyy_pryamogo_otzhima/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u041C\u043E\u0440\u0441\u044D\u043B\u044C \u043A\u043B\u044E\u043A\u0432\u0430 1\u043B", category: "juice", color: "#DC143C", abv: 0, pricePerLiter: 70, volume: 1e3, tasteProfile: { sweet: 5, sour: 6, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/sokosoderzhashchie-napitki/napitok_b_a_negaz_morsel_klyukva_i_brusnika/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0424\u0440\u0443\u0442\u043E\u041D\u044F\u043D\u044F \u042F\u0431\u043B\u043E\u043A\u043E 0.2\u043B", category: "juice", color: "#F0E68C", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/__1767/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F \u044F\u0431\u043B\u043E\u0447\u043D\u044B\u0439 1\u043B", category: "juice", color: "#F0E68C", abv: 0, pricePerLiter: 70, volume: 1e3, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/__2087/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u044F\u0431\u043B\u043E\u0447\u043D\u044B\u0439 1.93\u043B", category: "juice", color: "#F0E68C", abv: 0, pricePerLiter: 41, volume: 1930, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_yablochnyy_divnyy_sad_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F \u0442\u043E\u043C\u0430\u0442", category: "juice", color: "#DC143C", abv: 0, pricePerLiter: 74, volume: 950, tasteProfile: { sweet: 3, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_sady_pridonya_tomatnyy_s_solyu_s_myakotyu/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F \u0442\u043E\u043C\u0430\u0442 1\u043B", category: "juice", color: "#DC143C", abv: 0, pricePerLiter: 70, volume: 1e3, tasteProfile: { sweet: 3, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/sok_sady_pridonya_sok_tomatnyy_s_solyu_s_myakotyu_vosstanovlennyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041C\u043E\u0440\u0441 DeVita \u043A\u043B\u044E\u043A\u0432\u0435\u043D\u043D\u044B\u0439 1\u043B", category: "juice", color: "#DC143C", abv: 0, pricePerLiter: 75, volume: 1e3, tasteProfile: { sweet: 5, sour: 6, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/sokosoderzhashchie-napitki/mors_devita_klyukvennyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u041C\u043E\u0439 \u043C\u0443\u043B\u044C\u0442\u0438\u0444\u0440\u0443\u043A\u0442 0.2\u043B", category: "juice", color: "#FF8C00", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/detskiy_nektar_moy_multifrukt/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F 0.95\u043B", category: "juice", color: "#FF8C00", abv: 0, pricePerLiter: 74, volume: 950, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_sady_pridonya_multifrutovyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F \u044F\u0431\u043B\u043E\u043A\u043E", category: "juice", color: "#F0E68C", abv: 0, pricePerLiter: 74, volume: 950, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_sady_pridonya_yablochnyy_osvetl/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F \u044F\u0431\u043B\u043E\u043A\u043E-\u0441\u043C\u043E\u0440", category: "juice", color: "#8B008B", abv: 0, pricePerLiter: 75, volume: 1e3, tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/__1526/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u041A\u0440\u0430\u043B \u0432\u0438\u0448\u043D\u044F 1\u043B", category: "juice", color: "#8B0000", abv: 0, pricePerLiter: 140, volume: 1e3, tasteProfile: { sweet: 7, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_kral_vishnya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-juices-part2.ts
var KRASNOEIBELOE_JUICES_PART2;
var init_krasnoeibeloe_juices_part2 = __esm({
  "client/src/lib/krasnoeibeloe-juices-part2.ts"() {
    "use strict";
    KRASNOEIBELOE_JUICES_PART2 = [
      { name: "\u0421\u043E\u043A \u041C\u043E\u0439 \u0437\u0435\u043B\u0435\u043D\u043E\u0435 \u044F\u0431\u043B\u043E\u043A\u043E 0.2\u043B", category: "juice", color: "#90EE90", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/sok_moy_zelenoe_yabloko/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F \u0447\u0435\u0440\u0435\u0448\u043D\u044F", category: "juice", color: "#8B0000", abv: 0, pricePerLiter: 79, volume: 950, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_sady_pridonya_chereshnya_aroniya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0414\u043E\u0431\u0440\u044B\u0439 \u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D 2\u043B", category: "juice", color: "#FFA500", abv: 0, pricePerLiter: 55, volume: 2e3, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/napitok_sokosoderzhashchiy_dobryy_apelsin_mandarin/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico", imageUrl: "https://krasnoeibeloe.servicecdn.ru/upload/resize_cache/iblock/f5f/een22d3en21bxrii0xefa5vfv2dm2los/200_356_1/mandarin_040624_t.jpg" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u0414\u043E\u0431\u0440\u044B\u0439 \u042F\u0431\u043B\u043E\u043A\u043E 2\u043B", category: "juice", color: "#F0E68C", abv: 0, pricePerLiter: 55, volume: 2e3, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_dobryy_yabloko_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u0414\u043E\u0431\u0440\u044B\u0439 \u0422\u043E\u043C\u0430\u0442 2\u043B", category: "juice", color: "#DC143C", abv: 0, pricePerLiter: 55, volume: 2e3, tasteProfile: { sweet: 3, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_dobryy_tomat/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0410\u043B\u043E\u044D \u0412\u0435\u0440\u0430 0.525\u043B", category: "juice", color: "#90EE90", abv: 0, pricePerLiter: 143, volume: 525, tasteProfile: { sweet: 5, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/sokosoderzhashchie-napitki/napitok_aloe_vera_dzhus_b_a/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0424\u0440\u0443\u0442\u043E\u041D\u044F\u043D\u044F \u044F\u0431\u043B\u043E\u043A\u043E-\u0432\u0438\u0448\u043D\u044F", category: "juice", color: "#8B0000", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/sok_frutonyanya_yabloko_vishnya_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 DeVita \u044F\u0431\u043B\u043E\u043A\u043E-\u0432\u0438\u0448\u043D\u044F 1\u043B", category: "juice", color: "#8B0000", abv: 0, pricePerLiter: 70, volume: 1e3, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_devita_yabloko_vishnya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F 1.93\u043B", category: "juice", color: "#FF8C00", abv: 0, pricePerLiter: 46, volume: 1930, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_sady_pridonya_multifruktovyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 DeVita \u044F\u0431\u043B\u043E\u0447\u043D\u044B\u0439 1\u043B", category: "juice", color: "#F0E68C", abv: 0, pricePerLiter: 70, volume: 1e3, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_yablochnyy_devita_1l/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u041C\u0438 \u043C\u0438 \u043C\u0438\u0448\u043A\u0438 \u043C\u0443\u043B\u044C\u0442\u0438\u0444\u0440\u0443\u043A\u0442", category: "juice", color: "#FF8C00", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/sok_mi_mi_mishki_multifrukt/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A Organic \u0430\u0440\u0431\u0443\u0437-\u0430\u043B\u043E\u044D", category: "juice", color: "#FFB6C1", abv: 0, pricePerLiter: 143, volume: 525, tasteProfile: { sweet: 6, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/sokosoderzhashchie-napitki/napitok_organic_arbuz_aloe_negazirovannyy_bezalkogolnyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u041C\u0438 \u043C\u0438 \u043C\u0438\u0448\u043A\u0438 \u0431\u0430\u043D\u0430\u043D 0.2\u043B", category: "juice", color: "#FFD700", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_mi_mi_mishki_banan/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u0420\u0438\u0447 \u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D 1\u043B", category: "juice", color: "#FFA500", abv: 0, pricePerLiter: 85, volume: 1e3, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/nektar_rich_apelsin/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0435\u043A\u0442\u0430\u0440 \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F \u044F\u0431\u043B\u043E\u0447\u043D\u044B\u0439", category: "juice", color: "#F0E68C", abv: 0, pricePerLiter: 46, volume: 1930, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_sady_pridonya_yablochnyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0410\u0433\u0443\u0448\u0430 \u044F\u0431\u043B\u043E\u043A\u043E 0.2\u043B", category: "juice", color: "#F0E68C", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/sok_agusha_yablochnyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0410\u0433\u0443\u0448\u0430 \u044F\u0431\u043B\u043E\u043A\u043E-\u043F\u0435\u0440\u0441\u0438\u043A", category: "juice", color: "#FFDAB9", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/sok_agusha_yabloko_persik_s_myakotyu/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u041C\u0438 \u043C\u0438 \u043C\u0438\u0448\u043A\u0438 \u044F\u0431\u043B\u043E\u043A\u043E-\u0432\u0438\u0448\u043D\u044F", category: "juice", color: "#8B0000", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/sok_mi_mi_mishki_yablochno_vishnyevyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F \u0437\u0435\u043B\u0435\u043D\u043E\u0435 \u044F\u0431", category: "juice", color: "#90EE90", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/sok_sady_pridonya_zelenoe_yabloko/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F \u044F\u0431\u043B\u043E\u043A\u043E-\u0432\u0438\u0448\u043D\u044F", category: "juice", color: "#8B0000", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/sok_sady_pridonya_yabloko_vishnya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u043E\u043A \u0421\u0430\u0434\u044B \u041F\u0440\u0438\u0434\u043E\u043D\u044C\u044F \u044F\u0431\u043B\u043E\u043A\u043E-\u0433\u0440\u0443\u0448\u0430", category: "juice", color: "#F0E68C", abv: 0, pricePerLiter: 150, volume: 200, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/sok_sady_pridonya_yabloko_grusha_s_myakotyu/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-juices.ts
var KRASNOEIBELOE_JUICES;
var init_krasnoeibeloe_juices = __esm({
  "client/src/lib/krasnoeibeloe-juices.ts"() {
    "use strict";
    init_krasnoeibeloe_juices_part1();
    init_krasnoeibeloe_juices_part2();
    KRASNOEIBELOE_JUICES = [
      ...KRASNOEIBELOE_JUICES_PART1,
      ...KRASNOEIBELOE_JUICES_PART2
    ];
  }
});

// client/src/lib/krasnoeibeloe-beer.ts
var KRASNOEIBELOE_BEER;
var init_krasnoeibeloe_beer = __esm({
  "client/src/lib/krasnoeibeloe-beer.ts"() {
    "use strict";
    KRASNOEIBELOE_BEER = [
      // === Импортное пиво ===
      { name: "\u041F\u0438\u0432\u043E \u0411\u0435\u043B\u043E\u0440\u0443\u0441\u0441\u043A\u043E\u0435 \u0441\u0432\u0435\u0442\u043B\u043E\u0435 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.2, pricePerLiter: 100, volume: 500, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_belorusskoe_svetloe_filtrovannoe_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0428\u0442\u0430\u0439\u043D\u0438\u043D\u0433\u0435\u0440 \u041F\u0438\u043B\u0441 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.8, pricePerLiter: 180, volume: 500, tasteProfile: { sweet: 2, sour: 2, bitter: 6, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_shtayninger_pils_svetloe_filtrovannoe_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0428\u0442\u0430\u0439\u043D\u0438\u043D\u0433\u0435\u0440 \u0425\u0435\u0444\u0435\u0432\u0430\u0439\u0441\u0431\u0438\u0440 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFE4B5", abv: 5.2, pricePerLiter: 180, volume: 500, tasteProfile: { sweet: 4, sour: 2, bitter: 4, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_shtayninger_khefevaysbir_svetloe_nefiltrovannoe_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u042D\u0440\u0437\u043C\u0430\u043D\u043D \u041B\u0430\u0439\u0442 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 2, sour: 2, bitter: 5, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_erzmann_light_svetloe_st_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0424\u0435\u043B\u044C\u0434\u0448\u043B\u0451\u0441\u0445\u0435\u043D \u041F\u0438\u043B\u0441\u043D\u0435\u0440 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.9, pricePerLiter: 180, volume: 500, tasteProfile: { sweet: 2, sour: 2, bitter: 6, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_feldshleckhen_cvetl_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0424\u0435\u043B\u044C\u0434\u0448\u043B\u0451\u0441\u0445\u0435\u043D \u041F\u044D\u0439\u043B \u0412\u0438\u0442 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFE4B5", abv: 5, pricePerLiter: 180, volume: 500, tasteProfile: { sweet: 4, sour: 2, bitter: 4, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_feldshlyeskhen_peyl_vit_svetloe_pshenichnoe_nefiltr_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u041C\u0435\u0440\u0444\u0438\u0441 \u0410\u0439\u0440\u0438\u0448 \u0421\u0442\u0430\u0443\u0442 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#3D2817", abv: 4, pricePerLiter: 180, volume: 500, tasteProfile: { sweet: 3, sour: 1, bitter: 7, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_merfiz_ayrish_staut_temnoe_filtrovannoe_pasterizovannoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0425\u043E\u0444\u0431\u0440\u043E\u0439\u0445\u0430\u0443\u0441 \u0424\u0440\u0430\u0439\u0437\u0438\u043D\u0433 \u0423\u0440\u0445\u0435\u043B\u043B 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.9, pricePerLiter: 180, volume: 500, tasteProfile: { sweet: 3, sour: 2, bitter: 6, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_khofbroykhaus_frayzing_urkhell_svetloe_filtrovannoe_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u041A\u0440\u043E\u043C\u0431\u0430\u0445\u0435\u0440 \u041F\u0438\u043B\u0441 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.8, pricePerLiter: 200, volume: 500, tasteProfile: { sweet: 2, sour: 2, bitter: 6, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_krombakher_pils_svetloe_filtrovannoe_zh_b_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u042D\u0440\u0437\u043C\u0430\u043D \u041B\u0430\u0439\u0442 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 2, sour: 2, bitter: 5, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_erzman_layt_sv_paster_filtrovannoe_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u041A\u043E\u0440\u043E\u043D\u0430 \u042D\u043A\u0441\u0442\u0440\u0430 0.355\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.5, pricePerLiter: 338, volume: 355, tasteProfile: { sweet: 2, sour: 3, bitter: 4, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/napitok_pivnoy_korona_ekstra_svetloe_pasterizovannoe_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0410\u0440\u0430\u0440\u0430\u0442 \u0441\u0432\u0435\u0442\u043B\u043E\u0435 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.5, pricePerLiter: 140, volume: 500, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_ararat_svetloe_filtrovannoe_st_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0411\u0443\u0434\u0432\u0430\u0439\u0437\u0435\u0440 \u0411\u0443\u0434\u0432\u0430\u0440 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 5, pricePerLiter: 200, volume: 500, tasteProfile: { sweet: 2, sour: 2, bitter: 6, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_budvayzer_budvar_svetloe_filtrovannoe_pasterizovannoe_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0413\u0438\u043D\u043D\u0435\u0441\u0441 \u0414\u0440\u0430\u0444\u0442 0.44\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#3D2817", abv: 4.2, pricePerLiter: 273, volume: 440, tasteProfile: { sweet: 3, sour: 1, bitter: 7, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_ginness_draft_temnoe_filtrovannoe_pasterizovannoe_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0413\u044E\u043C\u0440\u0438 \u0413\u043E\u043B\u0434 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.5, pricePerLiter: 140, volume: 500, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/importnoe_pivo/pivo_gyumri_gold_svetloe_filtrovannoe_st_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      // === Российское пиво ===
      { name: "\u041F\u0438\u0432\u043E \u0416\u0430\u0442\u0435\u0446\u043A\u0438\u0439 \u0413\u0443\u0441\u044C 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.6, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/__1944/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u042D\u0444\u0435\u0441 \u041F\u0438\u043B\u0441\u0435\u043D\u0435\u0440 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 5, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 2, sour: 2, bitter: 6, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/__1345/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0416\u0438\u0433\u0443\u043B\u0438 1968 0.43\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.5, pricePerLiter: 116, volume: 430, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_zhiguli_1968_svetloe_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0411\u0435\u043B\u044B\u0439 \u041C\u0435\u0434\u0432\u0435\u0434\u044C 1.15\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 5, pricePerLiter: 70, volume: 1150, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_belyy_medved_svetloe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0411\u0430\u043B\u0442\u0438\u043A\u0430 \u21169 \u041A\u0440\u0435\u043F\u043A\u043E\u0435 1.2\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#DAA520", abv: 8, pricePerLiter: 83, volume: 1200, tasteProfile: { sweet: 3, sour: 1, bitter: 6, alcohol: 8 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_baltika_9_krepkoe_legendarnoe_svetloe_pet/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u041E\u0445\u043E\u0442\u0430 \u041A\u0440\u0435\u043F\u043A\u043E\u0435 0.43\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#DAA520", abv: 8.1, pricePerLiter: 116, volume: 430, tasteProfile: { sweet: 3, sour: 1, bitter: 6, alcohol: 8 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_okhota_krepkoe_svetloe_zh_b_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0411\u0430\u043B\u0442\u0438\u043A\u0430 \u21163 \u041A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u043E\u0435 0.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.8, pricePerLiter: 100, volume: 500, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_baltika_3_svetloe_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0411\u0430\u043B\u0442\u0438\u043A\u0430 \u21169 \u041A\u0440\u0435\u043F\u043A\u043E\u0435 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#DAA520", abv: 8, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 3, sour: 1, bitter: 6, alcohol: 8 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_baltika_9_krepkoe_svetloe_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u041D\u0435\u043C\u0435\u0446\u043A\u043E\u0435 \u0441\u0432\u0435\u0442\u043B\u043E\u0435 1.5\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4, pricePerLiter: 53, volume: 1500, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_nemetskoe_svetloe_pasterizovannoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0413\u0440\u0438\u043D\u0431\u0438\u0442 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.6, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_grinbit_svetloe_pasterizovannoe_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u041B\u043E\u0432\u0435\u043D\u0431\u0440\u0430\u0443 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 5.4, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 2, sour: 2, bitter: 6, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/__1331/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u04229 \u0441\u0432\u0435\u0442\u043B\u043E\u0435 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#DAA520", abv: 8, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 3, sour: 1, bitter: 6, alcohol: 8 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/_9__1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0411\u0430\u0434 \u0441\u0432\u0435\u0442\u043B\u043E\u0435 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 5, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/__1329/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0413\u0440\u0438\u043D\u0431\u0438\u0442 \u0441\u0432\u0435\u0442\u043B\u043E\u0435 0.45\u043B \u0441\u0442", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.6, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_grinbit_svetloe_pasterizovannoe_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0412\u0435\u043B\u043A\u043E\u043F\u043E\u043F\u043E\u0432\u0438\u0446\u043A\u0438\u0439 \u041A\u043E\u0437\u0435\u043B 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/__1518/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0411\u0430\u0434 \u0441\u0432\u0435\u0442\u043B\u043E\u0435 0.44\u043B \u0441\u0442", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 5, pricePerLiter: 114, volume: 440, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_bad_svetloe_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0421\u0442\u0435\u043B\u043B\u0430 \u0410\u0440\u0442\u0443\u0430 0.44\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 5, pricePerLiter: 136, volume: 440, tasteProfile: { sweet: 2, sour: 2, bitter: 6, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_stella_artua_svetloe_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0411\u0430\u043B\u0442\u0438\u043A\u0430 \u21163 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.8, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/_3__42/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u041C\u043E\u0441\u043A\u0432\u0438\u0447 0.43\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 4.3, pricePerLiter: 116, volume: 430, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_moskvich_svetloe_pasterizovannoe_zh_b_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u042D\u0444\u0435\u0441 \u041F\u0438\u043B\u0441\u0435\u043D\u0435\u0440 0.45\u043B \u0436\u0431", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 5, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 2, sour: 2, bitter: 6, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/__1485/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u0412\u0435\u043B\u043A\u043E\u043F\u043E\u043F\u043E\u0432\u0438\u0446\u043A\u0438\u0439 \u041A\u043E\u0437\u0435\u043B \u0442\u0435\u043C\u043D\u043E\u0435 0.45\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#8B4513", abv: 3.7, pricePerLiter: 111, volume: 450, tasteProfile: { sweet: 4, sour: 1, bitter: 5, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/__1339/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u0438\u0432\u043E \u0416\u0438\u0433\u0443\u043B\u0435\u0432\u0441\u043A\u043E\u0435 \u0411\u043E\u0447\u043A\u043E\u0432\u043E\u0435 1.15\u043B", category: "alcohol", subtype: "\u041F\u0438\u0432\u043E", color: "#FFD700", abv: 5, pricePerLiter: 70, volume: 1150, tasteProfile: { sweet: 3, sour: 2, bitter: 5, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rossiyskoe/pivo_zhigulevskoe_bochkovoe_svetloe_pasterizovannoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-cognac-part1.ts
var KRASNOEIBELOE_COGNAC_PART1;
var init_krasnoeibeloe_cognac_part1 = __esm({
  "client/src/lib/krasnoeibeloe-cognac-part1.ts"() {
    "use strict";
    KRASNOEIBELOE_COGNAC_PART1 = [
      // === Страница 1 ===
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u0438\u0437\u043B\u044F\u0440 3 \u0433\u043E\u0434\u0430 0.25\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 400, volume: 250, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_kizlyar_3_goda/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041B\u0435\u0437\u0433\u0438\u043D\u043A\u0430 5 \u043B\u0435\u0442 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 500, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_lezginka_pyatiletniy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0424\u0430\u043D\u0430\u0433\u043E\u0440\u0438\u044F 5 \u043B\u0435\u0442 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_fanagoriya_5_let_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u0438\u043D\u043E\u0432\u0441\u043A\u0438\u0439 4 \u0433\u043E\u0434\u0430 0.25\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 460, volume: 250, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_kinovskiy_4_goda_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041B\u0435\u0437\u0433\u0438\u043D\u043A\u0430 5 \u043B\u0435\u0442 0.25\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 500, volume: 250, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_lezginka_5_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410\u0440\u043C\u044F\u043D\u0441\u043A\u0438\u0439 5 \u0437\u0432\u0435\u0437\u0434 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_armyanskiy_5_zvezd/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u043E\u0447\u0430\u0440\u0438 5 \u043B\u0435\u0442 0.25\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 800, volume: 250, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/_5__10/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0411\u0440\u0435\u043D\u0434\u0438 \u0414\u0435\u043B\u043E\u0440 \u0424\u0440\u0435\u0440 X.O. 0.7\u043B", category: "alcohol", subtype: "\u0411\u0440\u0435\u043D\u0434\u0438", color: "#8B4513", abv: 40, pricePerLiter: 1571, volume: 700, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/brendi/brendi_delor_frer_xo_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410\u0440\u043C\u044F\u043D\u0441\u043A\u0438\u0439 5 \u0437\u0432\u0435\u0437\u0434 0.25\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 700, volume: 250, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/armyanskiy_konyak_5_zvezd_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0411\u0440\u0435\u043D\u0434\u0438 \u0414\u0435\u043B\u043E\u0440 \u0424\u0440\u0435\u0440 \u0412.\u0421. 0.5\u043B", category: "alcohol", subtype: "\u0411\u0440\u0435\u043D\u0434\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1e3, volume: 500, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/brendi/brendi_delor_frer_vs/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u0438\u043D\u043E\u0432\u0441\u043A\u0438\u0439 4 \u0433\u043E\u0434\u0430 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 460, volume: 500, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_kinovskiy_4_goda/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u043E\u0447\u0430\u0440\u0438 5 \u043B\u0435\u0442 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/__158/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410\u0440\u043C\u044F\u043D\u0441\u043A\u0438\u0439 5 \u0437\u0432\u0435\u0437\u0434 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_armyanskiy_5_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u0438\u0437\u043B\u044F\u0440 3 \u0433\u043E\u0434\u0430 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 400, volume: 500, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_kizlyar_trekhletniy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0425\u0435\u043D\u043D\u0435\u0441\u0441\u0438 \u0412\u0421 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 4e3, volume: 500, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/_vs_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410\u0440\u043C\u044F\u043D\u0441\u043A\u0438\u0439 5 \u0437\u0432\u0435\u0437\u0434 0.25\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 700, volume: 250, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_armyanskiy_5_zvezd_5_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u0438\u043D\u043E\u0432\u0441\u043A\u0438\u0439 4 \u0433\u043E\u0434\u0430 0.1\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 460, volume: 100, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_kinovskiy_4_goda_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410\u0440\u043C\u044F\u043D\u0441\u043A\u0438\u0439 5 \u0437\u0432\u0435\u0437\u0434 0.1\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 700, volume: 100, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_armyanskiy_5_zvezd_5_let_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0411\u0440\u0435\u043D\u0434\u0438 \u0422\u043E\u0440\u0440\u0435\u0441 10 \u043B\u0435\u0442 \u0413\u0440\u0430\u043D \u0420\u0435\u0437\u0435\u0440\u0432\u0430 0.5\u043B", category: "alcohol", subtype: "\u0411\u0440\u0435\u043D\u0434\u0438", color: "#8B4513", abv: 38, pricePerLiter: 1600, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/brendi/32953-brendi_torres_10_let_gran_rezerva_38_0_5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410.\u0434\u0435 \u0424\u0443\u0441\u0441\u0438\u043D\u044C\u0438 \u0425\u041E 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 2400, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/__692/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410\u0440\u043C\u044F\u043D\u0441\u043A\u0438\u0439 \u041A\u043E\u0447\u0430\u0440\u0438 7 \u043B\u0435\u0442 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 1200, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/_7__1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0425\u0435\u043D\u043D\u0435\u0441\u0441\u0438 XO 0.7\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 14286, volume: 700, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/_xo_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0421\u0442\u0430\u0440\u0435\u0439\u0448\u0438\u043D\u0430 \u0414\u0430\u043B\u0438 10 \u043B\u0435\u0442 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_stareyshina_dali_10_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      // === Страница 2 (часть) ===
      { name: "\u0411\u0440\u0435\u043D\u0434\u0438 \u0414\u0435\u043B\u043E\u0440 \u0424\u0440\u0435\u0440 V.S.O.P 0.7\u043B", category: "alcohol", subtype: "\u0411\u0440\u0435\u043D\u0434\u0438", color: "#8B4513", abv: 40, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/brendi/brendi_delor_frer_vsop_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410\u0440\u043C\u044F\u043D\u0441\u043A\u0438\u0439 \u0410\u0440\u0430\u0440\u0430\u0442 \u041D\u0430\u0438\u0440\u0438 20 \u043B\u0435\u0442 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 6e3, volume: 500, tasteProfile: { sweet: 8, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/_20_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u0443\u0440\u0432\u0443\u0430\u0437\u044C\u0435 \u0425\u041E 0.7\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 8571, volume: 700, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_kurvuaze_kho_ne_menee_10_let_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u0410\u0440\u0430\u0440\u0430\u0442 \u0410\u043F\u0440\u0438\u043A\u043E\u0442 0.5\u043B", category: "alcohol", subtype: "\u0411\u0440\u0435\u043D\u0434\u0438", color: "#FFA500", abv: 35, pricePerLiter: 1200, volume: 500, tasteProfile: { sweet: 8, sour: 2, bitter: 1, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/napit_spirt_na_osnove_konyaka_ararat_aprikot_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0411\u0440\u0435\u043D\u0434\u0438 \u0421\u0435\u043C\u0431\u043E\u043B\u044C \u041D\u0430\u0446\u0438\u043E\u043D\u0430\u043B\u044C \u0425\u041E 0.7\u043B", category: "alcohol", subtype: "\u0411\u0440\u0435\u043D\u0434\u0438", color: "#8B4513", abv: 40, pricePerLiter: 2e3, volume: 700, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/brendi/brendi_sembol_natsional_kho/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0414\u0440\u0435\u0432\u043D\u044F\u044F \u0425\u0438\u0432\u0430 7 \u043B\u0435\u0442 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_drevnyaya_khiva_7_let_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0414\u0430\u0433\u0435\u0441\u0442\u0430\u043D \u0441\u0442\u0430\u0440\u044B\u0439 \u041A\u0421 12 \u043B\u0435\u0442 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 1e3, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_dagestan_staryy_ks_12_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0421\u0415\u041D \u041A\u041B\u041E XO 0.7\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 1571, volume: 700, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_saint_clos_xo_v_p_u/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410\u0440\u0430\u0440\u0430\u0442 \u0410\u0445\u0442\u0430\u043C\u0430\u0440 10 \u043B\u0435\u0442 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 2e3, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_armyanskiy_akhtamar/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0411\u0435\u0448 \u041A\u0443\u0434\u0443\u043A 5 \u043B\u0435\u0442 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_besh_kuduk_5_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0430\u0440\u043C\u044F\u043D\u0441\u043A\u0438\u0439 3 \u0437\u0432\u0435\u0437\u0434\u044B 0.5\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_armyanskiy_3_goda/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-cognac-part2.ts
var KRASNOEIBELOE_COGNAC_PART2;
var init_krasnoeibeloe_cognac_part2 = __esm({
  "client/src/lib/krasnoeibeloe-cognac-part2.ts"() {
    "use strict";
    KRASNOEIBELOE_COGNAC_PART2 = [
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u043E\u0447\u0430\u0440\u0438 5 \u043B\u0435\u0442 0.1\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 800, volume: 100, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/_5__67/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0433\u0440\u0443\u0437\u0438\u043D\u0441\u043A\u0438\u0439 \u041E\u043B\u0434 \u041C\u0446\u0445\u0435\u0442\u0430 3 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 500, volume: 500, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_gruzinskiy_old_mtskheta_3_goda/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0413\u0440\u0443\u0437\u0438\u043D\u0441\u043A\u0438\u0439 \u041E\u043B\u0434 \u041C\u0446\u0445\u0435\u0442\u0430 5 \u043B\u0435\u0442", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_gruzinskiy_old_mtskheta_5_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410\u0440\u0430\u0440\u0430\u0442 5 \u043B\u0435\u0442", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 1200, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_armyanskiy_ararat_5_let_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410\u0440\u0430\u0440\u0430\u0442 \u0410\u041D\u0418 \u041A\u0412", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 1400, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_kv_ani_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0410\u0440\u0430\u0440\u0430\u0442 3 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 900, volume: 500, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_ararat_3_goda/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u044C \u041B\u0435 \u0428\u043E\u043A\u043E\u043B\u0430\u0434 \u043A\u0430\u043F\u0443\u0447\u0438\u043D\u043E", category: "alcohol", subtype: "\u0411\u0440\u0435\u043D\u0434\u0438", color: "#654321", abv: 30, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 9, sour: 0, bitter: 2, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/kokteyl_le_shokolad_so_vkusom_shokolada_i_kapuchino/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0422\u043E\u0440\u0443\u043C 10 \u043B\u0435\u0442", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 1600, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_armyanskiy_torum_10_let_tuba/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0417\u043E\u043B\u043E\u0442\u043E\u0439 \u0420\u0435\u0437\u0435\u0440\u0432 5 \u043B\u0435\u0442 0.25\u043B", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 600, volume: 250, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_zolotoy_rezerv_5_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041D\u043E\u0439 \u0422\u0440\u0430\u0434\u0438\u0446\u0438\u043E\u043D\u043D\u044B\u0439 5 \u043B\u0435\u0442", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 900, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_noy_traditsionnyy_5_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0417\u043E\u043B\u043E\u0442\u043E\u0439 \u0414\u0443\u0431 5 \u043B\u0435\u0442", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_zolotoy_dub_pyatiletniy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0420\u0443\u043B\u043B\u0435 \u041A\u0430\u0434\u0435 \u0425\u041E", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 2857, volume: 700, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_rulle_kade_kho_marochnyy_staryy_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041C\u0430\u0440\u0442\u0435\u043B\u044C \u0412\u0421", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 3e3, volume: 700, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_martel_vs/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u043E\u0447\u0430\u0440\u0438 10 \u043B\u0435\u0442", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 1600, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_kochari_10_let_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0410\u043F\u0435\u0440\u0438\u0442\u0438\u0432 \u0424\u0430\u0439\u043D \u041A\u0430\u0441\u043A \u0410\u0431\u0440\u0438\u043A\u043E\u0441", category: "alcohol", subtype: "\u0411\u0440\u0435\u043D\u0434\u0438", color: "#FFA500", abv: 35, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 8, sour: 2, bitter: 1, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/aperitiv_fayn_kask_abrikos/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0411\u0440\u0435\u043D\u0434\u0438 \u041A\u0432\u0438\u043D\u0442 10 \u043B\u0435\u0442", category: "alcohol", subtype: "\u0411\u0440\u0435\u043D\u0434\u0438", color: "#8B4513", abv: 40, pricePerLiter: 1e3, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/brendi/brendi_kvint_10let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0411\u0440\u0435\u043D\u0434\u0438 \u041A\u0432\u0438\u043D\u0442 5 \u043B\u0435\u0442", category: "alcohol", subtype: "\u0411\u0440\u0435\u043D\u0434\u0438", color: "#8B4513", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/brendi/brendi_kvint_5let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u0430\u043B\u044C\u0432\u0430\u0434\u043E\u0441 \u041A\u043E\u043A\u0440\u0435\u043B\u044C \u0412\u0421", category: "alcohol", subtype: "\u0411\u0440\u0435\u043D\u0434\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 5, sour: 2, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/brendi/kalvados_kokrel_vs/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0421\u0442\u0430\u0440\u0435\u0439\u0448\u0438\u043D\u0430 3 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 500, volume: 500, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_stareyshina_3_goda/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0421\u0442\u0430\u0440\u0435\u0439\u0448\u0438\u043D\u0430 5 \u043B\u0435\u0442", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_stareyshina_5_let_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0421\u0442\u0430\u0440\u0435\u0439\u0448\u0438\u043D\u0430 7 \u043B\u0435\u0442", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_stareyshina_7_let_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0421\u0442\u0430\u0440\u044B\u0439 \u041A\u0430\u0445\u0435\u0442\u0438 3 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 500, volume: 500, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_staryy_kakheti_3_goda/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0421\u0442\u0430\u0440\u044B\u0439 \u041A\u0430\u0445\u0435\u0442\u0438 5 \u043B\u0435\u0442", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_staryy_kakheti_5_let_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u0424\u0430\u0439\u043D \u041A\u0430\u0441\u043A 5 \u043B\u0435\u0442", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_fayn_kask_5_let_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u0443\u0440\u0432\u0443\u0430\u0437\u044C\u0435 \u0412\u0421", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#D2691E", abv: 40, pricePerLiter: 3200, volume: 500, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_kurvuaze_vs_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u043A \u041A\u0443\u0440\u0432\u0443\u0430\u0437\u044C\u0435 \u0412\u0421\u041E\u041F", category: "alcohol", subtype: "\u041A\u043E\u043D\u044C\u044F\u043A", color: "#8B4513", abv: 40, pricePerLiter: 5714, volume: 700, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/konyak_armanyak_brendi/konyak/konyak_kurvuaze_vsop_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-cognac.ts
var KRASNOEIBELOE_COGNAC;
var init_krasnoeibeloe_cognac = __esm({
  "client/src/lib/krasnoeibeloe-cognac.ts"() {
    "use strict";
    init_krasnoeibeloe_cognac_part1();
    init_krasnoeibeloe_cognac_part2();
    KRASNOEIBELOE_COGNAC = [
      ...KRASNOEIBELOE_COGNAC_PART1,
      ...KRASNOEIBELOE_COGNAC_PART2
    ];
  }
});

// client/src/lib/krasnoeibeloe-liqueurs.ts
var KRASNOEIBELOE_LIQUEURS;
var init_krasnoeibeloe_liqueurs = __esm({
  "client/src/lib/krasnoeibeloe-liqueurs.ts"() {
    "use strict";
    KRASNOEIBELOE_LIQUEURS = [
      // === Страница 1 ===
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u0410\u043F\u0435\u0440\u043E\u043B\u044C 0.7\u043B", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#FF6600", abv: 11, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 6, sour: 4, bitter: 5, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/napitok_spirtnoy_aperol_aperitiv/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u041C-\u0440 \u0412\u0430\u0439\u043B\u0434\u043C\u0435\u0439\u0441\u0442\u0435\u0440 0.2\u043B", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#654321", abv: 35, pricePerLiter: 1e3, volume: 200, tasteProfile: { sweet: 7, sour: 1, bitter: 3, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/liker_desertnyy_m_r_vayldmeyster/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u041C\u0430\u0440\u0438\u0431\u0430 \u0420\u0438\u043E \u0441\u043B\u0438\u0432\u043A\u0438 \u0441 \u0430\u0440\u043E\u043C\u0430\u0442\u043E\u043C \u0432\u0430\u043D\u0438\u043B\u0438", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#F5DEB3", abv: 15, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/29834-liker_emulsionnyy_mariba_rio_slivki_s_aromatom_vanili_15_0_5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u042F\u0433\u0435\u0440\u043C\u0430\u0439\u0441\u0442\u0435\u0440 0.7\u043B", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#654321", abv: 35, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 5, sour: 1, bitter: 6, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/25522-liker-yagermayster-35-0-7/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u0410\u043F\u0435\u0440\u043E\u043B\u044C 0.375\u043B", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#FF6600", abv: 11, pricePerLiter: 1867, volume: 375, tasteProfile: { sweet: 6, sour: 4, bitter: 5, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/napitok_spirtnoy_aperol_aperitiv_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u041C\u0430\u0440\u0438\u0431\u0430 \u0420\u0438\u043E \u0441\u043B\u0438\u0432\u043A\u0438 \u0441 \u0430\u0440\u043E\u043C\u0430\u0442\u043E\u043C \u0448\u043E\u043A\u043E\u043B\u0430\u0434\u0430", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#8B4513", abv: 15, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 8, sour: 0, bitter: 2, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/29683-liker_emulsionnyy_mariba_rio15_0_5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u041C-\u0440 \u0412\u0430\u0439\u043B\u0434\u043C\u0435\u0439\u0441\u0442\u0435\u0440 0.5\u043B", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#654321", abv: 35, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 3, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/36012-liker_desertnyy_vayldmeyster_m_r_35_0_5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u042F\u0433\u0435\u0440\u043C\u0430\u0439\u0441\u0442\u0435\u0440 0.04\u043B", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#654321", abv: 35, pricePerLiter: 2500, volume: 40, tasteProfile: { sweet: 5, sour: 1, bitter: 6, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/liker_desertnyy_yagermayster/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u042F\u0433\u0435\u0440\u043C\u0430\u0439\u0441\u0442\u0435\u0440 0.2\u043B", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#654321", abv: 35, pricePerLiter: 2e3, volume: 200, tasteProfile: { sweet: 5, sour: 1, bitter: 6, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/__116/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u0410\u043C\u0430\u0440\u0435\u0442\u0442\u043E \u0411\u0440\u0430\u0432\u043E", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#8B4513", abv: 20, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/27160-liker_desertnyy_amaretto_bravo_20_0_5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u0411\u044D\u0439\u043B\u0438\u0441 \u0441\u043B\u0438\u0432\u043E\u0447\u043D\u044B\u0439 \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0439", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#F5DEB3", abv: 17, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/__541/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u0414\u043E\u043D \u0410\u043C\u0430\u0440\u0435\u0442\u0442\u043E \u041C\u0438\u043B\u0430\u043D\u043E 0.1\u043B", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#8B4513", abv: 20, pricePerLiter: 500, volume: 100, tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/27626-liker_desertnyy_don_amaretto_milano_20_0_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u041B\u0438\u043C\u043E\u043D\u0447\u0435\u043B\u043B\u043E \u0421\u0430\u043D \u041B\u0430\u043C\u0430\u0434\u0436\u043E", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#FFFF00", abv: 25, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 7, sour: 6, bitter: 0, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/liker_limonchello_san_lamadzho/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u042F\u0433\u043E\u0434\u0430\u043C\u0430\u0441\u0442\u0435\u0440 \u0411\u043E\u0442\u0430\u043D\u0438\u043A\u0430\u043B 0.5\u043B", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#654321", abv: 35, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 6, sour: 2, bitter: 4, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/liker_desertnyy_yagodamaster_botanikal/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u0411\u0430\u0440\u043E\u043D \u0420\u0443\u0441\u0441\u0430\u043A \u0422\u0440\u0438\u043F\u043B \u0421\u0435\u043A", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#FFA500", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 7, sour: 3, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/liker_krepkiy_baron_russak_tripl_sek/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u042F\u0433\u043E\u0434\u0430\u043C\u0430\u0441\u0442\u0435\u0440 \u0411\u043E\u0442\u0430\u043D\u0438\u043A\u0430\u043B 0.25\u043B", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#654321", abv: 35, pricePerLiter: 800, volume: 250, tasteProfile: { sweet: 6, sour: 2, bitter: 4, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/liker_yagodamaster_botanikal/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u044C \u0420\u0430\u0444\u0438\u043D\u0435 \u0428\u043E\u043A\u043E\u043B\u0430\u0434 \u0438 \u0412\u0438\u0448\u043D\u044F", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#654321", abv: 30, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 9, sour: 1, bitter: 2, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/kokteyl_rafine_shokolad_i_vishnya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u044C \u0420\u0430\u0444\u0438\u043D\u0435 \u0428\u043E\u043A\u043E\u043B\u0430\u0434 \u0438 \u0412\u0430\u043D\u0438\u043B\u044C", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#654321", abv: 30, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 9, sour: 0, bitter: 2, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/kokteyl_rafine_shokolad_i_vanil/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u0411\u0430\u0440\u043E\u043D \u0420\u0443\u0441\u0441\u0430\u043A \u041A\u043E\u043A\u043E\u0441", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#FFFFFF", abv: 21, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/liker_baron_roussac_coconut_caribbean_rum/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u0411\u0430\u0440\u043E\u043D \u0420\u0443\u0441\u0441\u0430\u043A \u0418\u0440\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0435 \u0421\u043B\u0438\u0432\u043A\u0438", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#F5DEB3", abv: 19, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/liker_baron_roussac_irish_cream_slivochnyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      // === Страница 2 ===
      { name: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u044C \u0420\u0430\u0444\u0438\u043D\u0435 \u0448\u043E\u043A\u043E\u043B\u0430\u0434 \u0438 \u0438\u043D\u0436\u0438\u0440", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#654321", abv: 30, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 9, sour: 0, bitter: 2, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/kokteyl_rafine_shokolad_i_inzhir/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u041A\u0430\u043C\u043F\u0430\u0440\u0438 (\u0430\u043F\u0435\u0440\u0438\u0442\u0438\u0432)", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#DC143C", abv: 25, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 4, sour: 2, bitter: 8, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/liker_desertnyy_kampari_aperitiv/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u041D\u0430\u0439\u0442 \u0413\u0430\u0431\u0440\u0438\u0435\u043B\u043B\u043E \u041B\u0438\u043C\u043E\u043D\u0447\u0435\u043B\u043B\u043E", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#FFFF00", abv: 25, pricePerLiter: 1e3, volume: 500, tasteProfile: { sweet: 7, sour: 6, bitter: 0, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/liker_nayt_gabriello_limonchello/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041B\u0438\u043A\u0435\u0440 \u0421\u0442\u0430\u0440\u0435\u0439\u0448\u0438\u043D\u0430 \u0410\u043B\u044C\u043F\u0438\u043D \u0425\u0430\u043D\u0438", category: "alcohol", subtype: "\u041B\u0438\u043A\u0451\u0440", color: "#FFD700", abv: 34, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/likery/liker_stareyshina_alpin_khani/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-rum.ts
var KRASNOEIBELOE_RUM;
var init_krasnoeibeloe_rum = __esm({
  "client/src/lib/krasnoeibeloe-rum.ts"() {
    "use strict";
    KRASNOEIBELOE_RUM = [
      { name: "\u0420\u043E\u043C \u041C\u0430\u043C\u0430 \u0414\u0436\u0430\u043C\u0430 \u0411\u043B\u044D\u043A \u0432\u044B\u0434\u0435\u0440\u0436\u0430\u043D\u043D\u044B\u0439", category: "alcohol", subtype: "\u0420\u043E\u043C", color: "#654321", abv: 38, pricePerLiter: 857, volume: 700, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/rom/rom_mama_dzhama_blek_vyderzhannyy_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0420\u043E\u043C \u0417\u0430\u043A\u0430\u043F\u0430 \u042E\u0431\u0438\u043B\u0435\u0439\u043D\u044B\u0439 23 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u0420\u043E\u043C", color: "#8B4513", abv: 40, pricePerLiter: 7143, volume: 700, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/rom/_23_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0420\u043E\u043C \u0432\u044B\u0434\u0435\u0440\u0436\u0430\u043D\u043D\u044B\u0439 \u0421\u0430\u043D\u0433\u0441\u043E\u043C", category: "alcohol", subtype: "\u0420\u043E\u043C", color: "#8B4513", abv: 40, pricePerLiter: 1429, volume: 700, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/rom/rom_vyderzhannyy_sangsom_v_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0420\u043E\u043C \u0417\u0430\u043A\u0430\u043F\u0430 XO", category: "alcohol", subtype: "\u0420\u043E\u043C", color: "#8B4513", abv: 40, pricePerLiter: 8571, volume: 700, tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/rom/__1824/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0420\u043E\u043C \u041A\u0430\u043F\u0438\u0442\u0430\u043D \u0416\u0430\u043D \u041B\u0430\u0444\u0438\u0442\u0442 \u0434\u0430\u0440\u043A", category: "alcohol", subtype: "\u0420\u043E\u043C", color: "#654321", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/rom/rom_kapitan_zhan_lafitt_dark/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0420\u043E\u043C \u0411\u0440\u0443\u0433\u0430\u043B \u0410\u043D\u044C\u0435\u0445\u043E \u0421\u0443\u043F\u0435\u0440\u0438\u043E\u0440", category: "alcohol", subtype: "\u0420\u043E\u043C", color: "#D2691E", abv: 38, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/rom/rom_brugal_anekho_superior/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0420\u043E\u043C \u041A\u043E\u043D\u0442\u0440\u0430\u0431\u0430\u043D\u0434\u043E 5 \u043B\u0435\u0442", category: "alcohol", subtype: "\u0420\u043E\u043C", color: "#8B4513", abv: 40, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/rom/rom_kontrabando_5_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0420\u043E\u043C \u0411\u043E\u0442\u0440\u0430\u043D \u21168 \u0420\u0438\u0437\u0435\u0440\u0432\u0430 \u041A\u043B\u0430\u0441\u0441\u0438\u043A\u0430", category: "alcohol", subtype: "\u0420\u043E\u043C", color: "#8B4513", abv: 40, pricePerLiter: 2143, volume: 700, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/rom/rom_botran_8_rizerva_klassika_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0420\u043E\u043C \u041C\u0430\u0442\u0443\u0441\u0430\u043B\u0435\u043C \u0421\u043E\u043B\u0435\u0440\u0430 7 \u043B\u0435\u0442", category: "alcohol", subtype: "\u0420\u043E\u043C", color: "#8B4513", abv: 40, pricePerLiter: 2e3, volume: 700, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/rom/rom_matusalem_solera_7_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0420\u043E\u043C \u0421\u044D\u043D\u0434\u0438 \u0420\u044D\u0439", category: "alcohol", subtype: "\u0420\u043E\u043C", color: "#D2691E", abv: 38, pricePerLiter: 714, volume: 700, tasteProfile: { sweet: 5, sour: 1, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/rom/rom_sendi_rey/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-tequila.ts
var KRASNOEIBELOE_TEQUILA;
var init_krasnoeibeloe_tequila = __esm({
  "client/src/lib/krasnoeibeloe-tequila.ts"() {
    "use strict";
    KRASNOEIBELOE_TEQUILA = [
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 \u041E\u043B\u044C\u043C\u0435\u043A\u0430 \u0417\u043E\u043B\u043E\u0442\u0430\u044F", category: "alcohol", subtype: "\u0422\u0435\u043A\u0438\u043B\u0430", color: "#FFD700", abv: 38, pricePerLiter: 1857, volume: 700, tasteProfile: { sweet: 4, sour: 2, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/tekila/_0_7_13/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u0442\u0435\u043A\u0438\u043B\u0430 \u041E\u043B\u044C\u043C\u0435\u043A\u0430 \u0411\u0435\u043B\u0430\u044F", category: "alcohol", subtype: "\u0422\u0435\u043A\u0438\u043B\u0430", color: "#F0F0F0", abv: 38, pricePerLiter: 1857, volume: 700, tasteProfile: { sweet: 3, sour: 2, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/tekila/__177/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 \u042D\u0441\u043F\u043E\u043B\u043E\u043D \u0411\u043B\u0430\u043D\u043A\u043E", category: "alcohol", subtype: "\u0422\u0435\u043A\u0438\u043B\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 2133, volume: 750, tasteProfile: { sweet: 3, sour: 2, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/tekila/__311/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 \u042D\u0441\u043F\u043E\u043B\u043E\u043D \u0420\u0435\u043F\u043E\u0441\u0430\u0434\u043E", category: "alcohol", subtype: "\u0422\u0435\u043A\u0438\u043B\u0430", color: "#FFD700", abv: 40, pricePerLiter: 2133, volume: 750, tasteProfile: { sweet: 4, sour: 2, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/tekila/__312/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u044C \u0410\u043B\u044C\u0442\u0430 \u041A\u043E\u0441\u0442\u0430 \u0421\u0438\u043B\u044C\u0432\u0435\u0440 \u0441 \u0442\u0435\u043A\u0438\u043B\u043E\u0439", category: "alcohol", subtype: "\u0422\u0435\u043A\u0438\u043B\u0430", color: "#F0F0F0", abv: 38, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 5, sour: 3, bitter: 2, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/tekila/kokteyl_alta_kosta_silver_s_tekiloy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0422\u0435\u043A\u0438\u043B\u0430 \u042D\u0441\u043F\u043E\u043B\u043E\u043D \u0410\u043D\u044C\u0435\u0445\u043E", category: "alcohol", subtype: "\u0422\u0435\u043A\u0438\u043B\u0430", color: "#D2691E", abv: 40, pricePerLiter: 2667, volume: 750, tasteProfile: { sweet: 5, sour: 2, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/tekila/tekila_espolon_anekho/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u0414\u043E\u043D \u0427\u0438\u043A\u0443 \u0422\u0435\u043A\u0438\u043B\u0430 \u0421\u0435\u0440\u0435\u0431\u0440\u043E", category: "alcohol", subtype: "\u0422\u0435\u043A\u0438\u043B\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 3, sour: 2, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/tekila/napitok_spirtnoy_don_chiku_tekila_serebro/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u0422\u0435\u043A\u0438\u043B\u0430 \u0421\u0438\u0435\u0440\u0440\u0430 \u0411\u043B\u0430\u043D\u043A\u043E", category: "alcohol", subtype: "\u0422\u0435\u043A\u0438\u043B\u0430", color: "#F0F0F0", abv: 38, pricePerLiter: 1600, volume: 500, tasteProfile: { sweet: 3, sour: 2, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/rom_jin_tequila_liquor/tekila/napitok_spirtnoy_tekila_sierra_blanko_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-cocktails.ts
var KRASNOEIBELOE_COCKTAILS;
var init_krasnoeibeloe_cocktails = __esm({
  "client/src/lib/krasnoeibeloe-cocktails.ts"() {
    "use strict";
    KRASNOEIBELOE_COCKTAILS = [
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u041C\u0438\u0441\u0442\u0435\u0440 \u041A\u0440\u0430\u0444\u0442 \u041C\u0430\u043D\u0433\u043E \u041C\u0430\u0440\u0430\u043A\u0443\u0439\u044F \u0410\u043D\u0430\u043D\u0430\u0441", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#FFA500", abv: 6, pricePerLiter: 143, volume: 420, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/pivnoy_napitok_mister_kraft_paster_so_vkusom_mango_marakuyi_i_ananasa_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u0420\u0435\u0433\u0441\u0442\u0430\u0435\u0440\u0441 \u0434\u0436\u0438\u043D \u0442\u043E\u043D\u0438\u043A \u043B\u0438\u043C\u043E\u043D \u043B\u0430\u0439\u043C", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#FFFF99", abv: 7, pricePerLiter: 140, volume: 430, tasteProfile: { sweet: 5, sour: 5, bitter: 2, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/__2049/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u041F\u0438\u043A \u0410\u043F \u0447\u0435\u0440\u043D\u0430\u044F \u0441\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u0430", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#663399", abv: 7, pricePerLiter: 140, volume: 430, tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_pik_ap_chernaya_smorodina/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u0420\u0435\u0433\u0441\u0442\u0430\u0435\u0440\u0441 \u0434\u0436\u0438\u043D \u0442\u043E\u043D\u0438\u043A \u0433\u0440\u0435\u0439\u043F\u0444\u0440\u0443\u0442", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#FFB6C1", abv: 7, pricePerLiter: 140, volume: 430, tasteProfile: { sweet: 4, sour: 6, bitter: 3, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_regstaers_dzhin_tonik_greypfrut_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u0420\u0435\u0433\u0441\u0442\u0430\u0435\u0440\u0441 \u0434\u0436\u0438\u043D \u0442\u043E\u043D\u0438\u043A \u043C\u0430\u043D\u0433\u043E \u043C\u0430\u0440\u0430\u043A\u0443\u0439\u044F", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#FFA500", abv: 7, pricePerLiter: 140, volume: 430, tasteProfile: { sweet: 7, sour: 4, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_regstaers_dzhin_tonik_mango_marakuyya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u0424\u0440\u0438\u043C\u0435\u043D \u0414\u0436\u0438\u043D \u0442\u043E\u043D\u0438\u043A", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#FFFF99", abv: 7, pricePerLiter: 120, volume: 500, tasteProfile: { sweet: 5, sour: 4, bitter: 2, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_frimen_dzhin_tonik_pet/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u0424\u0440\u0438\u043C\u0435\u043D \u0414\u0436\u0438\u043D \u0442\u043E\u043D\u0438\u043A \u0433\u0440\u0435\u0439\u043F\u0444\u0440\u0443\u0442", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#FFB6C1", abv: 7, pricePerLiter: 120, volume: 500, tasteProfile: { sweet: 4, sour: 6, bitter: 3, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_frimen_dzhin_tonik_greypfrut_pet_7_0_5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u041F\u0438\u043A \u0410\u043F \u043A\u043B\u0443\u0431\u043D\u0438\u043A\u0430 \u0438 \u0437\u0435\u043C\u043B\u044F\u043D\u0438\u043A\u0430", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#FF1493", abv: 7, pricePerLiter: 140, volume: 430, tasteProfile: { sweet: 8, sour: 3, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_pik_ap_klubnika_i_zemlyanika_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u0410\u043C\u043E\u0440\u0435 \u041F\u0438\u043D\u0430 \u041A\u043E\u043B\u0430\u0434\u0430", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#FFFACD", abv: 6, pricePerLiter: 133, volume: 450, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_amore_pina_kolada/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u0410\u043C\u043E\u0440\u0435 \u0441\u043B\u0430\u0434\u043A\u0430\u044F \u043A\u043B\u0443\u0431\u043D\u0438\u043A\u0430", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#FF1493", abv: 6, pricePerLiter: 133, volume: 450, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_amore_sladkaya_klubnika_zh_b_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u0414\u043E\u043A\u0442\u043E\u0440 \u0414\u0438\u0437\u0435\u043B\u044C \u0432\u0438\u0448\u043D\u044F \u043F\u0435\u0440\u0441\u0438\u043A", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#FF6347", abv: 5, pricePerLiter: 125, volume: 400, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 1 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_doktor_dizel_vishnya_persik_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u0414\u043E\u043A\u0442\u043E\u0440 \u0414\u0438\u0437\u0435\u043B\u044C \u043C\u0430\u043B\u0438\u043D\u0430 \u043B\u0430\u0439\u043C", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#DC143C", abv: 5, pricePerLiter: 125, volume: 400, tasteProfile: { sweet: 6, sour: 5, bitter: 0, alcohol: 1 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_doktor_dizel_malina_laym_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u041C\u0438\u0441\u0442\u0435\u0440 \u041A\u0440\u0430\u0444\u0442 \u0447\u0435\u0440\u043D\u0430\u044F \u043C\u0430\u043B\u0438\u043D\u0430 \u043B\u0430\u0439\u043C", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#8B008B", abv: 6, pricePerLiter: 143, volume: 420, tasteProfile: { sweet: 6, sour: 5, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_mister_kraft_chernaya_malina_laym_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u0413\u043E\u043B\u0443\u0431\u044B\u0435 \u0413\u0430\u0432\u0430\u0439\u0438", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#00BFFF", abv: 7, pricePerLiter: 182, volume: 330, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_nemiroff_golubye_gavayi_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u0447\u0435\u0440\u043D\u0438\u043A\u0430 \u0433\u0440\u0430\u043D\u0430\u0442 \u0447\u0435\u0440\u043D\u0430\u044F \u0441\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u0430 \u0440\u043E\u043C", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#663399", abv: 7, pricePerLiter: 182, volume: 330, tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_nemiroff_chernika_granat_chernaya_smorodina_rom_st_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u041F\u0438\u043A \u0410\u043F \u0430\u0440\u0431\u0443\u0437\u043D\u044B\u0439 \u043C\u043E\u0445\u0438\u0442\u043E", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#90EE90", abv: 5, pricePerLiter: 152, volume: 330, tasteProfile: { sweet: 7, sour: 4, bitter: 0, alcohol: 1 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_pik_ap_arbuznyy_mokhito_st/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u041F\u0438\u043A \u0410\u043F \u0432\u0438\u0441\u043A\u0438 \u0438 \u043A\u043E\u043B\u0430", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#654321", abv: 7, pricePerLiter: 140, volume: 430, tasteProfile: { sweet: 6, sour: 1, bitter: 2, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_pik_ap_viski_i_kola_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u043F\u0438\u0432\u043D\u043E\u0439 \u041F\u0438\u043A \u0410\u043F \u043A\u043E\u043D\u044C\u044F\u043A \u0438 \u043C\u0438\u043D\u0434\u0430\u043B\u044C", category: "soda", subtype: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438", color: "#D2691E", abv: 7, pricePerLiter: 140, volume: 430, tasteProfile: { sweet: 7, sour: 0, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/energetiki_kokteyli/__7/napitok_pivnoy_pik_ap_konyak_i_mindal_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-tinctures-part1.ts
var KRASNOEIBELOE_TINCTURES_PART1;
var init_krasnoeibeloe_tinctures_part1 = __esm({
  "client/src/lib/krasnoeibeloe-tinctures-part1.ts"() {
    "use strict";
    KRASNOEIBELOE_TINCTURES_PART1 = [
      // === Страница 1 ===
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u0423\u043A\u0440\u0430\u0438\u043D\u0441\u043A\u0430\u044F \u041C\u0435\u0434\u043E\u0432\u0430\u044F \u0441 \u043F\u0435\u0440\u0446\u0435\u043C 0.5\u043B", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FFD700", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 6, sour: 0, bitter: 4, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_gorkaya_nemiroff_medovaya_s_pertsem/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u0417\u043E\u043B\u043E\u0442\u043E\u0439 \u0414\u0436\u043E\u043A\u0435\u0440 0.5\u043B", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#DAA520", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 5, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/37104-nastoyka_gorkaya_zolotoy_dzhoker_40_0_5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u041B\u0438\u043C\u043E\u043D\u043A\u0430 \u0441\u043B\u0430\u0434\u043A\u0430\u044F 0.5\u043B", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FFFF00", abv: 29, pricePerLiter: 500, volume: 500, tasteProfile: { sweet: 8, sour: 5, bitter: 0, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_limonka_sladkaya_so_vkusom_limona_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u0423\u043A\u0440\u0430\u0438\u043D\u0441\u043A\u0430\u044F \u041C\u0435\u0434\u043E\u0432\u0430\u044F \u0441 \u043F\u0435\u0440\u0446\u0435\u043C 0.25\u043B", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FFD700", abv: 40, pricePerLiter: 800, volume: 250, tasteProfile: { sweet: 6, sour: 0, bitter: 4, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_gorkaya_nemiroff_medovaya_s_pertsem_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u041F\u0435\u0440\u043C\u0441\u043A\u0430\u044F \u041B\u044E\u043A\u0441 0.25\u043B", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#8B4513", abv: 35, pricePerLiter: 600, volume: 250, tasteProfile: { sweet: 2, sour: 0, bitter: 6, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_gorkaya_permskaya_lyuks_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0441\u043B\u0430\u0434\u043A\u0430\u044F \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u043A\u043B\u044E\u043A\u0432\u0430 \u043D\u0430 \u043A\u043E\u043D\u044C\u044F\u043A\u0435 0.25\u043B", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#DC143C", abv: 21, pricePerLiter: 700, volume: 250, tasteProfile: { sweet: 7, sour: 4, bitter: 1, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_sladkaya_klyukva_na_konyake_nemiroff_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u0417\u043E\u043B\u043E\u0442\u043E\u0439 \u0414\u0436\u043E\u043A\u0435\u0440 0.25\u043B", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#DAA520", abv: 40, pricePerLiter: 600, volume: 250, tasteProfile: { sweet: 3, sour: 0, bitter: 5, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/37876-nastoyka_gorkaya_zolotoy_dzhoker_40_0_25/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u041B\u0438\u043C\u043E\u043D\u043A\u0430 \u0441\u043B\u0430\u0434\u043A\u0430\u044F 0.1\u043B", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FFFF00", abv: 29, pricePerLiter: 500, volume: 100, tasteProfile: { sweet: 8, sour: 5, bitter: 0, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_limonka_sladkaya_so_vkusom_limona/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0410\u0431\u0441\u0435\u043D\u0442 \u0424\u0440\u0438\u043C\u0435\u043D \u0433\u043E\u0440\u044C\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#9ACD32", abv: 60, pricePerLiter: 1e3, volume: 500, tasteProfile: { sweet: 2, sour: 0, bitter: 8, alcohol: 9 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/__1964/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0441\u043B\u0430\u0434\u043A\u0430\u044F \u041C\u0430\u0440\u044C\u044F\u0436 \u043A\u043E\u043D\u044C\u044F\u0447\u043D\u0430\u044F \u043A\u043B\u044E\u043A\u0432\u0430", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#DC143C", abv: 23, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 7, sour: 4, bitter: 1, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/36413-nastoyka_sladkaya_maryazh_konyachnaya_s_aromatom_klyukvy_23_0_5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u0427\u0435\u0441\u0442\u043D\u0430\u044F \u043F\u0435\u0440\u0446\u043E\u0432\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FF4500", abv: 40, pricePerLiter: 800, volume: 375, tasteProfile: { sweet: 1, sour: 0, bitter: 7, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/21889-nast-gorkaya-chestnaya-pertsovaya-40-0-375-/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0441\u043B\u0430\u0434\u043A\u0430\u044F \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u0412\u0438\u0448\u043D\u044F \u0432 \u0448\u043E\u043A\u043E\u043B\u0430\u0434\u0435", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#8B0000", abv: 21, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 9, sour: 2, bitter: 1, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_sladkaya_nemiroff_vishnya_v_shokolade/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0441\u043B\u0430\u0434\u043A\u0430\u044F \u041C\u0430\u0440\u044C\u044F\u0436 \u043A\u043E\u043D\u044C\u044F\u0447\u043D\u0430\u044F \u0440\u044F\u0431\u0438\u043D\u0430", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FF6347", abv: 23, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 7, sour: 3, bitter: 2, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/36414-nastoyka_sladkaya_maryazh_konyachnaya_s_aromatom_ryabiny_23_0_5_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u041C\u0435\u0434\u043E\u0432\u0430\u044F \u0423\u0441\u043B\u0430\u0434\u0430", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FFD700", abv: 40, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 7, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_gorkaya_medovaya_uslada/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u041A\u043B\u044E\u043A\u0432\u0430 \u043A\u0440\u0435\u043F\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#DC143C", abv: 38, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 3, sour: 5, bitter: 4, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastroyka_gorkaya_nemiroff_klyukva_krepkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0441\u043B\u0430\u0434\u043A\u0430\u044F \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u043A\u043B\u044E\u043A\u0432\u0430 \u043D\u0430 \u043A\u043E\u043D\u044C\u044F\u043A\u0435 0.5\u043B", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#DC143C", abv: 21, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 7, sour: 4, bitter: 1, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_sladkaya_klyukva_na_konyake_nemiroff_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u041F\u0435\u0440\u043C\u0441\u043A\u0430\u044F \u041B\u044E\u043A\u0441 0.5\u043B", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#8B4513", abv: 35, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 2, sour: 0, bitter: 6, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_gorkaya_permskaya_lyuks/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u0430\u043C\u043E\u0433\u043E\u043D \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u043D\u0430 \u043A\u0435\u0434\u0440\u043E\u0432\u044B\u0445 \u043E\u0440\u0435\u0445\u0430\u0445", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#8B4513", abv: 38, pricePerLiter: 900, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 4, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/samogon_nemiroff_na_kedrovykh_orekhakh/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u0441\u043B\u0430\u0434\u043A\u0430\u044F \u0447\u0435\u0440\u043D\u0430\u044F \u0441\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u0430", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#4B0082", abv: 21, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 8, sour: 4, bitter: 0, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_sladkaya_nemiroff_chernaya_smorodina/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-tinctures-part2.ts
var KRASNOEIBELOE_TINCTURES_PART2;
var init_krasnoeibeloe_tinctures_part2 = __esm({
  "client/src/lib/krasnoeibeloe-tinctures-part2.ts"() {
    "use strict";
    KRASNOEIBELOE_TINCTURES_PART2 = [
      // === Страница 2 ===
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0420\u0443\u0441\u0441\u043A\u0430\u044F \u043C\u043E\u0437\u0430\u0438\u043A\u0430 \u043A\u043B\u044E\u043A\u0432\u0430 \u043D\u0430 \u043A\u043E\u043D\u044C\u044F\u043A\u0435 \u0441\u043B\u0430\u0434\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#DC143C", abv: 18.5, pricePerLiter: 500, volume: 500, tasteProfile: { sweet: 7, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_sladkaya_russkaya_mozaika_klyukva_na_konyake/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0441\u043B\u0430\u0434\u043A\u0430\u044F \u0426\u0430\u0440\u0441\u043A\u0430\u044F \u043A\u0440\u0435\u043F\u043E\u0441\u0442\u044C \u0440\u044F\u0431\u0438\u043D\u0430 \u043D\u0430 \u043A\u043E\u043D\u044C\u044F\u043A\u0435", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FF6347", abv: 21, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 7, sour: 3, bitter: 2, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_sladkaya_tsarskaya_krepost_ryabina_na_konyake/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u0426\u0430\u0440\u0441\u043A\u0430\u044F \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u0430", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#4B0082", abv: 38, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 3, sour: 4, bitter: 5, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_gorkaya_tsarskaya_originalnaya_smorodina/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0421\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u043A\u0430 \u0441\u043B\u0430\u0434\u043A\u0430\u044F 24%", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#4B0082", abv: 24, pricePerLiter: 500, volume: 500, tasteProfile: { sweet: 8, sour: 4, bitter: 0, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_smorodinka_sladkaya_24_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u0426\u0430\u0440\u0441\u043A\u0430\u044F \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043A\u043B\u044E\u043A\u0432\u0435\u043D\u043D\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#DC143C", abv: 38, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 3, sour: 5, bitter: 5, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_gorkaya_tsarskaya_originalnaya_klyukvennaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0413\u043E\u0440\u044B\u043D\u044B\u0447 \u041C\u0435\u0434 \u0438 \u041F\u0435\u0440\u0435\u0446 \u0433\u043E\u0440\u044C\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FFD700", abv: 36.6, pricePerLiter: 650, volume: 500, tasteProfile: { sweet: 5, sour: 0, bitter: 6, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_gorynych_med_i_perets_gorkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0413\u043E\u0440\u044B\u043D\u044B\u0447 \u0425\u0440\u0435\u043D\u043E\u0432\u0443\u0445\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#F0E68C", abv: 36.6, pricePerLiter: 650, volume: 500, tasteProfile: { sweet: 1, sour: 0, bitter: 8, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_gorynych_khrenovukha_gorkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0421\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u043A\u0430 \u0441\u043B\u0430\u0434\u043A\u0430\u044F 0.1\u043B", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#4B0082", abv: 24, pricePerLiter: 500, volume: 100, tasteProfile: { sweet: 8, sour: 4, bitter: 0, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_smorodinka_sladkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u041F\u043E\u043B\u0443\u0433\u0430\u0440 \u21161 \u0440\u043E\u0436\u044C \u0438 \u043F\u0448\u0435\u043D\u0438\u0446\u0430", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#F5DEB3", abv: 38.5, pricePerLiter: 1400, volume: 500, tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/napitok_spirtnoy_polugar_1_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0411\u0430\u0439\u043A\u0430\u043B \u041A\u043B\u044E\u043A\u0432\u0430 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#DC143C", abv: 38, pricePerLiter: 650, volume: 500, tasteProfile: { sweet: 5, sour: 5, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_baykal_klyukva_polusladkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0411\u0430\u0439\u043A\u0430\u043B \u043D\u0430 \u043A\u0435\u0434\u0440\u043E\u0432\u044B\u0445 \u043E\u0440\u0435\u0448\u043A\u0430\u0445 \u0433\u043E\u0440\u044C\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#8B4513", abv: 38, pricePerLiter: 650, volume: 500, tasteProfile: { sweet: 2, sour: 0, bitter: 5, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_baykal_na_kedrovykh_oreshkakh_gorkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0411\u0435\u043B\u0430\u044F \u0431\u0435\u0440\u0435\u0437\u043A\u0430 \u0410\u043B\u0442\u0430\u0439\u0441\u043A\u0430\u044F \u043E\u0431\u043B\u0435\u043F\u0438\u0445\u0430 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FFA500", abv: 35, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 6, sour: 4, bitter: 2, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_belaya_berezka_altayskaya_oblepikha_polusladkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0411\u0435\u043B\u0430\u044F \u0431\u0435\u0440\u0435\u0437\u043A\u0430 \u041A\u0430\u0440\u0435\u043B\u044C\u0441\u043A\u0430\u044F \u043C\u0430\u043B\u0438\u043D\u0430 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#DC143C", abv: 35, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 6, sour: 3, bitter: 2, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_belaya_berezka_karelskaya_malina_polusladkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0433\u043E\u0440\u044C\u043A\u0430\u044F \u0426\u0430\u0440\u0441\u043A\u0430\u044F \u0433\u0440\u0443\u0448\u0430", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#9ACD32", abv: 38, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 4, sour: 2, bitter: 5, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_gorkaya_tsarskaya_grusha/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0421\u0438\u0431\u0431\u0438\u0442\u0442\u0435\u0440 \u0411\u0440\u0443\u0441\u043D\u0438\u043A\u0430 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#DC143C", abv: 20, pricePerLiter: 500, volume: 500, tasteProfile: { sweet: 6, sour: 4, bitter: 2, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_sibbitter_brusnika_polusladkaya_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0421\u0438\u0431\u0431\u0438\u0442\u0442\u0435\u0440 \u0417\u0435\u043C\u043B\u044F\u043D\u0438\u043A\u0430 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FF1493", abv: 20, pricePerLiter: 500, volume: 500, tasteProfile: { sweet: 7, sour: 3, bitter: 1, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_sibbitter_zemlyanika_sladkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0421\u0438\u0431\u0431\u0438\u0442\u0442\u0435\u0440 \u041A\u0435\u0434\u0440\u043E\u0432\u044B\u0435 \u041E\u0440\u0435\u0445\u0438 \u0433\u043E\u0440\u044C\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#8B4513", abv: 35, pricePerLiter: 650, volume: 500, tasteProfile: { sweet: 2, sour: 0, bitter: 5, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_sibbitter_kedrovye_orekhi_gorkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0421\u0438\u0431\u0431\u0438\u0442\u0442\u0435\u0440 \u041C\u043E\u0440\u043E\u0448\u043A\u0430 \u0441\u043B\u0430\u0434\u043A\u0430\u044F", category: "alcohol", subtype: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430", color: "#FFB347", abv: 18.5, pricePerLiter: 450, volume: 500, tasteProfile: { sweet: 8, sour: 2, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/nastoyka/nastoyka_sibbitter_moroshka_sladkaya_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-tinctures.ts
var KRASNOEIBELOE_TINCTURES;
var init_krasnoeibeloe_tinctures = __esm({
  "client/src/lib/krasnoeibeloe-tinctures.ts"() {
    "use strict";
    init_krasnoeibeloe_tinctures_part1();
    init_krasnoeibeloe_tinctures_part2();
    KRASNOEIBELOE_TINCTURES = [
      ...KRASNOEIBELOE_TINCTURES_PART1,
      ...KRASNOEIBELOE_TINCTURES_PART2
    ];
  }
});

// client/src/lib/krasnoeibeloe-vodka.ts
var KRASNOEIBELOE_VODKA;
var init_krasnoeibeloe_vodka = __esm({
  "client/src/lib/krasnoeibeloe-vodka.ts"() {
    "use strict";
    KRASNOEIBELOE_VODKA = [
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0420\u0443\u0441\u0441\u043A\u0438\u0439 \u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 857, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/_40_0_7_10/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u041C\u0435\u0434\u0432\u0435\u0434\u044C 0.5\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 500, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/__499/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0425\u0430\u043D\u0441\u043A\u0430\u044F", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/__876/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u041C\u0435\u0434\u0432\u0435\u0434\u044C 1\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 500, volume: 1e3, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/__501/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u043E\u0441\u043E\u0431\u0430\u044F \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u043F\u0448\u0435\u043D\u0438\u0446\u0430 1\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 700, volume: 1e3, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_osobaya_nemiroff_pshenitsa_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0422\u0443\u043D\u0434\u0440\u0430 \u0410\u0443\u0442\u0435\u043D\u0442\u0438\u043A", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 714, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_tundra_autentik/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0421\u0442\u0430\u0440\u043B\u0435\u0439", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 550, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/__503/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u041A\u0430\u043B\u0430\u0448\u043D\u0438\u043A\u043E\u0432 \u041F\u0440\u0435\u043C\u0438\u0443\u043C", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_kalashnikov_premium/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0426\u0430\u0440\u0441\u043A\u0438\u0439 \u043A\u0443\u0431\u043E\u043A", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 714, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_tsarskiy_kubok/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0426\u0430\u0440\u0441\u043A\u0430\u044F 0.7\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 714, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_tsarskaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u043E\u0441\u043E\u0431\u0430\u044F \u041D\u0435\u043C\u0438\u0440\u043E\u0444\u0444 \u041F\u0448\u0435\u043D\u0438\u0446\u0430 0.5\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_nemiroff_pshenitsa/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0426\u0430\u0440\u0441\u043A\u0430\u044F \u041E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F 0.25\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 700, volume: 250, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_tsarskaya_originalnaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0418\u0437\u0431\u0443\u0448\u043A\u0430 0.25\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 500, volume: 250, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_izbushka/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0421\u043B\u0430\u0432\u044F\u043D\u0441\u043A\u0430\u044F \u043C\u044F\u0433\u043A\u0430\u044F \u043D\u0430 \u0431\u0435\u0440\u0435\u0437\u043E\u0432\u044B\u0445 \u043F\u043E\u0447\u043A\u0430\u0445", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 1, sour: 0, bitter: 0, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/_40_0_5_22/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0411\u0435\u043B\u0443\u0433\u0430 \u041D\u043E\u0431\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 2e3, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/__1160/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u041D\u0435\u043A\u0442\u0430\u0440 \u041A\u043E\u043B\u043E\u0441\u043A\u0430 \u043D\u0430 \u041C\u043E\u043B\u043E\u043A\u0435", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#FFFACD", abv: 40, pricePerLiter: 650, volume: 500, tasteProfile: { sweet: 2, sour: 0, bitter: 0, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/23003-vodka-nektar-koloska-na-moloke-40-0-5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u041F\u044F\u0442\u044C \u041E\u0437\u0435\u0440 0.25\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 600, volume: 250, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_pyat_ozer_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u041F\u044F\u0442\u044C \u041E\u0437\u0435\u0440 0.375\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 600, volume: 375, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_pyat_ozer_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u043E\u0441\u043E\u0431\u0430\u044F \u0417\u0435\u043B\u0435\u043D\u0430\u044F \u041C\u0430\u0440\u043A\u0430 \u041A\u0435\u0434\u0440\u043E\u0432\u0430\u044F 0.1\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 700, volume: 100, tasteProfile: { sweet: 1, sour: 0, bitter: 0, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/30568-vodka_osobaya_zelenaya_marka_kedrovaya_40_0_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0422\u0430\u043B\u043A\u0430 0.5\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 550, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/21453-vodka-talka-40-0-5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0422\u0430\u043B\u043A\u0430 0.25\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 550, volume: 250, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/__121/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0425\u0430\u0441\u043A\u0438 \u0410\u0440\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043B\u0451\u0434", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 714, volume: 700, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_khaski_arkticheskiy_lyed/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0418\u0437\u0431\u0443\u0448\u043A\u0430 0.5\u043B", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 500, volume: 500, tasteProfile: { sweet: 0, sour: 0, bitter: 1, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/vodka_izbushka_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u043E\u0434\u043A\u0430 \u0421\u0442\u0430\u043B\u043A\u043E\u0432\u0441\u043A\u0430\u044F \u0410\u043B\u044C\u0444\u0430", category: "alcohol", subtype: "\u0412\u043E\u0434\u043A\u0430", color: "#F0F0F0", abv: 40, pricePerLiter: 800, volume: 375, tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vodka_nastoyki/vodka/__1195/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-whiskey-part1.ts
var KRASNOEIBELOE_WHISKEY_PART1;
var init_krasnoeibeloe_whiskey_part1 = __esm({
  "client/src/lib/krasnoeibeloe-whiskey-part1.ts"() {
    "use strict";
    KRASNOEIBELOE_WHISKEY_PART1 = [
      // === Страница 1 ===
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0424\u043E\u0443\u043B\u0435\u0440\u0441 0.7\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 714, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 4, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_zernovoy_foulers/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041D\u043E\u0431\u043B \u0421\u0442\u0430\u0433 0.25\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 600, volume: 250, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_nobl_stag_3_goda_kupazhirovannyy_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0414\u0436\u043E\u043D\u043D\u0438 \u0423\u043E\u043A\u0435\u0440 \u0420\u044D\u0434 \u041B\u0435\u0439\u0431\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 4, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/__536/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0431\u0443\u0440\u0431\u043E\u043D \u0414\u0436\u0438\u043C \u0411\u0438\u043C 4 \u0433\u043E\u0434\u0430 1\u043B", category: "alcohol", subtype: "\u0411\u0443\u0440\u0431\u043E\u043D", color: "#8B4513", abv: 40, pricePerLiter: 1500, volume: 1e3, tasteProfile: { sweet: 5, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/__477/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0414\u0436\u0435\u0439\u043C\u0441 \u0411\u0430\u0440\u043B\u0438 0.1\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 500, volume: 100, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_dzheyms_barli/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u0412\u0438\u043B\u044C\u044F\u043C \u041B\u043E\u0443\u0441\u043E\u043D\u0441 \u0421\u0443\u043F\u0435\u0440 \u0421\u043F\u0430\u0439\u0441\u0434 3 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 35, pricePerLiter: 857, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/spirtnoy_nap_vilyam_lousons_super_spaysd_vyderzhka_3_goda/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u043E\u0432\u044B\u0439 \u043D\u0430\u043F\u0438\u0442\u043E\u043A \u043A\u0440\u0435\u043F\u043A\u0438\u0439 \u0417\u043E\u043B\u043E\u0442\u043E\u0439 \u0414\u0436\u043E\u043A\u0435\u0440", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/37217-napitok_viskovyy_krepkiy_zolotoy_dzhoker_40_0_5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0414\u0436\u0435\u043C\u0435\u0441\u043E\u043D", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/_jameson_40_0_7_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0437\u0435\u0440\u043D\u043E\u0432\u043E\u0439 \u041C\u0430\u043A\u043A\u0430\u043B\u043B\u0438\u0441\u0442\u0435\u0440 0.25\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 600, volume: 250, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_zernovoy_makkalister/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u041D\u0430\u043A\u0438 \u0422\u043E\u043C\u043F\u0441\u043E\u043D \u042D\u043F\u043F\u043B \u041F\u0430\u0439 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0432\u0438\u0441\u043A\u0438", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 35, pricePerLiter: 714, volume: 700, tasteProfile: { sweet: 7, sour: 2, bitter: 2, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/nastoyka_polusladkaya_naki_tompson_eppl_pay_na_osnove_viski_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0424\u043E\u0443\u043B\u0435\u0440\u0441 0.25\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 714, volume: 250, tasteProfile: { sweet: 3, sour: 0, bitter: 4, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_foulers/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041D\u0430\u043A\u0438 \u0422\u043E\u043C\u043F\u0441\u043E\u043D 3 \u0433\u043E\u0434\u0430 0.5\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_naki_tompson_3_goda_kupazhirovannyy_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041D\u0430\u043A\u0438 \u0422\u043E\u043C\u043F\u0441\u043E\u043D 3 \u0433\u043E\u0434\u0430 0.7\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 857, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_naki_tompson_3_goda_kupazhirovannyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041D\u043E\u0431\u043B \u0421\u0442\u0430\u0433 0.7\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 714, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_nobl_stag_3_goda_kupazhirovannyy_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0427\u0438\u0432\u0430\u0441 \u0420\u0438\u0433\u0430\u043B 12 \u043B\u0435\u0442", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B4513", abv: 40, pricePerLiter: 3429, volume: 700, tasteProfile: { sweet: 5, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/34097-viski_chivas_rigal_kupazh_12_let_v_p_k_40_0_7/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0411\u0430\u043B\u043B\u0430\u043D\u0442\u0430\u0439\u043D\u0441 \u0424\u0430\u0439\u043D\u0435\u0441\u0442 3 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1571, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/_3__59/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041B\u0430\u043A\u0438 \u041D\u0430\u043A\u0438", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 714, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_kupazhirovannyy_laki_naki_vyderzhka_3_goda_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0412\u0438\u043B\u044C\u044F\u043C \u041B\u043E\u0443\u0441\u043E\u043D\u0441 3 \u0433\u043E\u0434\u0430 0.5\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1e3, volume: 500, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/_3__43/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0424\u044D\u0439\u043C\u043E\u0441 \u0413\u0440\u0430\u0443\u0437 3 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/_3__50/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041C\u0430\u043A\u043A\u0430\u043B\u043B\u0438\u0441\u0442\u0435\u0440 0.5\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_makkallister/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u0412\u0438\u043B\u044C\u044F\u043C \u041B\u043E\u0443\u0441\u043E\u043D\u0441 \u0421\u0443\u043F\u0435\u0440 \u0421\u043F\u0430\u0439\u0441\u0434 0.5\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 35, pricePerLiter: 900, volume: 500, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/__1353/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0431\u0443\u0440\u0431\u043E\u043D \u0414\u0436\u0438\u043C \u0411\u0438\u043C 0.75\u043B", category: "alcohol", subtype: "\u0411\u0443\u0440\u0431\u043E\u043D", color: "#8B4513", abv: 40, pricePerLiter: 1467, volume: 750, tasteProfile: { sweet: 5, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_burbon_dzhim_bim/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041D\u043E\u0431\u043B \u0421\u0442\u0430\u0433 0.5\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_nobl_stag_3_goda_kupazhirovannyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0414\u0436\u0435\u0439\u043C\u0441 \u0411\u0430\u0440\u043B\u0438 0.25\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 500, volume: 250, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_dzheyms_barli_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-whiskey-part2.ts
var KRASNOEIBELOE_WHISKEY_PART2;
var init_krasnoeibeloe_whiskey_part2 = __esm({
  "client/src/lib/krasnoeibeloe-whiskey-part2.ts"() {
    "use strict";
    KRASNOEIBELOE_WHISKEY_PART2 = [
      // === Страница 2 ===
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0424\u043E\u043A\u0441 \u044D\u043D\u0434 \u0414\u043E\u0433\u0441 3 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/_3__62/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0422\u0435\u043D\u043D\u0435\u0441\u0441\u0438 \u0414\u0436\u0435\u043A \u0414\u0435\u043D\u0438\u0435\u043B\u0441", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B4513", abv: 40, pricePerLiter: 4286, volume: 700, tasteProfile: { sweet: 5, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/_2__2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041D\u0430\u043A\u0438 \u0422\u043E\u043C\u043F\u0441\u043E\u043D 0.25\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 800, volume: 250, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_naki_tompson/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0413\u0440\u0435\u0439\u0441 4 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1143, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/_4_40/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041C\u0430\u043A\u0430\u043B\u043B\u0430\u043D \u0414\u0430\u0431\u043B \u041A\u0430\u0441\u043A 12 \u043B\u0435\u0442", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B4513", abv: 40, pricePerLiter: 8571, volume: 700, tasteProfile: { sweet: 6, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/_12_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0414\u044E\u0430\u0440\u0441 \u0411\u0435\u043B\u0430\u044F \u042D\u0442\u0438\u043A\u0435\u0442\u043A\u0430 3 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1714, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/_dewar_s_white_label_40_0_7_12_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0422\u0438\u0447\u0435\u0440\u0441 \u0425\u0430\u0439\u043B\u0430\u043D\u0434 \u041A\u0440\u0438\u043C 3 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1571, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/_40_0_7_7/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0414\u044E\u0430\u0440\u0441 \u041F\u043E\u0440\u0442\u0443\u0433\u0438\u0437 \u0421\u043C\u0443\u0437 8 \u043B\u0435\u0442", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B4513", abv: 40, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 5, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_dyuars_portugiz_smuz_kupazhir_8_let_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0427\u0438\u0432\u0430\u0441 \u0420\u0438\u0433\u0430\u043B 12 \u043B\u0435\u0442 0.5\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B4513", abv: 40, pricePerLiter: 3600, volume: 500, tasteProfile: { sweet: 5, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/_12_0_5/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0412\u0438\u043B\u044C\u044F\u043C \u041B\u043E\u0443\u0441\u043E\u043D\u0441 3 \u0433\u043E\u0434\u0430 0.7\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1286, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_vilyam_lousons_ne_menee_3_let_kupazhirovannyy_napitok_pepsi_kola_2sht/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0417\u0435 \u0413\u0443\u0430\u0440\u0434\u0438\u0430\u043D", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 900, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_kupazhirovannyy_shotlandskiy_ze_guardian/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0424\u043E\u0443\u043B\u0435\u0440\u0441 \u041F\u0435\u0440\u0441\u0438\u043A \u0441 \u0432\u0438\u0441\u043A\u0438", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#FFDAB9", abv: 35, pricePerLiter: 714, volume: 700, tasteProfile: { sweet: 7, sour: 2, bitter: 2, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/nastoyka_foulers_persik_na_osnove_viski_p_sl/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0422\u0430\u0432\u0435\u0440\u043D \u0425\u0430\u0443\u043D\u0434 \u042F\u0431\u043B\u043E\u043A\u043E \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0432\u0438\u0441\u043A\u0438", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#90EE90", abv: 35, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 7, sour: 3, bitter: 2, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/nastoyka_p_sl_tavern_khaund_yabloko_na_osnove_viski_burbon_stayl/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041C\u0430\u043A\u043B\u0435\u043E\u0434", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 800, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_makleod/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u043A\u0443\u043F\u0430\u0436\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0418\u043D\u0430\u0438\u0437\u0443\u043C\u0438", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 2857, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_inaizumi_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0420\u044D\u0434\u0432\u043E\u0440\u043A\u0435\u0440", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_redvorker/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0413\u0440\u0430\u043D\u0436\u0441\u0442\u043E\u0443\u043D \u0431\u0443\u0440\u0431\u043E\u043D \u043A\u0430\u0441\u043A \u0444\u0438\u043D\u0438\u0448", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B4513", abv: 40, pricePerLiter: 2857, volume: 700, tasteProfile: { sweet: 5, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_granzhstoun_burbon_kask_finish_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041E\u043B\u0434 \u0421\u043C\u0430\u0433\u0433\u043B\u0435\u0440", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1286, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_old_smaggler/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0414\u0436\u0435\u0439\u043C\u0441 \u0411\u0430\u0440\u043B\u0438 \u0437\u0435\u0440\u043D\u043E\u0432\u043E\u0439 0.5\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 600, volume: 500, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_zernovoy_dzheyms_barli/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u041D\u043E\u0431\u043B \u0421\u0442\u0430\u0433 \u0421\u043F\u0430\u0439\u0441\u0434", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 35, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/napitok_spirtnoy_zernovoy_distillirovannyy_kupazhirovannyy_nobl_stag_spaysd__1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0421\u0438\u0440 \u042D\u0434\u0432\u0430\u0440\u0434\u0441 \u0448\u043E\u0442\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0439", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1143, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_sir_edvarts_shotlandskiy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0414\u0436\u0438\u043C \u0411\u0438\u043C \u042D\u043F\u043F\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#90EE90", abv: 32.5, pricePerLiter: 1571, volume: 700, tasteProfile: { sweet: 6, sour: 3, bitter: 2, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_dzhim_bim_eppl_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u0414\u0436\u0438\u043C \u0411\u0438\u043C \u0411\u043B\u044D\u043A \u0427\u0435\u0440\u0440\u0438", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B0000", abv: 32.5, pricePerLiter: 1571, volume: 700, tasteProfile: { sweet: 6, sour: 2, bitter: 2, alcohol: 5 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/napitok_spirtnoy_dzhim_bim_blek_cherri/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-whiskey-part3.ts
var KRASNOEIBELOE_WHISKEY_PART3;
var init_krasnoeibeloe_whiskey_part3 = __esm({
  "client/src/lib/krasnoeibeloe-whiskey-part3.ts"() {
    "use strict";
    KRASNOEIBELOE_WHISKEY_PART3 = [
      // === Страница 3 ===
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u041D\u043E\u0431\u043B \u0421\u0442\u0430\u0433 \u042F\u0431\u043B\u043E\u043A\u043E", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#90EE90", abv: 35, pricePerLiter: 700, volume: 500, tasteProfile: { sweet: 7, sour: 3, bitter: 2, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/napitok_spirtnoy_nobl_stag_yabloko/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0424\u043E\u0443\u043B\u0435\u0440\u0441 \u0412\u0438\u0448\u043D\u044F \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0432\u0438\u0441\u043A\u0438", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B0000", abv: 35, pricePerLiter: 714, volume: 700, tasteProfile: { sweet: 7, sour: 2, bitter: 2, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/nastoyka_foulers_vishnya_na_osnove_viski_polusladkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0410\u0431\u0435\u0440\u0444\u0435\u043B\u0434\u0438 12 \u043B\u0435\u0442", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B4513", abv: 40, pricePerLiter: 7143, volume: 700, tasteProfile: { sweet: 6, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_aberfeldi_12let_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0413\u043B\u0435\u043D \u041C\u043E\u0440\u0435\u0439 \u0421\u0438\u043D\u0433\u043B \u041C\u043E\u043B\u0442 \u041E\u0443\u0440 \u041A\u043B\u0430\u0441\u0441\u0438\u043A", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B4513", abv: 40, pricePerLiter: 3429, volume: 700, tasteProfile: { sweet: 5, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_glen_morey_singl_molt_our_klassik/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0425\u0430\u0439\u043B\u0430\u043D\u0434 \u041F\u0430\u0440\u043A 12 \u043B\u0435\u0442", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B4513", abv: 40, pricePerLiter: 5714, volume: 700, tasteProfile: { sweet: 5, sour: 0, bitter: 4, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_khaylend_park_12_let_viking_khonor_p_k/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0421\u0438\u0440 \u042D\u0434\u0432\u0430\u0440\u0434\u0441 \u0448\u043E\u0442\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0439 0.2\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1200, volume: 200, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_sir_edvards_shotlandskiy_kupazhirovannyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041C\u044D\u0439\u043A\u0435\u0440\u0441 \u041C\u0430\u0440\u043A", category: "alcohol", subtype: "\u0411\u0443\u0440\u0431\u043E\u043D", color: "#8B4513", abv: 45, pricePerLiter: 3429, volume: 700, tasteProfile: { sweet: 6, sour: 0, bitter: 3, alcohol: 8 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_meykers_mark/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0422\u0438\u043B\u0438\u043D\u0433 \u0421\u043C\u043E\u043B \u0411\u044D\u0442\u0447", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B4513", abv: 46, pricePerLiter: 4286, volume: 700, tasteProfile: { sweet: 5, sour: 0, bitter: 4, alcohol: 8 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_tiling_smol_betch/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0421\u043A\u043E\u0442\u0441 \u0413\u0440\u044D\u0439 \u0448\u043E\u0442\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0439", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1143, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_skots_grey_shotlandskiy_kupazhirovannyy_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0411\u043B\u044D\u043A \u0420\u044D\u043C 3 \u0433\u043E\u0434\u0430", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1143, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_blek_rem_3_goda_kupazhirovannyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0412\u0438\u043B\u044C\u044F\u043C \u041B\u043E\u0443\u0441\u043E\u043D\u0441 3 \u0433\u043E\u0434\u0430 0.25\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1200, volume: 250, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_vilyam_lousons_kupazhirovannyy_ne_menee_3_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0414\u044E\u0430\u0440\u0441 \u0424\u0440\u0435\u043D\u0447 \u0421\u043C\u0443\u0437 8 \u043B\u0435\u0442", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#8B4513", abv: 40, pricePerLiter: 2286, volume: 700, tasteProfile: { sweet: 5, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_dyuars_french_smuz_kupazhirovannyy_8_let/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041A\u043B\u0438\u0433\u0430\u043D 0.25\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 600, volume: 250, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_kligan_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u041A\u043B\u0438\u0433\u0430\u043D 0.1\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 600, volume: 100, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_kligan/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0421\u043E\u043D\u0447\u043E \u043A\u0443\u043F\u0430\u0436\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 857, volume: 700, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_soncho_kupazhirovannyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0424\u043E\u0443\u043B\u0435\u0440\u0441 \u0437\u0435\u0440\u043D\u043E\u0432\u043E\u0439 0.1\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 700, volume: 100, tasteProfile: { sweet: 3, sour: 0, bitter: 4, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_foulers_zernovoy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u0441\u043A\u0438 \u0424\u044D\u0439\u043C\u043E\u0441 \u0413\u0440\u0430\u0443\u0437 0.5\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1800, volume: 500, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/viski_kupazhirovannyy_feymos_grauz/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0431\u043E\u0440 \u0412\u0438\u0441\u043A\u0438 \u0412\u0438\u043B\u044C\u044F\u043C \u041B\u043E\u0443\u0441\u043E\u043D\u0441 + 2 \u0431\u0430\u043D\u043A\u0438 Rich \u041A\u043E\u043B\u0430", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 1286, volume: 700, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/nabor_viski_vilyam_lousons_2_banki_rich_kola/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0432\u0438\u0441\u043A\u043E\u0432\u044B\u0439 \u0417\u043E\u043B\u043E\u0442\u043E\u0439 \u0414\u0436\u043E\u043A\u0435\u0440 \u0436/\u0431", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 40, pricePerLiter: 600, volume: 250, tasteProfile: { sweet: 3, sour: 0, bitter: 3, alcohol: 7 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/napitok_viskovyy_zolotoy_dzhoker_zh_b/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0441\u043F\u0438\u0440\u0442\u043D\u043E\u0439 \u0412\u0438\u043B\u044C\u044F\u043C \u041B\u043E\u0443\u0441\u043E\u043D\u0441 \u0421\u0443\u043F\u0435\u0440 \u0421\u043F\u0430\u0439\u0441\u0434 0.25\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#D2691E", abv: 35, pricePerLiter: 900, volume: 250, tasteProfile: { sweet: 4, sour: 0, bitter: 3, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/napitok_spirtnoy_vilyam_lousons_super_spaysd/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430 \u0424\u043E\u0443\u043B\u0435\u0440\u0441 \u043F\u0435\u0440\u0441\u0438\u043A \u0441 \u0432\u0438\u0441\u043A\u0438 0.25\u043B", category: "alcohol", subtype: "\u0412\u0438\u0441\u043A\u0438", color: "#FFDAB9", abv: 35, pricePerLiter: 720, volume: 250, tasteProfile: { sweet: 7, sour: 2, bitter: 2, alcohol: 6 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/viski/nastoyka_foulers_persik_s_viski_polusladkaya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-whiskey.ts
var KRASNOEIBELOE_WHISKEY;
var init_krasnoeibeloe_whiskey = __esm({
  "client/src/lib/krasnoeibeloe-whiskey.ts"() {
    "use strict";
    init_krasnoeibeloe_whiskey_part1();
    init_krasnoeibeloe_whiskey_part2();
    init_krasnoeibeloe_whiskey_part3();
    KRASNOEIBELOE_WHISKEY = [
      ...KRASNOEIBELOE_WHISKEY_PART1,
      ...KRASNOEIBELOE_WHISKEY_PART2,
      ...KRASNOEIBELOE_WHISKEY_PART3
    ];
  }
});

// client/src/lib/krasnoeibeloe-sparkling-wine.ts
var KRASNOEIBELOE_SPARKLING_WINE;
var init_krasnoeibeloe_sparkling_wine = __esm({
  "client/src/lib/krasnoeibeloe-sparkling-wine.ts"() {
    "use strict";
    KRASNOEIBELOE_SPARKLING_WINE = [
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0410\u0442\u0442\u043E \u041F\u0440\u0438\u043C\u043E \u0410\u0441\u0442\u0438 \u0431\u0435\u043B\u043E\u0435 \u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 7.5, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/vino_igristoe_atto_primo_asti_docg_zashch_naim_bel_sl_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0421\u0438\u0434\u0440 \u0427\u0435\u0430\u0440\u043E\u043A\u0432\u043E\u043D\u0442\u0438 \u0411\u044C\u044F\u043D\u043A\u043E \u0444\u0440\u0443\u043A\u0442\u043E\u0432\u044B\u0439 \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#F5DEB3", abv: 6, pricePerLiter: 400, volume: 750, tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/sidr_chearokvonti_byanko_fruktovyy_gazirovannyy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u041C\u0430\u0440\u0442\u0438\u043D\u0438 \u0411\u0440\u044E\u0442 \u0431\u0435\u043B\u043E\u0435 \u0431\u0440\u044E\u0442", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 11.5, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/vino_igristoe_martini_bryut_bel_bryut/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u041C\u043E\u043D\u0434\u043E\u0440\u043E \u0410\u0441\u0442\u0438 DOCG \u0431\u0435\u043B\u043E\u0435 \u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 7.5, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/_docg_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u041C\u0430\u0440\u0442\u0438\u043D\u0438 \u0410\u0441\u0442\u0438 DOCG \u0431\u0435\u043B\u043E\u0435 \u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 7.5, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/__988/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0418\u0441\u0441\u0438 \u041C\u0430\u043B\u044C\u0432\u0430\u0437\u0438\u044F \u0421\u043F\u0443\u043C\u0430\u043D\u0442\u0435 \u0431\u0435\u043B\u043E\u0435 \u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 7, pricePerLiter: 667, volume: 750, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/__475/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u041A\u043E\u0440\u0442\u0435 \u0434\u0435\u0439 \u0420\u043E\u0432\u0438 \u041F\u0440\u043E\u0441\u0435\u043A\u043A\u043E \u042D\u043A\u0441\u0442\u0440\u0430 \u0414\u0440\u0430\u0439 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 11, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/_doc__13/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0428\u0430\u0442\u043E \u0422\u0430\u043C\u0430\u043D\u044C \u0440\u043E\u0437\u043E\u0432\u043E\u0435 \u0431\u0440\u044E\u0442", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFB6C1", abv: 12.5, pricePerLiter: 667, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/__1232/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F \u0412\u0438\u043D\u043E\u0434\u0435\u043B\u0430 \u0431\u0435\u043B\u043E\u0435 \u0431\u0440\u044E\u0442", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 12.5, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/vino_igristoe_pino_blan_kollektsiya_vinodela_bel_bryut/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0427\u0438\u043D\u0437\u0430\u043D\u043E \u0410\u0441\u0442\u0438 DOCG \u0431\u0435\u043B\u043E\u0435 \u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 7, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/_docg__1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0421\u0430\u043D\u0442 \u041E\u0440\u0441\u043E\u043B\u0430 \u0410\u0441\u0442\u0438 \u0414\u041E\u041A\u0413 \u0431\u0435\u043B\u043E\u0435 \u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 7, pricePerLiter: 933, volume: 750, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/vino_igristoe_sant_orsola_asti_docg_bel_sl/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u041A\u0443\u0430\u0442\u0440\u043E \u0412\u0430\u043B\u043B\u0438 \u041B\u0430\u043C\u0431\u0440\u0443\u0441\u043A\u043E \u0411\u044C\u044F\u043D\u043A\u043E \u042D\u043C\u0438\u043B\u0438\u044F \u0431\u0435\u043B\u043E\u0435 \u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 7.5, pricePerLiter: 600, volume: 750, tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/vino_igristoe_kuatro_valli_lambrusko_byanko_emiliya_beloe_sladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u041C\u043E\u043D\u0434\u043E\u0440\u043E \u041F\u0440\u043E\u0441\u0435\u043A\u043A\u043E DOC \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 11, pricePerLiter: 1467, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/__2199/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0410\u0442\u0442\u043E \u041F\u0440\u0438\u043C\u043E \u041F\u0440\u043E\u0441\u0435\u043A\u043A\u043E \u0414\u0440\u0430\u0439 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 11.5, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/vino_igristoe_atto_primo_prosekko_doc_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u041A\u043E\u0440\u0442\u0435 \u0434\u0435\u0439 \u0420\u043E\u0432\u0438 \u041F\u0438\u043D\u043E \u0413\u0440\u0438\u0434\u0436\u043E \u0421\u043F\u0443\u043C\u0430\u043D\u0442\u0435 \u042D\u043A\u0441\u0442\u0440\u0430 \u0414\u0440\u0430\u0439 \u0431\u0435\u043B\u043E\u0435 \u0431\u0440\u044E\u0442", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFFACD", abv: 11, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/__1602/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u041A\u043E\u0440\u0442\u0435 \u0434\u0435\u0439 \u0420\u043E\u0432\u0438 \u041F\u0438\u043D\u043E \u0413\u0440\u0438\u0434\u0436\u043E \u0420\u043E\u0437\u0435 \u0421\u043F\u0443\u043C\u0430\u043D\u0442\u0435 \u042D\u043A\u0441\u0442\u0440\u0430 \u0414\u0440\u0430\u0439 \u0440\u043E\u0437\u043E\u0432\u043E\u0435 \u0431\u0440\u044E\u0442", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", color: "#FFB6C1", abv: 11, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 0, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vino_igristoe/__1738/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-vermouth.ts
var KRASNOEIBELOE_VERMOUTH;
var init_krasnoeibeloe_vermouth = __esm({
  "client/src/lib/krasnoeibeloe-vermouth.ts"() {
    "use strict";
    KRASNOEIBELOE_VERMOUTH = [
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0432\u0438\u043D\u043E\u0433\u0440\u0430\u0434\u043E\u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0449\u0438\u0439 \u041C\u0430\u0440\u0442\u0438\u043D\u0438 \u0411\u044C\u044F\u043D\u043A\u043E \u0431\u0435\u043B\u044B\u0439 \u0441\u043B\u0430\u0434\u043A\u0438\u0439 0.5\u043B", category: "alcohol", subtype: "\u0412\u0435\u0440\u043C\u0443\u0442", color: "#FFFACD", abv: 15, pricePerLiter: 1e3, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vermut/napitok_aromatizirovannyy_vinogradosoderzhashchiy_martini_byanko_belyy_sladkiy_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0432\u0438\u043D\u043E\u0433\u0440\u0430\u0434\u043E\u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0449\u0438\u0439 \u041C\u0430\u0440\u0442\u0438\u043D\u0438 \u0424\u0438\u0435\u0440\u043E \u0441\u043B\u0430\u0434\u043A\u0438\u0439 0.5\u043B", category: "alcohol", subtype: "\u0412\u0435\u0440\u043C\u0443\u0442", color: "#FF6347", abv: 14.9, pricePerLiter: 1e3, volume: 500, tasteProfile: { sweet: 7, sour: 1, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vermut/napitok_aromatizirovannyy_vinogradosoderzhashchiy_martini_fiero_sladkiy_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0432\u0438\u043D\u043E\u0433\u0440\u0430\u0434\u043E\u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0449\u0438\u0439 \u041C\u0430\u0440\u0442\u0438\u043D\u0438 \u0424\u0438\u0435\u0440\u043E \u0441\u043B\u0430\u0434\u043A\u0438\u0439 0.75\u043B", category: "alcohol", subtype: "\u0412\u0435\u0440\u043C\u0443\u0442", color: "#FF6347", abv: 14.9, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 7, sour: 1, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vermut/napitok_aromatizirovannyy_vinogradosoderzhashchiy_martini_fiero_sladkiy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0432\u0438\u043D\u043E\u0433\u0440\u0430\u0434\u043E\u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0449\u0438\u0439 \u041C\u0430\u0440\u0442\u0438\u043D\u0438 \u0411\u044C\u044F\u043D\u043A\u043E \u0431\u0435\u043B\u044B\u0439 \u0441\u043B\u0430\u0434\u043A\u0438\u0439 0.75\u043B", category: "alcohol", subtype: "\u0412\u0435\u0440\u043C\u0443\u0442", color: "#FFFACD", abv: 15, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 7, sour: 1, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vermut/napitok_aromatizirovannyy_vinogradosoderzhashchiy_martini_byanko_belyy_sladkiy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0431\u043E\u0440 \u041C\u0430\u0440\u0442\u0438\u043D\u0438 \u0424\u0438\u0435\u0440\u043E + 2 \u0431\u0430\u043D\u043A\u0438 \u0442\u043E\u043D\u0438\u043A\u0430", category: "alcohol", subtype: "\u0412\u0435\u0440\u043C\u0443\u0442", color: "#FF6347", abv: 14.9, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 7, sour: 1, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vermut/nabor_iz_1_but_arom_nap_martini_fiero_i_2ban_s_pelleg_0_33l_p_u_italiya/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u0431\u043E\u0440 \u041C\u0430\u0440\u0442\u0438\u043D\u0438 \u0411\u044C\u044F\u043D\u043A\u043E + 2 \u0431\u0430\u043D\u043A\u0438 \u0442\u043E\u043D\u0438\u043A\u0430", category: "alcohol", subtype: "\u0412\u0435\u0440\u043C\u0443\u0442", color: "#FFFACD", abv: 15, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 7, sour: 1, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vermut/nabor_martini_byanko_2_banki_tonika/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A \u0432\u0438\u043D\u043E\u0433\u0440\u0430\u0434\u043E\u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0449\u0438\u0439 \u041C\u0430\u0440\u0442\u0438\u043D\u0438 \u042D\u043A\u0441\u0442\u0440\u0430 \u0414\u0440\u0430\u0439 \u0431\u0435\u043B\u044B\u0439 \u0441\u0443\u0445\u043E\u0439", category: "alcohol", subtype: "\u0412\u0435\u0440\u043C\u0443\u0442", color: "#FFFACD", abv: 18, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 1, sour: 2, bitter: 4, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vermut/napitok_aromatizirovannyy_vinogradosoderzhashchiy_martini_ekstra_dray_belyy_sukhoy/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u041F\u043B\u043E\u0434\u043E\u0432\u044B\u0439 \u043D\u0430\u043F\u0438\u0442\u043E\u043A \u0430\u0440\u043E\u043C\u0430\u0442\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0412\u0435\u0440\u043C\u0443\u0442 \u0427\u0435\u0430\u0440\u043E \u043A\u0432\u043E\u043D\u0442\u0438 \u0411\u044C\u044F\u043D\u043A\u043E", category: "alcohol", subtype: "\u0412\u0435\u0440\u043C\u0443\u0442", color: "#FFFACD", abv: 18.5, pricePerLiter: 400, volume: 1e3, tasteProfile: { sweet: 6, sour: 1, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino_igristoe_shampanskoe/vermut/plodovyy_alkogolnyy_napitok_aromatizirovannyy_vermut_chearo_kvonti_byanko/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-wine-red.ts
var KRASNOEIBELOE_WINE_RED;
var init_krasnoeibeloe_wine_red = __esm({
  "client/src/lib/krasnoeibeloe-wine-red.ts"() {
    "use strict";
    KRASNOEIBELOE_WINE_RED = [
      // Страница 1
      { name: "\u0412\u0438\u043D\u043E \u041A\u044C\u044F\u043D\u0442\u0438 \u0420\u0438\u0437\u0435\u0440\u0432\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 13, pricePerLiter: 1467, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kyanti_rizerva_kr_p_sukh/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u043E\u044D\u043B\u044C\u043E \u0411\u0440\u0430\u043D\u043A\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 1067, volume: 375, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_koelo_branko_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0440\u0438\u0441\u0442\u0430 \u041F\u0438\u043D\u043E\u0442\u0430\u0436 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 1427, volume: 750, tasteProfile: { sweet: 1, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_barista_pinotazh_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0422\u0435\u043D\u0443\u0442\u0435 \u0414\u0435\u043B\u044C \u041D\u0435\u0447\u0447\u0438\u043E \u041A\u044C\u044F\u043D\u0442\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 13, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_tenute_del_nechchio_kyanti_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u043B\u043C\u0435\u0434\u0430 \u041A\u0430\u0431\u0435\u0440\u043D\u0435 \u0424\u0440\u0430\u043D \u041A\u0430\u0440\u043C\u0435\u043D\u0435\u0440 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kalmeda_kaberne_fran_karmener_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0441\u0442\u0438\u043B\u044C\u043E \u041A\u0430\u043C\u043F\u043E\u0441\u0435\u043A\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 11, pricePerLiter: 400, volume: 750, tasteProfile: { sweet: 1, sour: 3, bitter: 2, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kastilo_kamposeko_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0443\u0443\u043C\u0431\u0430 \u041F\u0438\u043D\u043E\u0442\u0430\u0436 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 787, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kuumba_pinotazh_krasnoe_polusukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0441\u0442\u0438\u043B\u044C\u043E \u0418\u043D\u0444\u0430\u043D\u0442\u0435 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 10.5, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 5, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kastilo_infante_krasnoe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0420\u0438\u043E \u0420\u0438\u043A\u0430 \u0420\u0435\u0434 \u0411\u043B\u0435\u043D\u0434 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 12.5, pricePerLiter: 613, volume: 750, tasteProfile: { sweet: 5, sour: 2, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_rio_rika_red_blend_krasnoe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0410\u043D\u0434\u0435\u0441 \u0410\u0443\u0440\u0430 \u0427\u0438\u043B\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 12.5, pricePerLiter: 500, volume: 1e3, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_andes_aura_chili_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0421\u043E\u043B \u0434\u0435 \u041F\u043B\u0430\u0442\u0430 \u041C\u0430\u043B\u044C\u0431\u0435\u043A \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 787, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_sol_de_plata_malbek_krasnoe_sukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0444\u0435\u0442\u0435\u0440\u0438\u044F \u042F\u0432\u0430 \u041F\u0438\u043D\u043E\u0442\u0430\u0436 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kafeteriya_yava_kofe_pinotazh_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0410\u043D\u0438\u043C\u0430\u043B\u0438\u044F \u0411\u043B\u0435\u043D\u0434 \u0420\u0435\u0434 \u0411\u043B\u0435\u043D\u0434 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 667, volume: 750, tasteProfile: { sweet: 1, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_animaliya_blend_red_blend_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0440\u0440\u0435\u043B\u0430\u044F \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 13.5, pricePerLiter: 1333, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_barrelaya_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0424\u0438\u043D\u043A\u0430 \u044D\u043B\u044C \u041E\u0440\u0438\u0434\u0436\u0435\u043D \u0420\u0435\u0437\u0435\u0440\u0432\u0430 \u041C\u0430\u043B\u044C\u0431\u0435\u043A \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 15, pricePerLiter: 1333, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_malbek_rezerva_finka_el_orikhen_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041F\u0435\u0442\u0440\u0430 \u0434\u0435 \u043B\u043E\u0441 \u0410\u043D\u0434\u0435\u0441 \u0417\u0438\u043D\u0444\u0430\u043D\u0434\u0435\u043B\u044C \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 14.5, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_petra_de_los_andes_zinfandel_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u043E\u043C\u044C\u0435\u043D\u0441\u043E \u041A\u0430\u0431\u0435\u0440\u043D\u0435 \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kaberne_sovinon_komientso_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0444\u0435\u0442\u0435\u0440\u0438\u044F \u041C\u043E\u043A\u0430 \u041F\u0438\u043D\u043E\u0442\u0430\u0436 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 14, pricePerLiter: 1133, volume: 750, tasteProfile: { sweet: 1, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kafeteriya_moka_pinotazh_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0423\u043B\u044C\u0442\u0438\u043C\u043E \u0411\u0430\u0441\u0442\u0438\u043E\u043D \u0411\u043E\u0431\u0430\u043B\u044C \u0413\u0430\u0440\u043D\u0430\u0447\u0430 \u041A\u0440\u0438\u0430\u043D\u0446\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 12.5, pricePerLiter: 667, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_ultimo_bastion_kriantsa_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0423\u043D\u0438\u0432\u0435\u0440\u0441\u0430\u043B\u0435 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_universale_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041F.\u0412.\u0421.& \u0411 \u0421\u0442\u0435\u043B\u0430\u0440\u0438\u0441 \u041C\u0435\u0440\u043B\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 1, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_p_v_s_b_stelaris_merlo_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0424\u043E\u0440\u0442\u0435\u0446\u0446\u0430 \u0414\u0435\u0438 \u041A\u043E\u043B\u043B\u0438 \u041F\u0440\u0438\u043C\u0438\u0442\u0438\u0432\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_fortetstsa_dei_kolli_primitivo_krasnoe_polusukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0424\u043E\u0440\u0442\u0435\u0446\u0446\u0430 \u0434\u0435\u0438 \u041A\u043E\u043B\u043B\u0438 \u041D\u0435\u0433\u0440\u043E\u0430\u043C\u0430\u0440\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 1e3, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_fortetstsa_dei_kolli_negroamaro_krasnoe_polusukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0412\u0438\u043B\u043B\u0430\u043A\u044C\u044F\u0440\u0430 \u041D\u0435\u0440\u043E \u0414`\u0410\u0432\u043E\u043B\u0430 \u0421\u0438\u0446\u0438\u043B\u0438\u044F \u0414\u041E\u041F \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_villakyara_nero_d_avola_sitsiliya_dop_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      // Страница 2
      { name: "\u0412\u0438\u043D\u043E \u041F\u0440\u0438\u043C\u043E \u0424\u0438\u043E\u0440\u0435 \u0423\u0432\u0430 \u041B\u043E\u043D\u0433\u0430\u043D\u0435\u0437\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_primofiore_uva_longanezi_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u042D\u043F\u0438\u043A\u0443\u0440\u043E \u041F\u0440\u0438\u043C\u0438\u0442\u0438\u0432\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 14, pricePerLiter: 1267, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_epikuro_primitivo_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0417\u0438\u0431\u0435\u043D\u0448\u0442\u0435\u0439\u043D \u041F\u0438\u043D\u043E \u041D\u0443\u0430\u0440 \u041F\u0444\u0430\u043B\u044C\u0446 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 12.5, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_pino_nuar_less_zibenshtayn_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0442\u0443\u043D\u0430 \u041A\u0430\u0431\u0435\u0440\u043D\u0435 \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D \u0428\u0438\u0440\u0430\u0437 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_katuna_kaberne_sovinon_shiraz_krasnoe_polusukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0438\u043D\u0434\u0437\u043C\u0430\u0440\u0430\u0443\u043B\u0438 \u041C\u0438\u0434\u0430\u043C\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 11.5, pricePerLiter: 707, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kindzmarauli_krasnoe_polusladkoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041F\u0430\u0442\u0440\u0438\u0430 \u0427\u0438\u043A\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 14.5, pricePerLiter: 1867, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_patria_chika_krasnoe_sukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E Alaverdi \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u043E\u0440\u0434\u0438\u043D\u0430\u0440\u043D\u043E\u0435 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 12.5, pricePerLiter: 600, volume: 750, tasteProfile: { sweet: 5, sour: 2, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_alaverdi_alazanskaya_dolina_ordinarnoe_krasnoe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E Alaverdi \u041A\u0438\u043D\u0434\u0437\u043C\u0430\u0440\u0430\u0443\u043B\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 11.5, pricePerLiter: 787, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_alaverdi_kindzmarauli_krasnoe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E Alaverdi \u0421\u0430\u043F\u0435\u0440\u0430\u0432\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 12.5, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_alaverdi_saperavi_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E Chateau Manavi \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 11.5, pricePerLiter: 627, volume: 750, tasteProfile: { sweet: 5, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_chateau_manavi_alazanskaya_dolina_krasnoe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E Chateau Manavi \u041A\u0438\u043D\u0434\u0437\u043C\u0430\u0440\u0430\u0443\u043B\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 11.5, pricePerLiter: 760, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_chateau_manavi_kindzmarauli_krasnoe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E Chateau Manavi \u041F\u0438\u0440\u043E\u0441\u043C\u0430\u043D\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 11.5, pricePerLiter: 653, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_chateau_manavi_pirosmani_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E Chateau Manavi \u0421\u0430\u043F\u0435\u0440\u0430\u0432\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 12, pricePerLiter: 667, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_chateau_manavi_saperavi_krasnoe_sukhoe_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0410\u043D\u0430 \u043B\u0430 \u041F\u0440\u043E\u043F\u0443\u044D\u0441\u0442\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 760, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_ana_la_propuesta_kr_sukh/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0434\u0430\u0433\u043E\u043D\u0438 \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 10.5, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 5, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_alazanskaya_dolina_badagoni_krasnoe_polusladkoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0434\u0430\u0433\u043E\u043D\u0438 \u041A\u0430\u0445\u0435\u0442\u0438\u0430\u043D \u041D\u043E\u0431\u043B \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_badagoni_kakhetian_nobl_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0434\u0430\u0433\u043E\u043D\u0438 \u041A\u0438\u043D\u0434\u0437\u043C\u0430\u0440\u0430\u0443\u043B\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 11, pricePerLiter: 1e3, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kindzmarauli_badagoni_krasnoe_polusladkoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0434\u0430\u0433\u043E\u043D\u0438 \u041C\u0443\u043A\u0443\u0437\u0430\u043D\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_mukuzani_badagoni_krasnoe_sukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0434\u0430\u0433\u043E\u043D\u0438 \u0421\u0430\u043F\u0435\u0440\u0430\u0432\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 933, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_saperavi_badagoni_krasnoe_sukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0434\u0430\u0433\u043E\u043D\u0438 \u0425\u0432\u0430\u043D\u0447\u043A\u0430\u0440\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 11, pricePerLiter: 2e3, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_khvanchkara_badagoni_krasnoe_polusladkoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0441\u0442\u0438\u043E\u043D\u0438 \u0434\u0435\u043B\u043B\u0430 \u0420\u043E\u043A\u043A\u0430 \u041F\u0440\u0438\u043C\u0438\u0442\u0438\u0432\u043E \u0434\u0438 \u041C\u0430\u043D\u0434\u0443\u0440\u0438\u044F \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 14.5, pricePerLiter: 1333, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_bastioni_della_rokka_primitivo_di_manduriya_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u043E\u0434\u0435\u0433\u0435\u0440\u043E \u041A\u0440\u0438\u0430\u043D\u0446\u0430 \u0420\u0438\u043E\u0445\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 13, pricePerLiter: 1160, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_bodegero_kriantsa_riokha_krasnoe_sukhoe_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u043E\u0434\u0435\u0433\u0435\u0440\u043E \u0422\u0435\u043C\u043F\u0440\u0430\u043D\u0438\u043B\u044C\u043E \u0420\u0438\u043E\u0445\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 13, pricePerLiter: 1e3, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_bodegero_tempranilo_riokha_krasnoe_sukhoe_/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u044C\u0435\u043D\u0432\u0435\u043D\u0438\u0434\u043E \u0421\u0438\u0440\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_benvenido_sira_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      // Страница 3
      { name: "\u0412\u0438\u043D\u043E \u0412\u0435\u0433\u0430 \u041C\u043E\u0440\u0430\u0433\u043E\u043D\u0430 \u0422\u0440\u0430\u0434\u0438\u0441\u044C\u043E\u043D \u0428\u0438\u0440\u0430\u0437 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 14.5, pricePerLiter: 1293, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_vega_moragona_tradison_shiraz_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0412\u0438\u043D\u044C\u044F \u041B\u0430\u0441\u0442\u0440\u0430 \u0421\u0435\u043B\u0435\u043A\u0442\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 14, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_vinya_lastra_selekto_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0412\u0438\u0441\u043F\u0435\u0440\u0438\u043D \u041F\u0430\u0439\u043D\u0441 \u041F\u0438\u043D\u043E \u041D\u0443\u0430\u0440 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 12.5, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_visperin_payns_pino_nuar_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0412\u0443\u043B\u043A\u0430\u043D\u0438 \u0414`\u0418\u0442\u0430\u043B\u0438\u044F \u042D\u0442\u043D\u0430 \u0420\u043E\u0441\u0441\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 2133, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_vulkani_d_italiya_etna_rosso_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0413\u0443\u0440\u0435\u043C\u0430\u043D\u0438 \u0425\u0432\u0430\u043D\u0447\u043A\u0430\u0440\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 11.5, pricePerLiter: 1333, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_guremani_khvanchkara_krasnoe_polusladkoe_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0414\u0421 \u041E \u0420\u0435\u0437\u0435\u0440\u0432\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 1133, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_ds_o_rezerva_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0417\u0443\u0430\u0437\u043E \u0413\u0430\u0441\u0442\u043E\u043D \u0420\u0435\u0437\u0435\u0440\u0432\u0430 \u0420\u0438\u043E\u0445\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 14, pricePerLiter: 1333, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_zuazo_gaston_rezerva_riokha_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u043D\u0438\u043E \u0410\u043B\u044C\u044F\u043D\u0438\u043A\u043E \u0434\u0435\u043B\u044C \u0412\u0443\u043B\u044C\u0442\u0443\u0440\u0435 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 1533, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kanio_alyaniko_del_vulture_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0445\u0443\u0440\u0438 \u0413\u0432\u0438\u043D\u0438\u0441 \u041C\u0430\u0440\u0430\u043D\u0438 \u041A\u0438\u043D\u0434\u0437\u043C\u0430\u0440\u0430\u0443\u043B\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 12, pricePerLiter: 667, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kakhuri_kindzmarauli_krasnoe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0445\u0443\u0440\u0438 \u0413\u0432\u0438\u043D\u0438\u0441 \u041C\u0430\u0440\u0430\u043D\u0438 \u041C\u0443\u043A\u0443\u0437\u0430\u043D\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 12.5, pricePerLiter: 532, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_mukuzani_kakhuri_gvinis_marani_krasnoe_sukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0445\u0443\u0440\u0438 \u0413\u0432\u0438\u043D\u0438\u0441 \u041C\u0430\u0440\u0430\u043D\u0438 \u041F\u0438\u0440\u043E\u0441\u043C\u0430\u043D\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 12, pricePerLiter: 532, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_pirosmani_kakhuri_gvinis_marani_krasnoe_polusukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0445\u0443\u0440\u0438 \u0413\u0432\u0438\u043D\u0438\u0441 \u041C\u0430\u0440\u0430\u043D\u0438 \u0421\u0430\u043F\u0435\u0440\u0430\u0432\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 12, pricePerLiter: 527, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kakhuri_gvinis_marani_saperavi_krasnoe_sukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0438\u043D\u0434\u0437\u043C\u0430\u0440\u0430\u0443\u043B\u0438 \u0428\u0430\u043B\u0432\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 12, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kindzmarauli_krasnoe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0430\u0440\u0438\u044F \u0424\u0430\u0434\u0438\u0448\u0442\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 14, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_mariya_fadista_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0430\u0440\u043A\u0435\u0441 \u0434\u0435 \u0422\u043E\u043C\u0430\u0440\u0435\u0441 \u041A\u0440\u0438\u0430\u043D\u0446\u0430 \u0420\u0438\u043E\u0445\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 14, pricePerLiter: 1600, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_markes_de_tomares_kriantsa_riokha_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0430\u0440\u0441\u0435\u043B\u0430\u043D \u0410\u0440\u0438\u0434\u043E\u0441 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 12.5, pricePerLiter: 933, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_marselan_aridos_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0435\u043D\u0442\u043E\u0440 \u0420\u0435\u0437\u0435\u0440\u0432\u0430 \u0414\u043E\u0440\u0443 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 1267, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_mentor_rezerva_doru_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u043E\u043D\u0442\u0430\u043D\u0438 \u041A\u0430\u0431\u0435\u0440\u043D\u0435 \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D \u041C\u0435\u0440\u043B\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 14, pricePerLiter: 1733, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_diletto_kaberne_sovinon_merlo_vallezelle_krasnoe_sukhoe_0_75/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0443\u0437\u0430\u0440\u0430\u0434\u0438 \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 12, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 5, sour: 2, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_alazanskaya_dolina_krasnoe_polusladkoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0443\u0437\u0430\u0440\u0430\u0434\u0438 \u041A\u0438\u043D\u0434\u0437\u043C\u0430\u0440\u0430\u0443\u043B\u0438 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 11.5, pricePerLiter: 667, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kindzmarauli_krasnoe_polusladkoe_2/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041F\u044C\u0435\u0442\u0440\u0430\u043C\u0435 \u041C\u043E\u043D\u0442\u0435\u043F\u0443\u043B\u044C\u0447\u0430\u043D\u043E \u0414`\u0410\u0431\u0440\u0443\u0446\u0446\u043E \u042D\u0434\u0438\u0446\u0438\u043E\u043D\u0435 \u041B\u0438\u043C\u0438\u0442\u0430\u0442\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 933, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_petrame_montepulchano_d_abrutstso_editsione_limitata_krasnoe_polusukhoe_1/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0421\u0430\u043D \u043E\u0444 \u0410\u0444\u0440\u0438\u043A\u0430 \u0421\u0435\u043D\u0441\u043E \u041F\u0438\u043D\u043E\u0442\u0430\u0436 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13, pricePerLiter: 600, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_san_of_afrika_senso_pinotazh_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0421\u0435\u043D\u0434\u0435\u0440\u043E \u0434\u0435 \u041C\u043E\u043D\u0442\u0430\u043D\u0430 \u0411\u043E\u043D\u0430\u0440\u0434\u0430 \u0410\u0440\u0433\u0435\u043D\u0442\u0438\u043D\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 12.5, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 1, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_sendero_de_montana_bonarda_argentina_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0421\u0435\u043D\u0446\u0430 \u0422\u0435\u043C\u043F\u043E \u0420\u0438\u0437\u0435\u0440\u0432\u0430 \u041C\u043E\u043D\u0442\u0435\u043F\u0443\u043B\u044C\u0447\u0430\u043D\u043E \u0414`\u0410\u0431\u0440\u0443\u0446\u0446\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 1733, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_sentsa_tempo_rizerva_montepulchano_d_abrutstso_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      // Страница 4
      { name: "\u0412\u0438\u043D\u043E \u0422\u0430\u0433\u0430\u0440\u043E \u0421\u0435\u0439\u043A\u0430\u0437\u0435\u043B\u043B\u0435 \u041D\u0435\u0433\u0440\u043E\u0430\u043C\u0430\u0440\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 14, pricePerLiter: 1867, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_tagaro_seykazelle_negroamaro_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0422\u0430\u0439\u043C \u041B\u0430\u043F\u0441 \u041A\u0430\u0431\u0435\u0440\u043D\u0435 \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D \u041D\u0430\u0432\u0430\u0440\u0440\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_taym_laps_kaberne_sovinon_navarra_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0422\u0435\u043D\u0443\u0442\u0430 \u0423\u043B\u0438\u0441\u0441\u0435 \u041C\u043E\u043D\u0442\u0435\u043F\u0443\u043B\u044C\u0447\u0430\u043D\u043E \u0434`\u0410\u0431\u0440\u0443\u0446\u0446\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 14, pricePerLiter: 2133, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_tenuta_ulisse_montepulchano_d_abrutstso_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0422\u0435\u0440\u0440\u0435\u0441\u043A\u0443\u0440\u0435 \u041B\u043E\u0442\u0442\u043E \u0423\u043D\u0438\u043A\u043E \u0420\u043E\u0441\u0441\u043E \u0422\u043E\u0441\u043A\u0430\u043D\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 14, pricePerLiter: 2133, volume: 750, tasteProfile: { sweet: 2, sour: 3, bitter: 2, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_terreskure_lotto_yuniko_rosso_toskana_krasnoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0425\u0432\u0430\u043D\u0447\u043A\u0430\u0440\u0430 \u0428\u0430\u043B\u0432\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#8B0000", abv: 11.5, pricePerLiter: 1467, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_khvanchkara_krasnoe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0428\u0430\u0442\u043E \u041F\u043E\u0440\u0442\u0430\u043B\u044C \u041C\u0438\u043D\u0435\u0440\u0432\u0443\u0430 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 15, pricePerLiter: 1467, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 4 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_shato_portal_minervua_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u042D\u043B\u043B\u0438\u0441 \u041A\u0443\u043F\u0435\u0440 \u0428\u0438\u0440\u0430\u0437 \u043A\u0440\u0430\u0441\u043D\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", color: "#722F37", abv: 13.5, pricePerLiter: 1733, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 3, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_ellis_kuper_shiraz_krasnoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-wine-white.ts
var KRASNOEIBELOE_WINE_WHITE;
var init_krasnoeibeloe_wine_white = __esm({
  "client/src/lib/krasnoeibeloe-wine-white.ts"() {
    "use strict";
    KRASNOEIBELOE_WINE_WHITE = [
      // Страница 1
      { name: "\u0412\u0438\u043D\u043E \u041A\u043E\u044D\u043B\u044C\u043E \u0411\u0440\u0430\u043D\u043A\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 1067, volume: 375, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_koelo_branko_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0422\u0435\u043D\u0443\u0442\u0435 \u0420\u043E\u0441\u0441\u0435\u0442\u0442\u0438 \u041F\u0438\u043D\u043E \u0413\u0440\u0438\u0434\u0436\u0438\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_tenute_rossetti_pino_gridzhio_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0440\u0438\u0437\u0430 \u0434\u0443 \u041C\u0430\u0440 \u0412\u0438\u043D\u044C\u044E \u0412\u0435\u0440\u0434\u0435 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 10, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 2, sour: 5, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_briza_du_mar_vinyu_verde_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0430\u0440\u0435 \u0410\u043B\u044C\u0442\u0430 \u0412\u0438\u043D\u044C\u044E \u0412\u0435\u0440\u0434\u0435 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 10, pricePerLiter: 960, volume: 750, tasteProfile: { sweet: 2, sour: 5, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_mare_alta_vinyu_verde_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041F\u0430\u043A\u043E \u0438 \u041B\u043E\u043B\u0430 \u0410\u043B\u0431\u0430\u0440\u0438\u043D\u044C\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1733, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_pako_i_lola_albarinyo_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0420\u0438\u043E \u0420\u0438\u043A\u0430 \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u041B\u0430 \u041C\u0430\u043D\u0447\u0430 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11.5, pricePerLiter: 613, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_rio_rika_shardone_la_mancha_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0420\u0438\u043E \u0420\u0438\u043A\u0430 \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D \u0411\u043B\u0430\u043D \u041B\u0430 \u041C\u0430\u043D\u0447\u0430 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_rio_rika_sovinon_blan_la_mancha_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0410\u043D\u0434\u0435\u0441 \u0410\u0443\u0440\u0430 \u0427\u0438\u043B\u0438 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 500, volume: 1e3, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_andes_aura_chili_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0421\u043E\u043B \u0434\u0435 \u041F\u043B\u0430\u0442\u0430 \u0422\u043E\u0440\u0440\u043E\u043D\u0442\u0435\u0441 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 787, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_sol_de_plata_torrontes_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u043E\u043C\u044C\u0435\u043D\u0441\u043E \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u041F\u0435\u043D\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_komientso_shardone_peno_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041F.\u0412.\u0421.& \u0411 \u0421\u0442\u0435\u043B\u0430\u0440\u0438\u0441 \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_p_v_s_b_stelaris_shardone_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u043B\u043C\u0435\u0434\u0430 \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D \u0411\u043B\u0430\u043D \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 1, sour: 5, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kalmeda_sovinon_blan_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0441\u0442\u0438\u043B\u044C\u043E \u041A\u0430\u043C\u043F\u043E\u0441\u0435\u043A\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11, pricePerLiter: 400, volume: 750, tasteProfile: { sweet: 1, sour: 3, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kastilo_kamposeko_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0441\u0442\u0438\u043B\u044C\u043E \u0418\u043D\u0444\u0430\u043D\u0442\u0435 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 10.5, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kastilo_infante_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0442\u0443\u043D\u0430 \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u041A\u043E\u043B\u043E\u043C\u0431\u0430\u0440 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_katuna_shardone_kolombar_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0443\u0443\u043C\u0431\u0430 \u0428\u0435\u043D\u0435\u043D \u0411\u043B\u0430\u043D \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 787, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kuumba_shenen_blan_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0410\u043D\u0438\u043C\u0430\u043B\u0438\u044F \u0411\u043B\u0435\u043D\u0434 \u0428\u0435\u043D\u0435\u043D \u0411\u043B\u0430\u043D \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 667, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_animaliya_blend_shenen_blan_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0424\u0438\u043D\u043A\u0430 \u044D\u043B\u044C \u041E\u0440\u0438\u0434\u0436\u0435\u043D \u0422\u043E\u0440\u0440\u043E\u043D\u0442\u0435\u0441 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13.5, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_finka_el_orikhen_torrontes_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0423\u043B\u044C\u0442\u0438\u043C\u043E \u0411\u0430\u0441\u0442\u0438\u043E\u043D \u0411\u043B\u0430\u043D\u043A\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_ultimo_bastion_blanko_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0412\u0438\u0441\u043F\u0435\u0440\u0438\u043D \u041F\u0430\u0439\u043D\u0441 \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D \u0411\u043B\u0430\u043D \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 1, sour: 5, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_visperin_payns_sovinon_blan_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0417\u0438\u0431\u0435\u043D\u0448\u0442\u0435\u0439\u043D \u0420\u0438\u0441\u043B\u0438\u043D\u0433 \u041F\u0444\u0430\u043B\u044C\u0446 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11.5, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 2, sour: 5, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_risling_less_zibenshtayn_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0423\u043D\u0438\u0432\u0435\u0440\u0441\u0430\u043B\u0435 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_universale_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0412\u0438\u043B\u043B\u0430\u043A\u044C\u044F\u0440\u0430 \u0413\u0440\u0438\u043B\u043B\u043E \u0421\u0438\u0446\u0438\u043B\u0438\u044F \u0414\u041E\u041F \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_villakyara_grilo_sitsiliya_dop_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0424\u043E\u0440\u0442\u0435\u0446\u0446\u0430 \u0434\u0435\u0438 \u041A\u043E\u043B\u043B\u0438 \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1e3, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_fortetstsa_dei_kolli_shardone_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      // Страница 2
      { name: "\u0412\u0438\u043D\u043E \u042D\u043F\u0438\u043A\u0443\u0440\u043E \u041F\u0435\u043A\u043E\u0440\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 1267, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_epikuro_pekorino_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E Alaverdi \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u043E\u0440\u0434\u0438\u043D\u0430\u0440\u043D\u043E\u0435 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 600, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_alaverdi_alazanskaya_dolina_ordinarnoe_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E Alaverdi \u0426\u0438\u043D\u0430\u043D\u0434\u0430\u043B\u0438 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 787, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_alaverdi_tsinandali_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E Chateau Manavi \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11.5, pricePerLiter: 627, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_chateau_manavi_alazanskaya_dolina_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E Chateau Manavi \u0426\u0438\u043D\u0430\u043D\u0434\u0430\u043B\u0438 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_chateau_manavi_tsinandali_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0434\u0430\u0433\u043E\u043D\u0438 \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 10.5, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_alazanskaya_dolina_badagoni_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0434\u0430\u0433\u043E\u043D\u0438 \u0426\u0438\u043D\u0430\u043D\u0434\u0430\u043B\u0438 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1e3, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_tsinandali_badagoni_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0430\u0434\u0430\u0433\u043E\u043D\u0438 \u0422\u0432\u0438\u0448\u0438 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_tvishi_badagoni_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u043E\u0434\u0435\u0433\u0435\u0440\u043E \u0412\u0438\u0443\u0440\u0430 \u0420\u0438\u043E\u0445\u0430 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1e3, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_bodegero_viura_riokha_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u044C\u0435\u043D\u0432\u0435\u043D\u0438\u0434\u043E \u0412\u0435\u0440\u0434\u0435\u0445\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_benvenido_verdekho_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0412\u0435\u0433\u0430 \u041C\u043E\u0440\u0430\u0433\u043E\u043D\u0430 \u0422\u0440\u0430\u0434\u0438\u0441\u044C\u043E\u043D \u0412\u0435\u0440\u0434\u0435\u0445\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 1293, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_vega_moragona_tradison_verdekho_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0412\u0443\u043B\u043A\u0430\u043D\u0438 \u0414`\u0418\u0442\u0430\u043B\u0438\u044F \u042D\u0442\u043D\u0430 \u0411\u044C\u044F\u043D\u043A\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 2133, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_vulkani_d_italiya_etna_byanko_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0413\u0443\u0440\u0435\u043B\u0438 \u0422\u0432\u0438\u0448\u0438 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_gureli_tvishi_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0413\u0443\u0440\u0435\u043C\u0430\u043D\u0438 \u0422\u0432\u0438\u0448\u0438 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11, pricePerLiter: 1267, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_guremani_tvishi_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0414\u0421 \u041E \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D \u0411\u043B\u0430\u043D \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 1133, volume: 750, tasteProfile: { sweet: 1, sour: 5, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_ds_o_sovinon_blan_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0417\u0443\u0430\u0437\u043E \u0413\u0430\u0441\u0442\u043E\u043D \u0411\u043B\u0430\u043D\u043A\u043E \u0420\u0438\u043E\u0445\u0430 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_zuazo_gaston_blanko_riokha_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0445\u0443\u0440\u0438 \u0413\u0432\u0438\u043D\u0438\u0441 \u041C\u0430\u0440\u0430\u043D\u0438 \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11, pricePerLiter: 453, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kakhuri_gvinis_marani_alazanskaya_dolina_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0445\u0443\u0440\u0438 \u0413\u0432\u0438\u043D\u0438\u0441 \u041C\u0430\u0440\u0430\u043D\u0438 \u0426\u0438\u043D\u0430\u043D\u0434\u0430\u043B\u0438 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 600, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kakhuri_gvinis_marani_tsinandali_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0430\u0440\u043A\u0435\u0441 \u0434\u0435 \u0422\u043E\u043C\u0430\u0440\u0435\u0441 \u0411\u043B\u0430\u043D\u043A\u043E \u0420\u0438\u043E\u0445\u0430 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_markes_de_tomares_blanko_riokha_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0443\u0437\u0430\u0440\u0430\u0434\u0438 \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_muzaradi_alazanskaya_dolina_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0443\u0437\u0430\u0440\u0430\u0434\u0438 \u0422\u0431\u0438\u043B\u0438\u0441\u0443\u0440\u0438 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11.5, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_muzaradi_tbilisuri_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041F\u0430\u0442\u0440\u0438\u0430 \u0427\u0438\u043A\u0430 \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D \u0411\u043B\u0430\u043D \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13.5, pricePerLiter: 1600, volume: 750, tasteProfile: { sweet: 1, sour: 5, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_patria_chika_sovinon_blan_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041F\u044C\u0435\u0442\u0440\u0430\u043C\u0435 \u041F\u0435\u043A\u043E\u0440\u0438\u043D\u043E \u0422\u0435\u0440\u0440\u0435 \u0434\u0438 \u041A\u044C\u0435\u0442\u0438 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 933, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_petrame_pekorino_terre_di_kieti_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0421\u0430\u043D \u043E\u0444 \u0410\u0444\u0440\u0438\u043A\u0430 \u041A\u0435\u0439\u043F \u0423\u0430\u0439\u0442 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 600, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_san_of_afrika_keyp_uayt_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      // Страница 3
      { name: "\u0412\u0438\u043D\u043E \u0421\u0435\u043D\u0446\u0430 \u0422\u0435\u043C\u043F\u043E \u0422\u0440\u0435\u0431\u0431\u044C\u044F\u043D\u043E \u0414`\u0410\u0431\u0440\u0443\u0446\u0446\u043E \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_sentsa_tempo_trebbyano_d_abrutstso_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0422\u0430\u0439\u043C \u041B\u0430\u043F\u0441 \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u041D\u0430\u0432\u0430\u0440\u0440\u0430 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_taym_laps_shardone_navarra_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0422\u0435\u043D\u0443\u0442\u0430 \u0423\u043B\u0438\u0441\u0441\u0435 \u0422\u0440\u0435\u0431\u0431\u044C\u044F\u043D\u043E \u0414`\u0410\u0431\u0440\u0443\u0446\u0446\u043E \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 2133, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_tenuta_ulisse_trebbyano_d_abrutstso_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0422\u0435\u0440\u0440\u0430 \u0422\u0430\u043D\u0430\u0433\u0440\u0430 \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D \u0411\u043B\u0430\u043D \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1467, volume: 750, tasteProfile: { sweet: 1, sour: 5, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_terra_tanagra_sovinon_blan_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0426\u0438\u043D\u0430\u043D\u0434\u0430\u043B\u0438 \u0428\u0430\u043B\u0432\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_tsinandali_shalvino_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0428\u0430\u0442\u043E \u041F\u043E\u0440\u0442\u0430\u043B\u044C \u041C\u0438\u043D\u0435\u0440\u0432\u0443\u0430 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13.5, pricePerLiter: 1467, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_shato_portal_minervua_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u042D\u043B\u043B\u0438\u0441 \u041A\u0443\u043F\u0435\u0440 \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 1733, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_ellis_kuper_shardone_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u043E\u043D\u0442\u0430\u043D\u0438 \u041F\u0438\u043D\u043E \u0413\u0440\u0438\u0434\u0436\u043E \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1733, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_montani_pino_gridzhio_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u043E\u043B\u043E\u043D\u0438\u0430\u043B\u0435 \u0413\u0430\u0432\u0438 DOCG \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1867, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_koloniale_gavi_docg_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0440\u043E\u0434\u043B\u0438\u0444 \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_brodlif_shardone_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041F\u0440\u0438\u043C\u043E \u0424\u0438\u043E\u0440\u0435 \u041F\u0438\u043D\u043E \u0413\u0440\u0438\u0434\u0436\u0438\u043E \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_primofiore_pino_gridzhio_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0421\u0435\u043D\u0434\u0435\u0440\u043E \u0434\u0435 \u041C\u043E\u043D\u0442\u0430\u043D\u0430 \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u0410\u0440\u0433\u0435\u043D\u0442\u0438\u043D\u0430 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_sendero_de_montana_shardone_argentina_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0410\u043D\u0430 \u043B\u0430 \u041F\u0440\u043E\u043F\u0443\u044D\u0441\u0442\u0430 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 760, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_ana_la_propuesta_bel_sukh/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0430\u0440\u0438\u044F \u0424\u0430\u0434\u0438\u0448\u0442\u0430 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_mariya_fadista_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0435\u043D\u0442\u043E\u0440 \u0420\u0435\u0437\u0435\u0440\u0432\u0430 \u0414\u043E\u0440\u0443 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 1267, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_mentor_rezerva_doru_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0412\u0438\u043D\u044C\u044F \u041B\u0430\u0441\u0442\u0440\u0430 \u0421\u0435\u043B\u0435\u043A\u0442\u043E \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 800, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_vinya_lastra_selekto_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0422\u0432\u0438\u0448\u0438 \u0428\u0430\u043B\u0432\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_tvishi_shalvino_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0443\u0437\u0430\u0440\u0430\u0434\u0438 \u0426\u0438\u043D\u0430\u043D\u0434\u0430\u043B\u0438 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 600, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_muzaradi_tsinandali_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0445\u0443\u0440\u0438 \u0413\u0432\u0438\u043D\u0438\u0441 \u041C\u0430\u0440\u0430\u043D\u0438 \u0422\u0432\u0438\u0448\u0438 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11.5, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kakhuri_gvinis_marani_tvishi_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0443\u0437\u0430\u0440\u0430\u0434\u0438 \u0422\u0432\u0438\u0448\u0438 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11.5, pricePerLiter: 667, volume: 750, tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_muzaradi_tvishi_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0413\u0443\u0440\u0435\u043B\u0438 \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11.5, pricePerLiter: 787, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_gureli_alazanskaya_dolina_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041F\u0435\u0442\u0440\u0430 \u0434\u0435 \u043B\u043E\u0441 \u0410\u043D\u0434\u0435\u0441 \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13.5, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_petra_de_los_andes_shardone_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0424\u0438\u043D\u043A\u0430 \u044D\u043B\u044C \u041E\u0440\u0438\u0434\u0436\u0435\u043D \u0420\u0435\u0437\u0435\u0440\u0432\u0430 \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 14.5, pricePerLiter: 1200, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_finka_el_orikhen_rezerva_shardone_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      // Страница 4
      { name: "\u0412\u0438\u043D\u043E \u0422\u0435\u0440\u0440\u0435\u0441\u043A\u0443\u0440\u0435 \u0412\u0435\u0440\u0434\u0438\u043A\u043A\u044C\u043E \u0414\u0435\u0438 \u041A\u0430\u0441\u0442\u0435\u043B\u043B\u0438 \u0434\u0438 \u0414\u0436\u0435\u0437\u0438 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 2133, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_terreskure_verdikkyo_dei_kastelli_di_dzhezi_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u043D\u0438\u043E \u0424\u0430\u043B\u0430\u043D\u0433\u0438\u043D\u0430 \u0411\u0435\u043D\u0435\u0432\u0435\u043D\u0442\u0430\u043D\u043E \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1533, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_kanio_falangina_beneventano_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0422\u0430\u0433\u0430\u0440\u043E \u0421\u0435\u0439\u043A\u0430\u0437\u0435\u043B\u043B\u0435 \u0428\u0430\u0440\u0434\u043E\u043D\u0435 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 13, pricePerLiter: 1867, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_tagaro_seykazelle_shardone_beloe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u0428\u0430\u043B\u0432\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_alazanskaya_dolina_shalvino_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0413\u0443\u0440\u0435\u043C\u0430\u043D\u0438 \u0410\u043B\u0430\u0437\u0430\u043D\u0441\u043A\u0430\u044F \u0414\u043E\u043B\u0438\u043D\u0430 \u0431\u0435\u043B\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 11.5, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_guremani_alazanskaya_dolina_beloe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0413\u0443\u0440\u0435\u043B\u0438 \u0426\u0438\u043D\u0430\u043D\u0434\u0430\u043B\u0438 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_gureli_tsinandali_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0413\u0443\u0440\u0435\u043C\u0430\u043D\u0438 \u0426\u0438\u043D\u0430\u043D\u0434\u0430\u043B\u0438 \u0431\u0435\u043B\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", color: "#F7E7CE", abv: 12.5, pricePerLiter: 1067, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_guremani_tsinandali_beloe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/krasnoeibeloe-wine-rose.ts
var KRASNOEIBELOE_WINE_ROSE;
var init_krasnoeibeloe_wine_rose = __esm({
  "client/src/lib/krasnoeibeloe-wine-rose.ts"() {
    "use strict";
    KRASNOEIBELOE_WINE_ROSE = [
      { name: "\u0412\u0438\u043D\u043E \u0411\u0440\u0438\u0437\u0430 \u0434\u0443 \u041C\u0430\u0440 \u0412\u0438\u043D\u044C\u044E \u0412\u0435\u0440\u0434\u0435 \u0440\u043E\u0437\u043E\u0432\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", color: "#FFB6C1", abv: 10, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_briza_du_mar_vinyu_verde_rozovoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0413\u0430\u043B\u0435\u043E\u043D\u0435 \u041F\u0440\u0438\u043C\u0438\u0442\u0438\u0432\u043E \u0421\u0430\u043B\u0435\u0442\u0442\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", color: "#FFB6C1", abv: 12.5, pricePerLiter: 1133, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_galeone_primitivo_salentino_rozovoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041C\u0430\u0440\u0435 \u0410\u043B\u044C\u0442\u0430 \u0412\u0438\u043D\u044C\u044E \u0412\u0435\u0440\u0434\u0435 \u0440\u043E\u0437\u043E\u0432\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", color: "#FFB6C1", abv: 10, pricePerLiter: 960, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_mare_alta_vinyu_verde_rozovoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0411\u0440\u043E\u0434\u043B\u0438\u0444 \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D \u0411\u043B\u0430\u043D \u0440\u043E\u0437\u043E\u0432\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", color: "#FFB6C1", abv: 12.5, pricePerLiter: 867, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_brodlif_sovinon_blan_rozovoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041A\u0430\u0442\u0443\u043D\u0430 \u0428\u0438\u0440\u0430\u0437 \u0440\u043E\u0437\u043E\u0432\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", color: "#FFB6C1", abv: 12.5, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_katuna_shiraz_rozovoe_polusukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u041F.\u0412.\u0421.& \u0411 \u0421\u0442\u0435\u043B\u0430\u0440\u0438\u0441 \u0420\u043E\u0437\u0435 \u0440\u043E\u0437\u043E\u0432\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", color: "#FFB6C1", abv: 12.5, pricePerLiter: 733, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_p_v_s_b_stelaris_roze_rozovoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0420\u0438\u043E \u0420\u0438\u043A\u0430 \u0420\u043E\u0437\u0435 \u041B\u0430 \u041C\u0430\u043D\u0447\u0430 \u0440\u043E\u0437\u043E\u0432\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", color: "#FFB6C1", abv: 10.5, pricePerLiter: 533, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 2 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_rio_rika_roze_la_mancha_rozovoe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0421\u0430\u043D \u043E\u0444 \u0410\u0444\u0440\u0438\u043A\u0430 \u041A\u0435\u0439\u043F \u0420\u043E\u0443\u0437 \u0440\u043E\u0437\u043E\u0432\u043E\u0435 \u043F\u043E\u043B\u0443\u0441\u043B\u0430\u0434\u043A\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", color: "#FFB6C1", abv: 12.5, pricePerLiter: 600, volume: 750, tasteProfile: { sweet: 5, sour: 3, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_san_of_afrika_keyp_rouz_rozovoe_polusladkoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" },
      { name: "\u0412\u0438\u043D\u043E \u0421\u043E\u043B \u0434\u0435 \u041F\u043B\u0430\u0442\u0430 \u041C\u0430\u043B\u044C\u0431\u0435\u043A \u0420\u043E\u0437\u0435 \u0440\u043E\u0437\u043E\u0432\u043E\u0435 \u0441\u0443\u0445\u043E\u0435", category: "alcohol", subtype: "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", color: "#FFB6C1", abv: 13, pricePerLiter: 787, volume: 750, tasteProfile: { sweet: 1, sour: 4, bitter: 1, alcohol: 3 }, unit: "ml", sourceUrl: "https://krasnoeibeloe.ru/catalog/vino/vino_sol_de_plata_malbek_roze_rozovoe_sukhoe/", sourceName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435&\u0411\u0435\u043B\u043E\u0435", sourceIcon: "https://krasnoeibeloe.ru/favicon.ico" }
    ];
  }
});

// client/src/lib/pyaterochka-energy-drinks.ts
var PYATEROCHKA_ENERGY_DRINKS;
var init_pyaterochka_energy_drinks = __esm({
  "client/src/lib/pyaterochka-energy-drinks.ts"() {
    "use strict";
    PYATEROCHKA_ENERGY_DRINKS = [
      // === RED BULL ===
      {
        name: "Red Bull 0.473\u043B",
        category: "energy_drink",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 666,
        volume: 473,
        tasteProfile: { sweet: 7, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-red-bull-0-473l--3173468/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1163118-main/320x320.jpeg?updated_at=2025-02-28T10:34:05.809Z"
      },
      {
        name: "Red Bull \u0431\u0435\u0437 \u0441\u0430\u0445\u0430\u0440\u0430 0.25\u043B",
        category: "energy_drink",
        color: "#87CEEB",
        abv: 0,
        pricePerLiter: 540,
        volume: 250,
        tasteProfile: { sweet: 3, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-red-bull-bez-sakhara-0-25l--2103012/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1160608-main/320x320.jpeg?updated_at=2025-02-28T10:34:05.826Z"
      },
      {
        name: "Red Bull 0.355\u043B",
        category: "energy_drink",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 701,
        volume: 355,
        tasteProfile: { sweet: 7, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-red-bull-bez-sakhara-0-25l--2103012/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1160825-main/320x320.jpeg?updated_at=2025-02-28T10:34:05.901Z"
      },
      {
        name: "Red Bull The Summer Edition \u0441\u043E \u0432\u043A\u0443\u0441\u043E\u043C \u0431\u0435\u043B\u043E\u0433\u043E \u043F\u0435\u0440\u0441\u0438\u043A\u0430 250\u043C\u043B",
        category: "energy_drink",
        color: "#FFDAB9",
        abv: 0,
        pricePerLiter: 556,
        volume: 250,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-red-bull-the-summer-editio--4400746/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/2025207-main/320x320.jpeg"
      },
      // === ADRENALINE ===
      {
        name: "Adrenaline Energy Power Game Fuel 0.449\u043B",
        category: "energy_drink",
        color: "#FF6347",
        abv: 0,
        pricePerLiter: 290,
        volume: 449,
        tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-adrenaline-energy-power-ga--3931839/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1194826-main/800x800.jpeg?updated_at=2025-08-21T17:24:57.826Z"
      },
      {
        name: "Adrenaline Rush 0.449\u043B",
        category: "energy_drink",
        color: "#FF4500",
        abv: 0,
        pricePerLiter: 287,
        volume: 449,
        tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-adrenaline-energy-power-ga--3931839/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1194826-main/320x320.jpeg?updated_at=2025-08-21T17:24:57.826Z"
      },
      {
        name: "Adrenaline Rush Red \u042F\u0433\u043E\u0434\u043D\u0430\u044F \u044D\u043D\u0435\u0440\u0433\u0438\u044F 0.449\u043B",
        category: "energy_drink",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 221,
        volume: 449,
        tasteProfile: { sweet: 7, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-adrenaline-rush-red-yagodn--3931838/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1194825-main/320x320.jpeg?updated_at=2025-06-25T11:19:10.718Z"
      },
      // === FLASH UP ===
      {
        name: "Flash Up Max 1\u043B",
        category: "energy_drink",
        color: "#1E90FF",
        abv: 0,
        pricePerLiter: 124,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-flash-up-max-1l--3963457/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1197010-main/320x320.jpeg?updated_at=2024-10-31T19:33:33.928Z"
      },
      {
        name: "Flash Up Energy \u041A\u0438\u0432\u0438 \u0438 \u041A\u0430\u0440\u0430\u043C\u0431\u043E\u043B\u0430 \u0432\u0438\u0442\u0430\u043C\u0438\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 450\u043C\u043B",
        category: "energy_drink",
        color: "#32CD32",
        abv: 0,
        pricePerLiter: 198,
        volume: 450,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-flash-up-energy-kivi-i-kar--4346917/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1824831-main/320x320.jpeg"
      },
      {
        name: "Flash Up Energy \u0441 \u043A\u043E\u0444\u0435\u0438\u043D\u043E\u043C \u0438 \u0442\u0430\u0443\u0440\u0438\u043D\u043E\u043C \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 470\u043C\u043B",
        category: "energy_drink",
        color: "#4169E1",
        abv: 0,
        pricePerLiter: 168,
        volume: 470,
        tasteProfile: { sweet: 5, sour: 2, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-flash-up-energy-s-kofeinom--4373462/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1848983-main/320x320.jpeg?updated_at=2025-09-24T17:45:12.247Z"
      },
      // === LIT ENERGY ===
      {
        name: "Lit Energy Classic \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 0.45\u043B",
        category: "energy_drink",
        color: "#9370DB",
        abv: 0,
        pricePerLiter: 242,
        volume: 450,
        tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-lit-energy-classic-gazirov--4315664/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1575087-main/800x800.jpeg?updated_at=2025-09-11T14:57:47.603Z"
      },
      {
        name: "Lit Energy Original \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 0.45\u043B",
        category: "energy_drink",
        color: "#8A2BE2",
        abv: 0,
        pricePerLiter: 242,
        volume: 450,
        tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-lit-energy-original-gaziro--4315665/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1575088-main/800x800.jpeg?updated_at=2025-02-28T10:33:57.318Z"
      },
      {
        name: "Lit Energy Blueberry \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 450\u043C\u043B",
        category: "energy_drink",
        color: "#6A5ACD",
        abv: 0,
        pricePerLiter: 242,
        volume: 450,
        tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-lit-energy-blueberry-gazir--4318100/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1576938-main/320x320.jpeg?updated_at=2025-09-11T14:58:16.340Z"
      },
      {
        name: "Lit Energy Strawberry bubblegum \u0442\u043E\u043D\u0438\u0437\u0438\u0440\u0443\u044E\u0449\u0438\u0439 \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 450\u043C\u043B",
        category: "energy_drink",
        color: "#FF69B4",
        abv: 0,
        pricePerLiter: 220,
        volume: 450,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-lit-energy-strawberry-bubb--4414653/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/2031661-main/320x320.jpeg?updated_at=2025-09-24T18:00:20.826Z"
      },
      {
        name: "Lit Energy Raspberry \u0441\u043E \u0432\u043A\u0443\u0441\u043E\u043C \u043C\u0430\u043B\u0438\u043D\u044B \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 450\u043C\u043B",
        category: "energy_drink",
        color: "#C71585",
        abv: 0,
        pricePerLiter: 244,
        volume: 450,
        tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-lit-energy-raspberry-so-vk--4426030/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/2047164-main/320x320.jpeg?updated_at=2025-09-24T18:01:32.782Z"
      },
      // === GORILLA ===
      {
        name: "Gorilla 0.45\u043B",
        category: "energy_drink",
        color: "#696969",
        abv: 0,
        pricePerLiter: 198,
        volume: 450,
        tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-gorilla-0-45l--3680076/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1190244-main/320x320.jpeg?updated_at=2025-02-28T10:34:04.827Z"
      },
      {
        name: "Gorilla Mango Coconut \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 0.45\u043B",
        category: "energy_drink",
        color: "#FFA500",
        abv: 0,
        pricePerLiter: 198,
        volume: 450,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-gorilla-mango-coconut-toniziruyushchiy-gaz--4306615/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1518541-main/320x320.jpeg?updated_at=2025-02-28T10:34:00.503Z"
      },
      // === BURN ===
      {
        name: "Burn \u0421\u043E\u0447\u043D\u0430\u044F \u042D\u043D\u0435\u0440\u0433\u0438\u044F \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 330\u043C\u043B",
        category: "energy_drink",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 270,
        volume: 330,
        tasteProfile: { sweet: 7, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-burn-sochnaya-energiya-gaz--4315390/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1614936-main/320x320.jpeg?updated_at=2025-05-23T08:51:12.534Z"
      },
      {
        name: "Burn \u041E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0439 330\u043C\u043B",
        category: "energy_drink",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 270,
        volume: 330,
        tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-burn-originalnyy-330ml--4315389/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1578004-main/320x320.jpeg?updated_at=2025-02-28T13:21:53.127Z"
      },
      // === TORNADO ===
      {
        name: "Tornado Max Energy Black 450\u043C\u043B",
        category: "energy_drink",
        color: "#000000",
        abv: 0,
        pricePerLiter: 176,
        volume: 450,
        tasteProfile: { sweet: 5, sour: 2, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-tornado-max-energy-black-4--4391720/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1853394-main/320x320.jpeg?updated_at=2025-09-24T17:52:17.328Z"
      },
      // === VOLT ENERGY ===
      {
        name: "Volt Energy \u0441\u043E \u0432\u043A\u0443\u0441\u043E\u043C \u043A\u0438\u0432\u0438 \u0438 \u0444\u0435\u0439\u0445\u043E\u0430 \u043F\u0430\u0441\u0442\u0435\u0440\u0438\u0437\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 450\u043C\u043B",
        category: "energy_drink",
        color: "#ADFF2F",
        abv: 0,
        pricePerLiter: 198,
        volume: 450,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-volt-energy-so-vkusom-kivi--4411409/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/2025377-main/320x320.jpeg?updated_at=2025-09-24T17:59:45.364Z"
      },
      {
        name: "Volt Energy \u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434 \u0438 \u0433\u0443\u0430\u0432\u0430 450\u043C\u043B",
        category: "energy_drink",
        color: "#9370DB",
        abv: 0,
        pricePerLiter: 198,
        volume: 450,
        tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-toniziruyushchiy-volt-energy-vinograd-i-gu--4392143/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico",
        imageUrl: "https://catalog-images.x5static.net/product/1855133-main/320x320.jpeg?updated_at=2025-09-24T17:52:18.785Z"
      }
    ];
  }
});

// client/src/lib/pyaterochka-fruits.ts
var PYATEROCHKA_FRUITS;
var init_pyaterochka_fruits = __esm({
  "client/src/lib/pyaterochka-fruits.ts"() {
    "use strict";
    PYATEROCHKA_FRUITS = [
      // === ВИНОГРАД ===
      {
        name: "\u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434 \u0428\u0430\u0439\u043D \u041C\u0443\u0441\u043A\u0430\u0442 \u043D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u044B\u0439",
        category: "fruit",
        color: "#9ACD32",
        abv: 0,
        pricePerLiter: 39900,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434 \u041A\u0438\u0448-\u041C\u0438\u0448 \u0447\u0435\u0440\u043D\u044B\u0439",
        category: "fruit",
        color: "#2F4F4F",
        abv: 0,
        pricePerLiter: 17900,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434 \u0447\u0435\u0440\u043D\u044B\u0439",
        category: "fruit",
        color: "#2F4F4F",
        abv: 0,
        pricePerLiter: 16900,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434 \u0422\u0430\u0439\u0444\u0438",
        category: "fruit",
        color: "#9370DB",
        abv: 0,
        pricePerLiter: 14900,
        tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434 \u0420\u0435\u0434 \u0413\u043B\u043E\u0431",
        category: "fruit",
        color: "#8B0000",
        abv: 0,
        pricePerLiter: 21900,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      // === ЦИТРУСОВЫЕ ===
      {
        name: "\u041F\u043E\u043C\u0435\u043B\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435",
        category: "fruit",
        color: "#FFB6C1",
        abv: 0,
        pricePerLiter: 17900,
        tasteProfile: { sweet: 5, sour: 4, bitter: 2, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u041F\u043E\u043C\u0435\u043B\u043E Global Village",
        category: "fruit",
        color: "#FFFACD",
        abv: 0,
        pricePerLiter: 16900,
        tasteProfile: { sweet: 5, sour: 4, bitter: 2, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u041B\u0438\u043C\u043E\u043D\u044B",
        category: "fruit",
        color: "#FFFF00",
        abv: 0,
        pricePerLiter: 24900,
        tasteProfile: { sweet: 1, sour: 9, bitter: 1, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u041B\u0430\u0439\u043C \u0432 \u0443\u043F\u0430\u043A\u043E\u0432\u043A\u0435 3\u0448\u0442",
        category: "fruit",
        color: "#32CD32",
        abv: 0,
        pricePerLiter: 64900,
        tasteProfile: { sweet: 1, sour: 8, bitter: 1, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D\u044B \u0444\u0430\u0441\u043E\u0432\u0430\u043D\u043D\u044B\u0435",
        category: "fruit",
        color: "#FFA500",
        abv: 0,
        pricePerLiter: 19500,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D\u044B Global Village \u043E\u0442\u0431\u043E\u0440\u043D\u044B\u0435",
        category: "fruit",
        color: "#FFA500",
        abv: 0,
        pricePerLiter: 19900,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D\u044B",
        category: "fruit",
        color: "#FFA500",
        abv: 0,
        pricePerLiter: 18900,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0413\u0440\u0435\u0439\u043F\u0444\u0440\u0443\u0442 \u043A\u0440\u0430\u0441\u043D\u044B\u0439",
        category: "fruit",
        color: "#FF6347",
        abv: 0,
        pricePerLiter: 16900,
        tasteProfile: { sweet: 4, sour: 6, bitter: 3, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0421\u0432\u0438\u0442\u0438",
        category: "fruit",
        color: "#90EE90",
        abv: 0,
        pricePerLiter: 24900,
        tasteProfile: { sweet: 6, sour: 3, bitter: 1, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u041C\u0430\u043D\u0434\u0430\u0440\u0438\u043D\u044B \u043C\u0438\u043D\u0438",
        category: "fruit",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 24900,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u041C\u0430\u043D\u0434\u0430\u0440\u0438\u043D\u044B Global Village \u043E\u0442\u0431\u043E\u0440\u043D\u044B\u0435",
        category: "fruit",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 22900,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      // === ЯГОДЫ ===
      {
        name: "\u0415\u0436\u0435\u0432\u0438\u043A\u0430 125\u0433",
        category: "fruit",
        color: "#2F4F4F",
        abv: 0,
        pricePerLiter: 39900,
        tasteProfile: { sweet: 6, sour: 3, bitter: 1, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u041A\u043B\u0443\u0431\u043D\u0438\u043A\u0430 250\u0433",
        category: "fruit",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 39900,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0413\u043E\u043B\u0443\u0431\u0438\u043A\u0430 125\u0433",
        category: "fruit",
        color: "#4169E1",
        abv: 0,
        pricePerLiter: 159200,
        tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0413\u043E\u043B\u0443\u0431\u0438\u043A\u0430 Global Village Selection \u043E\u0442\u0431\u043E\u0440\u043D\u0430\u044F 200\u0433",
        category: "fruit",
        color: "#4169E1",
        abv: 0,
        pricePerLiter: 199500,
        tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u041C\u0430\u043B\u0438\u043D\u0430 150\u0433",
        category: "fruit",
        color: "#E30B5C",
        abv: 0,
        pricePerLiter: 266e3,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      // === ЯБЛОКИ ===
      {
        name: "\u042F\u0431\u043B\u043E\u043A\u043E Global Village \u043A\u0440\u0430\u0441\u043D\u043E\u0435",
        category: "fruit",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 14900,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u042F\u0431\u043B\u043E\u043A\u0438 \u0413\u043E\u043B\u0434\u0435\u043D (\u0421\u043B\u0430\u0434\u043A\u0438\u0435)",
        category: "fruit",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 16900,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u042F\u0431\u043B\u043E\u043A\u0438 \u0413\u0440\u0435\u043D\u043D\u0438 \u0421\u043C\u0438\u0442 (\u0421 \u043A\u0438\u0441\u043B\u0438\u043D\u043A\u043E\u0439)",
        category: "fruit",
        color: "#9ACD32",
        abv: 0,
        pricePerLiter: 16900,
        tasteProfile: { sweet: 4, sour: 7, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u042F\u0431\u043B\u043E\u043A\u0438 \u0420\u0435\u0434 \u0414\u0435\u043B\u0438\u0448\u0435\u0441",
        category: "fruit",
        color: "#8B0000",
        abv: 0,
        pricePerLiter: 16900,
        tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u042F\u0431\u043B\u043E\u043A\u0438 \u0420\u043E\u044F\u043B \u0413\u0430\u043B\u0430 4\u0448\u0442",
        category: "fruit",
        color: "#FF6347",
        abv: 0,
        pricePerLiter: 47900,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u042F\u0431\u043B\u043E\u043A\u0438 Global Village \u0420\u043E\u044F\u043B \u0413\u0430\u043B\u0430",
        category: "fruit",
        color: "#FF6347",
        abv: 0,
        pricePerLiter: 12900,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u042F\u0431\u043B\u043E\u043A\u0438 Global Village \u0413\u043E\u043B\u0434\u0435\u043D \u0444\u0430\u0441\u043E\u0432\u0430\u043D\u043D\u044B\u0435",
        category: "fruit",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 13900,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u042F\u0431\u043B\u043E\u043A\u0438 \u0414\u0436\u0435\u0440\u0430\u043C\u0438\u043D 4\u0448\u0442",
        category: "fruit",
        color: "#FF4500",
        abv: 0,
        pricePerLiter: 46900,
        tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u042F\u0431\u043B\u043E\u043A\u0438 \u0421\u0438\u043C\u0438\u0440\u0435\u043D\u043A\u043E \u0444\u0430\u0441\u043E\u0432\u0430\u043D\u043D\u044B\u0435",
        category: "fruit",
        color: "#7FFF00",
        abv: 0,
        pricePerLiter: 14900,
        tasteProfile: { sweet: 5, sour: 5, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u042F\u0431\u043B\u043E\u043A\u0438 \u0421\u0438\u043D\u0430\u043F",
        category: "fruit",
        color: "#ADFF2F",
        abv: 0,
        pricePerLiter: 16900,
        tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      // === ГРУШИ ===
      {
        name: "\u0413\u0440\u0443\u0448\u0438 \u041F\u0430\u043A\u0445\u0430\u043C",
        category: "fruit",
        color: "#9ACD32",
        abv: 0,
        pricePerLiter: 19900,
        tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0413\u0440\u0443\u0448\u0438 \u041A\u0438\u0442\u0430\u0439\u0441\u043A\u0438\u0435",
        category: "fruit",
        color: "#F0E68C",
        abv: 0,
        pricePerLiter: 17900,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0413\u0440\u0443\u0448\u0438 \u041A\u043E\u043D\u0444\u0435\u0440\u0435\u043D\u0446\u0438\u044F",
        category: "fruit",
        color: "#8B7355",
        abv: 0,
        pricePerLiter: 27900,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      // === ЭКЗОТИЧЕСКИЕ ФРУКТЫ ===
      {
        name: "\u0411\u0430\u043D\u0430\u043D\u044B Global Village",
        category: "fruit",
        color: "#FFE135",
        abv: 0,
        pricePerLiter: 13500,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u041F\u0438\u0442\u0430\u0445\u0430\u0439\u044F",
        category: "fruit",
        color: "#FF69B4",
        abv: 0,
        pricePerLiter: 36900,
        tasteProfile: { sweet: 6, sour: 2, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0413\u0440\u0430\u043D\u0430\u0442",
        category: "fruit",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 17900,
        tasteProfile: { sweet: 6, sour: 4, bitter: 1, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0413\u0440\u0430\u043D\u0430\u0442 \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043D",
        category: "fruit",
        color: "#8B0000",
        abv: 0,
        pricePerLiter: 16900,
        tasteProfile: { sweet: 6, sour: 4, bitter: 1, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0425\u0443\u0440\u043C\u0430 \u043F\u043B\u043E\u0441\u043A\u0430\u044F",
        category: "fruit",
        color: "#FF6347",
        abv: 0,
        pricePerLiter: 17900,
        tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0425\u0443\u0440\u043C\u0430 \u0428\u0438\u0448\u0438 \u0411\u0443\u0440\u0443\u043D",
        category: "fruit",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 17900,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u041A\u0438\u0432\u0438",
        category: "fruit",
        color: "#9ACD32",
        abv: 0,
        pricePerLiter: 19900,
        tasteProfile: { sweet: 6, sour: 5, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u041C\u0430\u043D\u0433\u043E \u0441\u043F\u0435\u043B\u043E\u0435 \u0415\u0433\u0438\u043F\u0435\u0442",
        category: "fruit",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 31900,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0410\u0439\u0432\u0430",
        category: "fruit",
        color: "#F0E68C",
        abv: 0,
        pricePerLiter: 23900,
        tasteProfile: { sweet: 5, sour: 3, bitter: 2, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0421\u043B\u0438\u0432\u0430 \u0441\u0435\u0437\u043E\u043D\u043D\u0430\u044F",
        category: "fruit",
        color: "#8B008B",
        abv: 0,
        pricePerLiter: 13900,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      },
      {
        name: "\u0421\u043B\u0438\u0432\u0430 \u041F\u0440\u0435\u0437\u0438\u0434\u0435\u043D\u0442 500\u0433",
        category: "fruit",
        color: "#4B0082",
        abv: 0,
        pricePerLiter: 39900,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "kg",
        sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: "https://5ka.ru/favicon.ico"
      }
    ];
  }
});

// client/src/lib/pyaterochka-bitters.ts
var PYATEROCHKA_ICON, PYATEROCHKA_BITTERS;
var init_pyaterochka_bitters = __esm({
  "client/src/lib/pyaterochka-bitters.ts"() {
    "use strict";
    PYATEROCHKA_ICON = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/X5_Retail_Group_logo.svg/1200px-X5_Retail_Group_logo.svg.png";
    PYATEROCHKA_BITTERS = [
      {
        name: "\u0422\u043E\u043D\u0438\u043A Rich Bitter \u043B\u0438\u043C\u043E\u043D 1\u043B",
        category: "bitter",
        color: "#FFFF00",
        abv: 0,
        pricePerLiter: 129,
        volume: 1e3,
        tasteProfile: { sweet: 4, sour: 6, bitter: 7, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/tonik-rich-bitter-limon-1l--4396782/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: PYATEROCHKA_ICON,
        imageUrl: "https://catalog-images.x5static.net/product/2007176-main/800x800.jpeg?updated_at=2025-07-02T08:07:13.888Z"
      },
      {
        name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A Rich Cocktail \u0421\u043F\u0440\u0438\u0442\u0446 \u041A\u0440\u0430\u0441\u043D\u044B\u0439 \u0430\u043F\u0435\u043B\u044C\u0441\u0438\u043D \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 1\u043B",
        category: "bitter",
        color: "#FF4500",
        abv: 0,
        pricePerLiter: 129,
        volume: 1e3,
        tasteProfile: { sweet: 5, sour: 4, bitter: 5, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-rich-cocktail-spritts-krasnyy-apelsin-gazi--4401860/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: PYATEROCHKA_ICON,
        imageUrl: "https://catalog-images.x5static.net/product/2010194-main/800x800.jpeg?updated_at=2025-09-24T17:56:06.910Z"
      },
      {
        name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A Rich Tonic \u0418\u043D\u0434\u0438\u0430\u043D \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 1\u043B",
        category: "bitter",
        color: "#E0E0E0",
        abv: 0,
        pricePerLiter: 129,
        volume: 1e3,
        tasteProfile: { sweet: 3, sour: 2, bitter: 8, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-rich-tonic-indian-gazirovannyy-1l--4396783/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: PYATEROCHKA_ICON,
        imageUrl: "https://catalog-images.x5static.net/product/2010197-main/800x800.jpeg"
      },
      {
        name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A Evervess \u0422\u043E\u043D\u0438\u043A \u0412\u043A\u0443\u0441 \u0411\u0438\u0442\u0442\u0435\u0440 \u041B\u0435\u043C\u043E\u043D \u0433\u0430\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 1\u043B",
        category: "bitter",
        color: "#FFF44F",
        abv: 0,
        pricePerLiter: 109,
        volume: 1e3,
        tasteProfile: { sweet: 4, sour: 5, bitter: 7, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://5ka.ru/product/napitok-evervess-tonik-vkus-bitter-lemon-gazirovan--4415410/",
        sourceName: "\u041F\u044F\u0442\u0451\u0440\u043E\u0447\u043A\u0430",
        sourceIcon: PYATEROCHKA_ICON,
        imageUrl: "https://catalog-images.x5static.net/product/2064142-main/800x800.jpeg?updated_at=2025-10-22T07:14:15.314Z"
      }
    ];
  }
});

// client/src/lib/wildberries-syrups-new.ts
var URL, IMG, ICON, WILDBERRIES_SYRUPS;
var init_wildberries_syrups_new = __esm({
  "client/src/lib/wildberries-syrups-new.ts"() {
    "use strict";
    URL = "https://www.wildberries.ru/catalog/0/search.aspx?page=1&sort=popular&search=%D1%81%D0%B8%D1%80%D0%BE%D0%BF%D1%8B+%D0%B4%D0%BB%D1%8F+%D0%BA%D0%BE%D0%BA%D1%82%D0%B5%D0%B9%D0%BB%D0%B5%D0%B9&fbrand=263215#c172715008";
    IMG = "/src/assets/syryp_ingridient_img.jpg";
    ICON = "https://avatars.mds.yandex.net/get-altay/15417312/2a0000019657128152a68f1e447f3ed1ea42/XXL_height";
    WILDBERRIES_SYRUPS = [
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041F\u043E\u043F\u043A\u043E\u0440\u043D \u0434\u043B\u044F \u043A\u043E\u0444\u0435 \u0438 \u0434\u0435\u0441\u0435\u0440\u0442\u043E\u0432 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#D2691E",
        abv: 0,
        pricePerLiter: 268,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u0430\u0440\u0430\u043C\u0435\u043B\u044C \u0434\u043B\u044F \u043A\u043E\u0444\u0435 \u0438 \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#CD853F",
        abv: 0,
        pricePerLiter: 275,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0412\u0430\u043D\u0438\u043B\u044C \u0444\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0430\u044F \u0434\u043B\u044F \u043A\u043E\u0444\u0435 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#F5DEB3",
        abv: 0,
        pricePerLiter: 282,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0428\u043E\u043A\u043E\u043B\u0430\u0434\u043D\u043E\u0435 \u043F\u0435\u0447\u0435\u043D\u044C\u0435 \u0434\u043B\u044F \u043D\u0430\u043F\u0438\u0442\u043A\u043E\u0432 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 290,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041B\u0435\u0441\u043D\u043E\u0439 \u043E\u0440\u0435\u0445 \u0434\u043B\u044F \u043A\u043E\u0444\u0435 \u0438 \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#A0522D",
        abv: 0,
        pricePerLiter: 285,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u043E\u043A\u043E\u0441 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 \u0438 \u043A\u043E\u0444\u0435 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFFACD",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u043B\u0443\u0431\u043D\u0438\u043A\u0430 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FF6B9D",
        abv: 0,
        pricePerLiter: 278,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u043B\u0438\u043D\u0430 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 \u0438 \u0434\u0435\u0441\u0435\u0440\u0442\u043E\u0432 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#E30B5C",
        abv: 0,
        pricePerLiter: 280,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0412\u0438\u0448\u043D\u044F \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#8B0000",
        abv: 0,
        pricePerLiter: 283,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041F\u0435\u0440\u0441\u0438\u043A \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 \u0438 \u043A\u043E\u0444\u0435 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFDAB9",
        abv: 0,
        pricePerLiter: 277,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u043D\u0433\u043E \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFA500",
        abv: 0,
        pricePerLiter: 288,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u0440\u0430\u043A\u0443\u0439\u044F \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 292,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 3, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041B\u0430\u0439\u043C \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#00FF00",
        abv: 0,
        pricePerLiter: 285,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 7, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u044F\u0442\u0430 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 \u041C\u043E\u0445\u0438\u0442\u043E 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#98FF98",
        abv: 0,
        pricePerLiter: 280,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 0, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0418\u043C\u0431\u0438\u0440\u044C \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#DAA520",
        abv: 0,
        pricePerLiter: 287,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 1, bitter: 3, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0413\u043E\u043B\u0443\u0431\u0430\u044F \u041B\u0430\u0433\u0443\u043D\u0430 Blue Curacao 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#0080FF",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0413\u0440\u0435\u043D\u0430\u0434\u0438\u043D \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 272,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0411\u0430\u043D\u0430\u043D \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 \u0438 \u043A\u043E\u0444\u0435 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFE135",
        abv: 0,
        pricePerLiter: 279,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 274,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 3, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041B\u0438\u043C\u043E\u043D \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFFF00",
        abv: 0,
        pricePerLiter: 276,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 8, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0415\u0436\u0435\u0432\u0438\u043A\u0430 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#4B0082",
        abv: 0,
        pricePerLiter: 284,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0427\u0435\u0440\u043D\u0430\u044F \u0441\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u0430 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#301934",
        abv: 0,
        pricePerLiter: 281,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 3, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u0438\u0432\u0438 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#8EE53F",
        abv: 0,
        pricePerLiter: 286,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 4, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0410\u0440\u0431\u0443\u0437 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FC6C85",
        abv: 0,
        pricePerLiter: 283,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0414\u044B\u043D\u044F \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFE4B5",
        abv: 0,
        pricePerLiter: 280,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0410\u043D\u0430\u043D\u0430\u0441 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 279,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0413\u0440\u0443\u0448\u0430 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#D1E231",
        abv: 0,
        pricePerLiter: 277,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0417\u0435\u043B\u0435\u043D\u043E\u0435 \u044F\u0431\u043B\u043E\u043A\u043E \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#8DB600",
        abv: 0,
        pricePerLiter: 275,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 5, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0411\u0430\u0437\u0438\u043B\u0438\u043A \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#228B22",
        abv: 0,
        pricePerLiter: 289,
        volume: 1e3,
        tasteProfile: { sweet: 5, sour: 0, bitter: 3, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041E\u0433\u0443\u0440\u0435\u0446 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#90EE90",
        abv: 0,
        pricePerLiter: 288,
        volume: 1e3,
        tasteProfile: { sweet: 3, sour: 1, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0422\u0438\u0440\u0430\u043C\u0438\u0441\u0443 \u0434\u043B\u044F \u043A\u043E\u0444\u0435 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#D2B48C",
        abv: 0,
        pricePerLiter: 293,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0421\u043E\u043B\u0435\u043D\u0430\u044F \u043A\u0430\u0440\u0430\u043C\u0435\u043B\u044C \u0434\u043B\u044F \u043A\u043E\u0444\u0435 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#C19A6B",
        abv: 0,
        pricePerLiter: 291,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0424\u0443\u043D\u0434\u0443\u043A \u0434\u043B\u044F \u043A\u043E\u0444\u0435 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#8B7355",
        abv: 0,
        pricePerLiter: 286,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0438\u043D\u0434\u0430\u043B\u044C \u0434\u043B\u044F \u043A\u043E\u0444\u0435 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFEBCD",
        abv: 0,
        pricePerLiter: 284,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0411\u0435\u043B\u044B\u0439 \u0448\u043E\u043A\u043E\u043B\u0430\u0434 \u0434\u043B\u044F \u043A\u043E\u0444\u0435 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFFAF0",
        abv: 0,
        pricePerLiter: 289,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u043E\u043B\u043E\u0447\u043D\u044B\u0439 \u0448\u043E\u043A\u043E\u043B\u0430\u0434 \u0434\u043B\u044F \u043A\u043E\u0444\u0435 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#D2691E",
        abv: 0,
        pricePerLiter: 287,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F Irish Cream \u0418\u0440\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0439 \u043A\u0440\u0435\u043C 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#C8B4A0",
        abv: 0,
        pricePerLiter: 294,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u043E\u0440\u0438\u0446\u0430 \u0434\u043B\u044F \u043A\u043E\u0444\u0435 \u0438 \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 282,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 0, bitter: 3, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041B\u0430\u0432\u0430\u043D\u0434\u0430 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#967BB6",
        abv: 0,
        pricePerLiter: 296,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 0, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0411\u0443\u0437\u0438\u043D\u0430 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#301934",
        abv: 0,
        pricePerLiter: 290,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0420\u043E\u0437\u0430 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FF69B4",
        abv: 0,
        pricePerLiter: 298,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0424\u0438\u0430\u043B\u043A\u0430 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#8A2BE2",
        abv: 0,
        pricePerLiter: 297,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0427\u0451\u0440\u043D\u044B\u0439 \u0447\u0430\u0439 \u0434\u043B\u044F \u043D\u0430\u043F\u0438\u0442\u043A\u043E\u0432 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#654321",
        abv: 0,
        pricePerLiter: 281,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 0, bitter: 4, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0417\u0435\u043B\u0451\u043D\u044B\u0439 \u0447\u0430\u0439 \u041C\u0430\u0442\u0447\u0430 \u0434\u043B\u044F \u043D\u0430\u043F\u0438\u0442\u043A\u043E\u0432 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#7CB342",
        abv: 0,
        pricePerLiter: 299,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 0, bitter: 3, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041B\u0438\u0447\u0438 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFC0CB",
        abv: 0,
        pricePerLiter: 292,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0413\u0443\u0430\u0432\u0430 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFC9DE",
        abv: 0,
        pricePerLiter: 288,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0414\u0440\u0430\u043A\u043E\u043D\u0438\u0439 \u0444\u0440\u0443\u043A\u0442 \u041F\u0438\u0442\u0430\u0439\u044F 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FF1493",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0422\u0440\u043E\u043F\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0444\u0440\u0443\u043A\u0442\u044B \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 283,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0416\u0430\u0441\u043C\u0438\u043D \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#F8F8FF",
        abv: 0,
        pricePerLiter: 294,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u042E\u0437\u0443 \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 310,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 7, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u0440\u0430\u0441\u043D\u044B\u0439 \u0430\u043F\u0435\u043B\u044C\u0441\u0438\u043D Blood Orange 1 \u043B \u0441\u0442\u0435\u043A\u043B\u043E",
        category: "syrup",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 286,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 4, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      // === НОВЫЕ 100 УНИКАЛЬНЫХ СИРОПОВ ===
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0413\u043E\u043B\u0443\u0431\u043E\u0439 \u041A\u044E\u0440\u0430\u0441\u0430\u043E \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 \u0438 \u043B\u0438\u043C\u043E\u043D\u0430\u0434\u043E\u0432 1\u043B \u043F\u044D\u0442",
        category: "syrup",
        color: "#0080FF",
        abv: 0,
        pricePerLiter: 265,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0413\u043E\u043B\u0443\u0431\u043E\u0439 \u041A\u044E\u0440\u0430\u0441\u0430\u043E \u0434\u043B\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u0435\u0439 \u0438 \u043B\u0438\u043C\u043E\u043D\u0430\u0434\u043E\u0432 1\u043B.",
        category: "syrup",
        color: "#0080FF",
        abv: 0,
        pricePerLiter: 268,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u0440\u0430\u0441\u043D\u0430\u044F \u0441\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u0430 1 \u043B",
        category: "syrup",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 280,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 4, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0413\u043E\u043B\u0443\u0431\u0438\u043A\u0430 1 \u043B",
        category: "syrup",
        color: "#4169E1",
        abv: 0,
        pricePerLiter: 285,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0411\u0440\u0443\u0441\u043D\u0438\u043A\u0430 1 \u043B",
        category: "syrup",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 283,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 5, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u043B\u044E\u043A\u0432\u0430 1 \u043B",
        category: "syrup",
        color: "#8B0000",
        abv: 0,
        pricePerLiter: 284,
        volume: 1e3,
        tasteProfile: { sweet: 5, sour: 7, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041E\u0431\u043B\u0435\u043F\u0438\u0445\u0430 1 \u043B",
        category: "syrup",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 287,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 4, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0424\u0435\u0439\u0445\u043E\u0430 1 \u043B",
        category: "syrup",
        color: "#90EE90",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0410\u0431\u0440\u0438\u043A\u043E\u0441 1 \u043B",
        category: "syrup",
        color: "#FFA500",
        abv: 0,
        pricePerLiter: 276,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041D\u0435\u043A\u0442\u0430\u0440\u0438\u043D 1 \u043B",
        category: "syrup",
        color: "#FF6347",
        abv: 0,
        pricePerLiter: 279,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0421\u043B\u0438\u0432\u0430 1 \u043B",
        category: "syrup",
        color: "#8B4789",
        abv: 0,
        pricePerLiter: 277,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0418\u043D\u0436\u0438\u0440 1 \u043B",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 298,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0424\u0438\u043D\u0438\u043A 1 \u043B",
        category: "syrup",
        color: "#654321",
        abv: 0,
        pricePerLiter: 294,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0413\u0440\u0430\u043D\u0430\u0442 1 \u043B",
        category: "syrup",
        color: "#8B0000",
        abv: 0,
        pricePerLiter: 289,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 4, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0427\u0435\u0440\u0435\u0448\u043D\u044F 1 \u043B",
        category: "syrup",
        color: "#8B0000",
        abv: 0,
        pricePerLiter: 282,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0413\u0440\u0435\u0439\u043F\u0444\u0440\u0443\u0442 1 \u043B",
        category: "syrup",
        color: "#FF69B4",
        abv: 0,
        pricePerLiter: 281,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 5, bitter: 3, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u043D\u0434\u0430\u0440\u0438\u043D 1 \u043B",
        category: "syrup",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 278,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0411\u0435\u0440\u0433\u0430\u043C\u043E\u0442 1 \u043B",
        category: "syrup",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 296,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 4, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041F\u043E\u043C\u0435\u043B\u043E 1 \u043B",
        category: "syrup",
        color: "#FFA500",
        abv: 0,
        pricePerLiter: 292,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 4, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0420\u0435\u0432\u0435\u043D\u044C 1 \u043B",
        category: "syrup",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 284,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 6, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u0443\u043C\u043A\u0432\u0430\u0442 1 \u043B",
        category: "syrup",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 299,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 5, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041F\u0430\u043F\u0430\u0439\u044F 1 \u043B",
        category: "syrup",
        color: "#FFA500",
        abv: 0,
        pricePerLiter: 293,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u0430\u0440\u0430\u043C\u0431\u043E\u043B\u0430 1 \u043B",
        category: "syrup",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 297,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0420\u0430\u043C\u0431\u0443\u0442\u0430\u043D 1 \u043B",
        category: "syrup",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 310,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u043D\u0433\u043E\u0441\u0442\u0438\u043D 1 \u043B",
        category: "syrup",
        color: "#8B008B",
        abv: 0,
        pricePerLiter: 315,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0414\u0443\u0440\u0438\u0430\u043D 1 \u043B",
        category: "syrup",
        color: "#FFE4B5",
        abv: 0,
        pricePerLiter: 320,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0421\u0430\u043F\u043E\u0434\u0438\u043B\u043B\u0430 1 \u043B",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 305,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0422\u0430\u043C\u0430\u0440\u0438\u043D\u0434 1 \u043B",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 298,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 5, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u0442\u0442\u044F \u043B\u0430\u0442\u0442\u0435 1 \u043B",
        category: "syrup",
        color: "#7CB342",
        abv: 0,
        pricePerLiter: 302,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 0, bitter: 3, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u042D\u0440\u043B \u0413\u0440\u0435\u0439 1 \u043B",
        category: "syrup",
        color: "#654321",
        abv: 0,
        pricePerLiter: 286,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 0, bitter: 4, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u0441\u0430\u043B\u0430 \u0447\u0430\u0439 1 \u043B",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 289,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 0, bitter: 3, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0423\u043B\u0443\u043D \u043C\u043E\u043B\u043E\u0447\u043D\u044B\u0439 1 \u043B",
        category: "syrup",
        color: "#D2B48C",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 0, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0427\u0430\u0439 \u0441 \u0431\u0435\u0440\u0433\u0430\u043C\u043E\u0442\u043E\u043C 1 \u043B",
        category: "syrup",
        color: "#654321",
        abv: 0,
        pricePerLiter: 284,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 1, bitter: 4, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0451\u0434 \u0430\u043A\u0430\u0446\u0438\u0438 1 \u043B",
        category: "syrup",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 298,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0451\u0434 \u043A\u0430\u0448\u0442\u0430\u043D\u043E\u0432\u044B\u0439 1 \u043B",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 303,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u043B\u0435\u043D\u043E\u0432\u044B\u0439 1 \u043B",
        category: "syrup",
        color: "#D2691E",
        abv: 0,
        pricePerLiter: 310,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0410\u0433\u0430\u0432\u044B 1 \u043B",
        category: "syrup",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0422\u043E\u043F\u0438\u043D\u0430\u043C\u0431\u0443\u0440 1 \u043B",
        category: "syrup",
        color: "#F5DEB3",
        abv: 0,
        pricePerLiter: 287,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u043E\u043A\u043E\u0441\u043E\u0432\u044B\u0439 \u043A\u0440\u0435\u043C 1 \u043B",
        category: "syrup",
        color: "#FFFACD",
        abv: 0,
        pricePerLiter: 296,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041E\u0440\u0435\u0445\u043E\u0432\u0430\u044F \u043F\u0430\u0441\u0442\u0430 1 \u043B",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 299,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0410\u0440\u0430\u0445\u0438\u0441\u043E\u0432\u043E\u0435 \u043C\u0430\u0441\u043B\u043E 1 \u043B",
        category: "syrup",
        color: "#DEB887",
        abv: 0,
        pricePerLiter: 292,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u0435\u0448\u044C\u044E 1 \u043B",
        category: "syrup",
        color: "#FFE4B5",
        abv: 0,
        pricePerLiter: 298,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u043A\u0430\u0434\u0430\u043C\u0438\u044F 1 \u043B",
        category: "syrup",
        color: "#F5DEB3",
        abv: 0,
        pricePerLiter: 315,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041F\u0435\u043A\u0430\u043D 1 \u043B",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 305,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0424\u0438\u0441\u0442\u0430\u0448\u043A\u0430 1 \u043B",
        category: "syrup",
        color: "#93C572",
        abv: 0,
        pricePerLiter: 310,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0418\u043C\u0431\u0438\u0440\u043D\u044B\u0439 \u043F\u0440\u044F\u043D\u0438\u043A 1 \u043B",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 285,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u0440\u0435\u043C-\u0431\u0440\u044E\u043B\u0435 1 \u043B",
        category: "syrup",
        color: "#D2691E",
        abv: 0,
        pricePerLiter: 290,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0427\u0438\u0437\u043A\u0435\u0439\u043A 1 \u043B",
        category: "syrup",
        color: "#FFFACD",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041F\u0430\u043D\u0430\u043A\u043E\u0442\u0430 1 \u043B",
        category: "syrup",
        color: "#FFF5EE",
        abv: 0,
        pricePerLiter: 292,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041F\u0440\u0430\u043B\u0438\u043D\u0435 1 \u043B",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 300,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u0440\u0446\u0438\u043F\u0430\u043D 1 \u043B",
        category: "syrup",
        color: "#FFEBCD",
        abv: 0,
        pricePerLiter: 297,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041D\u0443\u0433\u0430 1 \u043B",
        category: "syrup",
        color: "#F5DEB3",
        abv: 0,
        pricePerLiter: 293,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0425\u0430\u043B\u0432\u0430 1 \u043B",
        category: "syrup",
        color: "#DEB887",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0420\u0430\u0445\u0430\u0442-\u043B\u0443\u043A\u0443\u043C 1 \u043B",
        category: "syrup",
        color: "#FFB6C1",
        abv: 0,
        pricePerLiter: 288,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0417\u0435\u0444\u0438\u0440 1 \u043B",
        category: "syrup",
        color: "#FFF0F5",
        abv: 0,
        pricePerLiter: 283,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u0440\u0448\u043C\u0435\u043B\u043B\u043E\u0443 1 \u043B",
        category: "syrup",
        color: "#FFFFFF",
        abv: 0,
        pricePerLiter: 285,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0421\u0430\u0445\u0430\u0440\u043D\u0430\u044F \u0432\u0430\u0442\u0430 1 \u043B",
        category: "syrup",
        color: "#FFB6C1",
        abv: 0,
        pricePerLiter: 280,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0411\u0430\u0431\u0431\u043B-\u0433\u0430\u043C 1 \u043B",
        category: "syrup",
        color: "#FF69B4",
        abv: 0,
        pricePerLiter: 275,
        volume: 1e3,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u043E\u043B\u0430 1 \u043B",
        category: "syrup",
        color: "#3B2414",
        abv: 0,
        pricePerLiter: 270,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0422\u0430\u0440\u0445\u0443\u043D 1 \u043B",
        category: "syrup",
        color: "#00FF00",
        abv: 0,
        pricePerLiter: 272,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0414\u044E\u0448\u0435\u0441 1 \u043B",
        category: "syrup",
        color: "#D1E231",
        abv: 0,
        pricePerLiter: 274,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0411\u0430\u0440\u0431\u0430\u0440\u0438\u0441 1 \u043B",
        category: "syrup",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 276,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 7, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0411\u0430\u0439\u043A\u0430\u043B 1 \u043B",
        category: "syrup",
        color: "#654321",
        abv: 0,
        pricePerLiter: 273,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 3, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u0440\u0435\u043C-\u0441\u043E\u0434\u0430 1 \u043B",
        category: "syrup",
        color: "#F5DEB3",
        abv: 0,
        pricePerLiter: 271,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0421\u043F\u0440\u0430\u0439\u0442 1 \u043B",
        category: "syrup",
        color: "#E0FFE0",
        abv: 0,
        pricePerLiter: 269,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0424\u0430\u043D\u0442\u0430 1 \u043B",
        category: "syrup",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 268,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u043E\u0445\u0438\u0442\u043E \u0431\u0435\u0437\u0430\u043B\u043A\u043E\u0433\u043E\u043B\u044C\u043D\u044B\u0439 1 \u043B",
        category: "syrup",
        color: "#98FF98",
        abv: 0,
        pricePerLiter: 285,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 4, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041F\u0438\u043D\u0430 \u041A\u043E\u043B\u0430\u0434\u0430 1 \u043B",
        category: "syrup",
        color: "#FFFACD",
        abv: 0,
        pricePerLiter: 290,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u0439 \u0422\u0430\u0439 1 \u043B",
        category: "syrup",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 292,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 3, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u043E\u0441\u043C\u043E\u043F\u043E\u043B\u0438\u0442\u0430\u043D 1 \u043B",
        category: "syrup",
        color: "#FF1493",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 4, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u0440\u0433\u0430\u0440\u0438\u0442\u0430 1 \u043B",
        category: "syrup",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 288,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 6, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0414\u0430\u0439\u043A\u0438\u0440\u0438 1 \u043B",
        category: "syrup",
        color: "#FFE4B5",
        abv: 0,
        pricePerLiter: 286,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 5, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0422\u0435\u043A\u0438\u043B\u0430 \u0421\u0430\u043D\u0440\u0430\u0439\u0437 1 \u043B",
        category: "syrup",
        color: "#FF6347",
        abv: 0,
        pricePerLiter: 290,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0421\u0435\u043A\u0441 \u043D\u0430 \u043F\u043B\u044F\u0436\u0435 1 \u043B",
        category: "syrup",
        color: "#FF8C69",
        abv: 0,
        pricePerLiter: 287,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041B\u043E\u043D\u0433 \u0410\u0439\u043B\u0435\u043D\u0434 1 \u043B",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 293,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 3, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0410\u043F\u0435\u0440\u043E\u043B\u044C \u0428\u043F\u0440\u0438\u0446 1 \u043B",
        category: "syrup",
        color: "#FF4500",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 2, bitter: 4, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041D\u0435\u0433\u0440\u043E\u043D\u0438 1 \u043B",
        category: "syrup",
        color: "#8B0000",
        abv: 0,
        pricePerLiter: 298,
        volume: 1e3,
        tasteProfile: { sweet: 5, sour: 1, bitter: 6, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0410\u043C\u0435\u0440\u0438\u043A\u0430\u043D\u043E 1 \u043B",
        category: "syrup",
        color: "#8B4513",
        abv: 0,
        pricePerLiter: 294,
        volume: 1e3,
        tasteProfile: { sweet: 5, sour: 1, bitter: 5, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0428\u043E\u043A\u043E\u043B\u0430\u0434\u043D\u044B\u0439 \u0431\u0440\u0430\u0443\u043D\u0438 \u043F\u0440\u0435\u043C\u0438\u0443\u043C 1 \u043B",
        category: "syrup",
        color: "#654321",
        abv: 0,
        pricePerLiter: 298,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 0, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u042F\u0433\u043E\u0434\u043D\u044B\u0439 \u043C\u0438\u043A\u0441 \u043F\u0440\u0435\u043C\u0438\u0443\u043C 1 \u043B",
        category: "syrup",
        color: "#8B0000",
        abv: 0,
        pricePerLiter: 281,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0412\u0438\u0448\u043D\u0435\u0432\u044B\u0439 \u043B\u0438\u043A\u0451\u0440 \u043F\u0440\u0435\u043C\u0438\u0443\u043C 1 \u043B",
        category: "syrup",
        color: "#800020",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D\u043E\u0432\u044B\u0439 \u0444\u0440\u0435\u0448 \u043F\u0440\u0435\u043C\u0438\u0443\u043C 1 \u043B",
        category: "syrup",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 278,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 3, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u044F\u0442\u043D\u044B\u0439 \u0448\u043E\u043A\u043E\u043B\u0430\u0434 1 \u043B",
        category: "syrup",
        color: "#2E8B57",
        abv: 0,
        pricePerLiter: 292,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D \u0441 \u043A\u043E\u0440\u0438\u0446\u0435\u0439 1 \u043B",
        category: "syrup",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 287,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0412\u0438\u0448\u043D\u044F \u0441 \u043C\u0438\u043D\u0434\u0430\u043B\u0435\u043C 1 \u043B",
        category: "syrup",
        color: "#8B0000",
        abv: 0,
        pricePerLiter: 289,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 1, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041A\u043B\u0443\u0431\u043D\u0438\u043A\u0430 \u0441 \u0431\u0430\u0437\u0438\u043B\u0438\u043A\u043E\u043C 1 \u043B",
        category: "syrup",
        color: "#FF6B9D",
        abv: 0,
        pricePerLiter: 291,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 2, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u043B\u0438\u043D\u0430 \u0441 \u0440\u043E\u0437\u043E\u0439 1 \u043B",
        category: "syrup",
        color: "#E30B5C",
        abv: 0,
        pricePerLiter: 293,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 1, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041B\u0438\u043C\u043E\u043D \u0441 \u043B\u0430\u0432\u0430\u043D\u0434\u043E\u0439 1 \u043B",
        category: "syrup",
        color: "#FFFF00",
        abv: 0,
        pricePerLiter: 290,
        volume: 1e3,
        tasteProfile: { sweet: 6, sour: 6, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041E\u0433\u0443\u0440\u0435\u0446 \u0441 \u043C\u044F\u0442\u043E\u0439 1 \u043B",
        category: "syrup",
        color: "#90EE90",
        abv: 0,
        pricePerLiter: 285,
        volume: 1e3,
        tasteProfile: { sweet: 3, sour: 2, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0413\u0440\u0435\u0439\u043F\u0444\u0440\u0443\u0442 \u0441 \u0440\u043E\u0437\u043C\u0430\u0440\u0438\u043D\u043E\u043C 1 \u043B",
        category: "syrup",
        color: "#FF69B4",
        abv: 0,
        pricePerLiter: 294,
        volume: 1e3,
        tasteProfile: { sweet: 5, sour: 5, bitter: 4, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041F\u0435\u0440\u0441\u0438\u043A \u0441 \u0442\u0438\u043C\u044C\u044F\u043D\u043E\u043C 1 \u043B",
        category: "syrup",
        color: "#FFDAB9",
        abv: 0,
        pricePerLiter: 288,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 1, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0410\u043D\u0430\u043D\u0430\u0441 \u0441 \u043F\u0435\u0440\u0446\u0435\u043C \u0447\u0438\u043B\u0438 1 \u043B",
        category: "syrup",
        color: "#FFD700",
        abv: 0,
        pricePerLiter: 292,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u041C\u0430\u043D\u0433\u043E \u0441 \u0438\u043C\u0431\u0438\u0440\u0435\u043C 1 \u043B",
        category: "syrup",
        color: "#FFA500",
        abv: 0,
        pricePerLiter: 295,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 2, bitter: 2, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u042F\u0431\u043B\u043E\u043A\u043E \u0441 \u043A\u043E\u0440\u0438\u0446\u0435\u0439 1 \u043B",
        category: "syrup",
        color: "#8DB600",
        abv: 0,
        pricePerLiter: 279,
        volume: 1e3,
        tasteProfile: { sweet: 8, sour: 3, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0413\u0440\u0443\u0448\u0430 \u0441 \u0432\u0430\u043D\u0438\u043B\u044C\u044E 1 \u043B",
        category: "syrup",
        color: "#D1E231",
        abv: 0,
        pricePerLiter: 283,
        volume: 1e3,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0427\u0435\u0440\u043D\u0430\u044F \u0441\u043C\u043E\u0440\u043E\u0434\u0438\u043D\u0430 \u0441 \u043C\u044F\u0442\u043E\u0439 1 \u043B",
        category: "syrup",
        color: "#301934",
        abv: 0,
        pricePerLiter: 286,
        volume: 1e3,
        tasteProfile: { sweet: 7, sour: 3, bitter: 1, alcohol: 0 },
        unit: "ml",
        sourceUrl: URL,
        sourceName: "Wildberries",
        sourceIcon: ICON,
        imageUrl: IMG
      }
    ];
  }
});

// client/src/lib/magnit-bitters.ts
var MAGNIT_ICON, MAGNIT_BITTERS;
var init_magnit_bitters = __esm({
  "client/src/lib/magnit-bitters.ts"() {
    "use strict";
    MAGNIT_ICON = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/New-logo-magnit.jpg/960px-New-logo-magnit.jpg";
    MAGNIT_BITTERS = [
      {
        name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A Chillout Bitter Raspberry 900\u043C\u043B",
        category: "bitter",
        color: "#E30B5C",
        abv: 0,
        pricePerLiter: 100,
        volume: 900,
        tasteProfile: { sweet: 5, sour: 3, bitter: 6, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://magnit.ru/product/1000564010-chillout_bitter_raspberry_napitok_b_a_sil_gaz_0_9l_pl_but?shopCode=992301&shopType=6",
        sourceName: "\u041C\u0430\u0433\u043D\u0438\u0442",
        sourceIcon: MAGNIT_ICON,
        imageUrl: "https://images-foodtech.magnit.ru/fRXO43IG1fHjprgMnRhTZHm7saIvn3tnN9gr-leyHwQ/rs:fit:1600:1600/plain/s3://img-dostavka/uf/5d7/5d7d645e1a4c69d15307f9f959ffa97b/dda8259f267f74e588b57f0c0539492b.jpeg@webp"
      },
      {
        name: "\u041D\u0430\u043F\u0438\u0442\u043E\u043A Bitter Star Bar \u0433\u0440\u0435\u0439\u043F\u0444\u0440\u0443\u0442 1\u043B",
        category: "bitter",
        color: "#FF69B4",
        abv: 0,
        pricePerLiter: 83,
        volume: 1e3,
        tasteProfile: { sweet: 3, sour: 6, bitter: 7, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://magnit.ru/product/1000380593-star_bar_napitok_grapefruit_1l_plastikovaya_butylka_ooo_fkpchf_bobimeks_tm_6?shopCode=992301&shopType=6",
        sourceName: "\u041C\u0430\u0433\u043D\u0438\u0442",
        sourceIcon: MAGNIT_ICON,
        imageUrl: "https://images-foodtech.magnit.ru/fLdMRXBod874ABS3U4TjpUQaJKq5PICff5IjXUBu8lY/rs:fit:1600:1600/plain/s3://img-dostavka/uf/a51/a51bdc702ffc7f0542edf77f3dea7051/9f01db040cda3546fb5d7ff8fcc20e82.jpeg@webp"
      },
      {
        name: "\u0422\u043E\u043D\u0438\u043A \u0441 \u043C\u0430\u043D\u0434\u0430\u0440\u0438\u043D\u043E\u0432\u044B\u043C \u0432\u043A\u0443\u0441\u043E\u043C Rich 1\u043B",
        category: "bitter",
        color: "#FF8C00",
        abv: 0,
        pricePerLiter: 129,
        volume: 1e3,
        tasteProfile: { sweet: 5, sour: 4, bitter: 6, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://magnit.ru/product/1000457198-rich_napitok_b_a_sil_gaz_mandarin_1l_pl_but?shopCode=992301&shopType=6",
        sourceName: "\u041C\u0430\u0433\u043D\u0438\u0442",
        sourceIcon: MAGNIT_ICON,
        imageUrl: "https://images-foodtech.magnit.ru/QRBKT321mWFGlImS15pFZCwlMkFR8uwUQa9OiS3XtyI/rs:fit:1600:1600/plain/s3://img-dostavka/uf/1b0/1b0335c10fbab6465578be6e9a99f6fa/1eec72438aacbde7a6954c3fa593e1a8.jpeg@webp"
      },
      {
        name: "\u0422\u043E\u043D\u0438\u043A Evervess \u0430\u043F\u0435\u0440\u043E\u043B\u044C 1\u043B",
        category: "bitter",
        color: "#FF4500",
        abv: 0,
        pricePerLiter: 115,
        volume: 1e3,
        tasteProfile: { sweet: 4, sour: 3, bitter: 7, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://magnit.ru/product/1000447102-evervess_nap_ital_apero_b_a_sil_gaz_p_b_1l?shopCode=992301&shopType=6",
        sourceName: "\u041C\u0430\u0433\u043D\u0438\u0442",
        sourceIcon: MAGNIT_ICON,
        imageUrl: "https://images-foodtech.magnit.ru/7QwczMSzh7i_MSCh-iL8TRxMyZ-SUbt02MJ8kasPA0M/rs:fit:1600:1600/plain/s3://img-dostavka/uf/554/554e0a83b9d8f0d7e31e56a4b40ad88e/7748372b20de935b43eed00a32d43e89.jpeg@webp"
      },
      {
        name: "\u0422\u043E\u043D\u0438\u043A \u0441 \u0433\u0440\u0430\u043D\u0430\u0442\u043E\u0432\u044B\u043C \u0432\u043A\u0443\u0441\u043E\u043C Rich 1\u043B",
        category: "bitter",
        color: "#8B0000",
        abv: 0,
        pricePerLiter: 129,
        volume: 1e3,
        tasteProfile: { sweet: 5, sour: 3, bitter: 6, alcohol: 0 },
        unit: "ml",
        sourceUrl: "https://magnit.ru/product/1000457200-rich_napitok_b_a_sil_gaz_granat_1l_pl_but?shopCode=992301&shopType=6",
        sourceName: "\u041C\u0430\u0433\u043D\u0438\u0442",
        sourceIcon: MAGNIT_ICON,
        imageUrl: "https://images-foodtech.magnit.ru/PqfaViiCRhU9IAu90va8EW6LxY2ljJ0cLmV2pmRIjds/rs:fit:1600:1600/plain/s3://img-dostavka/uf/681/681466e04037d2c8eed994f5dad259eb/290fc88d01f2331acf47f0f422956eec.jpeg@webp"
      }
    ];
  }
});

// client/src/lib/ingredients-data.ts
var SAMPLE_INGREDIENTS, CATEGORY_STATS;
var init_ingredients_data = __esm({
  "client/src/lib/ingredients-data.ts"() {
    "use strict";
    init_alkoteka_real_products();
    init_krasnoeibeloe_sodas();
    init_krasnoeibeloe_juices();
    init_krasnoeibeloe_beer();
    init_krasnoeibeloe_cognac();
    init_krasnoeibeloe_liqueurs();
    init_krasnoeibeloe_rum();
    init_krasnoeibeloe_tequila();
    init_krasnoeibeloe_cocktails();
    init_krasnoeibeloe_tinctures();
    init_krasnoeibeloe_vodka();
    init_krasnoeibeloe_whiskey();
    init_krasnoeibeloe_sparkling_wine();
    init_krasnoeibeloe_vermouth();
    init_krasnoeibeloe_wine_red();
    init_krasnoeibeloe_wine_white();
    init_krasnoeibeloe_wine_rose();
    init_pyaterochka_energy_drinks();
    init_pyaterochka_fruits();
    init_pyaterochka_bitters();
    init_wildberries_syrups_new();
    init_magnit_bitters();
    SAMPLE_INGREDIENTS = [
      // === РЕАЛЬНЫЕ ТОВАРЫ ALKOTEKA (90 позиций) ===
      ...ALKOTEKA_REAL_PRODUCTS,
      // === ПИВО КРАСНОЕ&БЕЛОЕ (42 позиции) ===
      ...KRASNOEIBELOE_BEER,
      // === КОНЬЯК И БРЕНДИ КРАСНОЕ&БЕЛОЕ (58 позиций) ===
      ...KRASNOEIBELOE_COGNAC,
      // === ЛИКЁРЫ КРАСНОЕ&БЕЛОЕ (24 позиции) ===
      ...KRASNOEIBELOE_LIQUEURS,
      // === РОМ КРАСНОЕ&БЕЛОЕ (10 позиций) ===
      ...KRASNOEIBELOE_RUM,
      // === ТЕКИЛА КРАСНОЕ&БЕЛОЕ (8 позиций) ===
      ...KRASNOEIBELOE_TEQUILA,
      // === НАСТОЙКИ КРАСНОЕ&БЕЛОЕ (37 позиций) ===
      ...KRASNOEIBELOE_TINCTURES,
      // === ВОДКА КРАСНОЕ&БЕЛОЕ (24 позиции) ===
      ...KRASNOEIBELOE_VODKA,
      // === ВИСКИ/БУРБОН КРАСНОЕ&БЕЛОЕ (68 позиций) ===
      ...KRASNOEIBELOE_WHISKEY,
      // === ВИНО ИГРИСТОЕ КРАСНОЕ&БЕЛОЕ (16 pozicij) ===
      ...KRASNOEIBELOE_SPARKLING_WINE,
      // === ВЕРМУТ КРАСНОЕ&БЕЛОЕ (8 pozicij) ===
      ...KRASNOEIBELOE_VERMOUTH,
      // === ВИНО КРАСНОЕ КРАСНОЕ&БЕЛОЕ (79 позиций) ===
      ...KRASNOEIBELOE_WINE_RED,
      // === ВИНО БЕЛОЕ КРАСНОЕ&БЕЛОЕ (78 позиций) ===
      ...KRASNOEIBELOE_WINE_WHITE,
      // === ВИНО РОЗОВОЕ КРАСНОЕ&БЕЛОЕ (9 позиций) ===
      ...KRASNOEIBELOE_WINE_ROSE,
      // === ГАЗИРОВАННЫЕ НАПИТКИ КРАСНОЕ&БЕЛОЕ (57 позиций) ===
      ...KRASNOEIBELOE_SODAS,
      // === КОКТЕЙЛИ КРАСНОЕ&БЕЛОЕ (18 позиций) ===
      ...KRASNOEIBELOE_COCKTAILS,
      // === СОКИ И НЕКТАРЫ КРАСНОЕ&БЕЛОЕ (43 pozicii) ===
      ...KRASNOEIBELOE_JUICES,
      // === ЭНЕРГЕТИЧЕСКИЕ НАПИТКИ ПЯТЁРОЧКА (22 позиции) ===
      ...PYATEROCHKA_ENERGY_DRINKS,
      // === ФРУКТЫ И ЯГОДЫ ПЯТЁРОЧКА (46 позиций) ===
      ...PYATEROCHKA_FRUITS,
      // === СИРОПЫ WILDBERRIES (152 позиции) ===
      ...WILDBERRIES_SYRUPS,
      // === БИТТЕРЫ ===
      {
        name: "\u0410\u043D\u0433\u043E\u0441\u0442\u0443\u0440\u0430",
        category: "bitter",
        color: "#8B0000",
        abv: 45,
        pricePerLiter: 2e3,
        tasteProfile: { sweet: 1, sour: 0, bitter: 9, alcohol: 8 },
        unit: "ml"
      },
      {
        name: "\u041F\u0435\u0439\u0448\u043E \u0431\u0438\u0442\u0442\u0435\u0440",
        category: "bitter",
        color: "#8B4513",
        abv: 35,
        pricePerLiter: 2500,
        tasteProfile: { sweet: 0, sour: 0, bitter: 8, alcohol: 6 },
        unit: "ml"
      },
      // === БИТТЕРЫ И ТОНИКИ ПЯТЁРОЧКА (4 позиции) ===
      ...PYATEROCHKA_BITTERS,
      // === БИТТЕРЫ И ТОНИКИ МАГНИТ (5 позиций) ===
      ...MAGNIT_BITTERS,
      // === МИКСЕРЫ ===
      {
        name: "\u0422\u043E\u043D\u0438\u043A",
        category: "mixer",
        color: "#F0F8FF",
        abv: 0,
        pricePerLiter: 150,
        tasteProfile: { sweet: 2, sour: 1, bitter: 4, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u0421\u043E\u0434\u043E\u0432\u0430\u044F",
        category: "mixer",
        color: "#F0F8FF",
        abv: 0,
        pricePerLiter: 80,
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u041A\u043E\u043A\u0430-\u043A\u043E\u043B\u0430",
        category: "mixer",
        color: "#2F1B14",
        abv: 0,
        pricePerLiter: 120,
        tasteProfile: { sweet: 8, sour: 1, bitter: 1, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u0418\u043C\u0431\u0438\u0440\u043D\u043E\u0435 \u043F\u0438\u0432\u043E",
        category: "mixer",
        color: "#DAA520",
        abv: 0,
        pricePerLiter: 200,
        tasteProfile: { sweet: 4, sour: 2, bitter: 3, alcohol: 0 },
        unit: "ml"
      },
      // === ДЕКОР ===
      {
        name: "\u041E\u043B\u0438\u0432\u043A\u0438",
        category: "garnish",
        color: "#808000",
        abv: 0,
        pricePerLiter: 800,
        tasteProfile: { sweet: 0, sour: 2, bitter: 3, alcohol: 0 },
        unit: "piece"
      },
      // Ice and others
      {
        name: "\u041B\u0451\u0434",
        category: "ice",
        color: "#E0E0E0",
        abv: 0,
        pricePerLiter: 50,
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 },
        unit: "g"
      }
    ];
    CATEGORY_STATS = {
      alcohol: SAMPLE_INGREDIENTS.filter((i) => i.category === "alcohol").length,
      juice: SAMPLE_INGREDIENTS.filter((i) => i.category === "juice").length,
      syrup: SAMPLE_INGREDIENTS.filter((i) => i.category === "syrup").length,
      mixer: SAMPLE_INGREDIENTS.filter((i) => i.category === "mixer").length,
      fruit: SAMPLE_INGREDIENTS.filter((i) => i.category === "fruit").length,
      garnish: SAMPLE_INGREDIENTS.filter((i) => i.category === "garnish").length,
      bitter: SAMPLE_INGREDIENTS.filter((i) => i.category === "bitter").length,
      ice: SAMPLE_INGREDIENTS.filter((i) => i.category === "ice").length,
      energy_drink: SAMPLE_INGREDIENTS.filter((i) => i.category === "energy_drink").length,
      total: SAMPLE_INGREDIENTS.length
    };
  }
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import ws from "ws";
var db, pool;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    db = null;
    pool = null;
    if (process.env.DATABASE_URL) {
      const isPostgres = process.env.DATABASE_URL.startsWith("postgresql");
      if (isPostgres) {
        pool = new Pool({ connectionString: process.env.DATABASE_URL });
        db = drizzleNeon({ client: pool, schema: schema_exports });
        console.log("Connected to PostgreSQL database");
      } else {
        const sqlite = new Database("./dev.db");
        db = drizzleSqlite(sqlite, { schema: schema_exports });
        console.log("Connected to SQLite database");
      }
    } else {
      console.log("No DATABASE_URL provided - running in memory storage mode");
      db = {
        select: () => ({ from: () => ({ limit: () => [] }) }),
        insert: () => ({ values: () => Promise.resolve() })
      };
    }
  }
});

// server/storage.ts
import { nanoid } from "nanoid";
import { eq, and, desc, sql } from "drizzle-orm";
var MemoryStorage, PostgresStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_ingredients_data();
    init_db();
    MemoryStorage = class {
      users = /* @__PURE__ */ new Map();
      ingredients = /* @__PURE__ */ new Map();
      glassTypes = /* @__PURE__ */ new Map();
      recipes = /* @__PURE__ */ new Map();
      recipeIngredients = /* @__PURE__ */ new Map();
      userFavorites = /* @__PURE__ */ new Map();
      recipeRatings = /* @__PURE__ */ new Map();
      nextId = { ingredient: 1, glassType: 1, rating: 1, favorite: 1, recipeIngredient: 1 };
      constructor() {
        this.initializeData();
      }
      initializeData() {
        const sampleIngredients = SAMPLE_INGREDIENTS.map((ing) => ({
          name: ing.name,
          category: ing.category,
          subtype: ing.subtype || null,
          color: ing.color,
          abv: String(ing.abv || 0),
          pricePerLiter: String(ing.pricePerLiter || 0),
          tasteProfile: ing.tasteProfile,
          unit: ing.unit,
          sourceUrl: ing.sourceUrl || null,
          sourceName: ing.sourceName || null,
          sourceIcon: ing.sourceIcon || null,
          imageUrl: ing.imageUrl || null,
          volume: ing.volume || null
        }));
        console.log(`\u{1F379} \u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F MemoryStorage: \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E ${sampleIngredients.length} \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432`);
        sampleIngredients.forEach((ingredient) => {
          const id = this.nextId.ingredient++;
          this.ingredients.set(id, {
            id,
            ...ingredient,
            abv: ingredient.abv || null,
            unit: ingredient.unit || "ml",
            createdAt: /* @__PURE__ */ new Date()
          });
        });
        const sampleGlassTypes2 = [
          { name: "\u0428\u043E\u0442", capacity: 50, shape: "shot" },
          { name: "\u041E\u043B\u0434 \u0424\u044D\u0448\u043D", capacity: 300, shape: "old-fashioned" },
          { name: "\u0425\u0430\u0439\u0431\u043E\u043B", capacity: 270, shape: "highball" },
          { name: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u044C\u043D\u0430\u044F \u0440\u044E\u043C\u043A\u0430", capacity: 150, shape: "martini" },
          { name: "\u041C\u0430\u0440\u0433\u0430\u0440\u0438\u0442\u0430", capacity: 250, shape: "margarita" },
          { name: "\u0425\u0430\u0440\u0440\u0438\u043A\u0435\u0439\u043D", capacity: 450, shape: "hurricane" },
          { name: "\u0422\u0443\u043C\u0431\u043B\u0435\u0440", capacity: 300, shape: "tumbler" },
          { name: "\u041A\u043E\u043D\u044C\u044F\u0447\u043D\u044B\u0439 \u0431\u043E\u043A\u0430\u043B", capacity: 350, shape: "snifter" },
          { name: "\u0424\u0443\u0436\u0435\u0440 \u0434\u043B\u044F \u0448\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0433\u043E", capacity: 170, shape: "champagne-flute" },
          { name: "\u041F\u0438\u0432\u043D\u0430\u044F \u043A\u0440\u0443\u0436\u043A\u0430", capacity: 500, shape: "beer-mug" },
          { name: "\u0411\u043E\u043A\u0430\u043B \u0434\u043B\u044F \u043A\u0440\u0430\u0441\u043D\u043E\u0433\u043E \u0432\u0438\u043D\u0430", capacity: 300, shape: "red-wine" },
          { name: "\u0411\u043E\u043A\u0430\u043B \u0434\u043B\u044F \u0431\u0435\u043B\u043E\u0433\u043E \u0432\u0438\u043D\u0430", capacity: 260, shape: "white-wine" },
          { name: "\u0411\u043E\u043A\u0430\u043B \u0441\u0430\u0443\u044D\u0440", capacity: 120, shape: "sour" },
          { name: "\u0427\u0430\u0448\u0430 \u0434\u043B\u044F \u0448\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0433\u043E", capacity: 180, shape: "champagne-saucer" }
        ];
        sampleGlassTypes2.forEach((glassType) => {
          const id = this.nextId.glassType++;
          this.glassTypes.set(id, {
            id,
            ...glassType,
            createdAt: /* @__PURE__ */ new Date()
          });
        });
      }
      // User operations
      async getUser(id) {
        return this.users.get(id);
      }
      async getUserByEmail(email) {
        return Array.from(this.users.values()).find((user) => user.email === email);
      }
      async getUserByGoogleId(googleId) {
        return Array.from(this.users.values()).find((user) => user.googleId === googleId);
      }
      async upsertUser(userData) {
        const user = {
          id: userData.id,
          email: userData.email || null,
          nickname: userData.nickname,
          profileImageUrl: userData.profileImageUrl || null,
          googleId: userData.googleId || null,
          passwordHash: userData.passwordHash || null,
          emailVerified: userData.emailVerified || false,
          updatedAt: /* @__PURE__ */ new Date(),
          createdAt: this.users.get(userData.id)?.createdAt || /* @__PURE__ */ new Date()
        };
        this.users.set(userData.id, user);
        return user;
      }
      async updateUserProfile(userId, data) {
        const user = this.users.get(userId);
        if (!user) {
          return void 0;
        }
        const updatedUser = {
          ...user,
          nickname: data.nickname !== void 0 ? data.nickname : user.nickname,
          profileImageUrl: data.profileImageUrl !== void 0 ? data.profileImageUrl : user.profileImageUrl,
          updatedAt: /* @__PURE__ */ new Date()
        };
        this.users.set(userId, updatedUser);
        return updatedUser;
      }
      // Ingredient operations
      async getIngredients() {
        return Array.from(this.ingredients.values()).sort(
          (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
        );
      }
      async getIngredientsByCategory(category) {
        return Array.from(this.ingredients.values()).filter((ingredient) => ingredient.category === category).sort((a, b) => a.name.localeCompare(b.name));
      }
      async createIngredient(ingredient) {
        const id = this.nextId.ingredient++;
        const newIngredient = {
          id,
          ...ingredient,
          abv: ingredient.abv || null,
          unit: ingredient.unit || "ml",
          createdAt: /* @__PURE__ */ new Date()
        };
        this.ingredients.set(id, newIngredient);
        return newIngredient;
      }
      // Glass type operations
      async getGlassTypes() {
        return Array.from(this.glassTypes.values()).sort((a, b) => a.name.localeCompare(b.name));
      }
      async getGlassType(id) {
        return this.glassTypes.get(id);
      }
      async createGlassType(glassType) {
        const id = this.nextId.glassType++;
        const newGlassType = {
          id,
          ...glassType,
          createdAt: /* @__PURE__ */ new Date()
        };
        this.glassTypes.set(id, newGlassType);
        return newGlassType;
      }
      // Recipe operations
      async getRecipes(limit = 50, offset = 0) {
        const allRecipes = Array.from(this.recipes.values()).sort((a, b) => {
          const ratingDiff = parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
          if (ratingDiff !== 0) return ratingDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return allRecipes.slice(offset, offset + limit);
      }
      async getRecipe(id) {
        return this.recipes.get(id);
      }
      async getRecipeWithIngredients(id) {
        const recipe = await this.getRecipe(id);
        if (!recipe) return void 0;
        const ingredients2 = await this.getRecipeIngredients(id);
        return { ...recipe, ingredients: ingredients2 };
      }
      async getUserRecipes(userId) {
        return Array.from(this.recipes.values()).filter((recipe) => recipe.createdBy === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      async createRecipe(recipe) {
        const id = recipe.id || nanoid();
        const newRecipe = {
          ...recipe,
          id,
          createdBy: recipe.createdBy || null,
          glassTypeId: recipe.glassTypeId || null,
          description: recipe.description || null,
          instructions: recipe.instructions || null,
          difficulty: recipe.difficulty || "easy",
          isPublic: recipe.isPublic !== false,
          rating: recipe.rating || "0",
          ratingCount: recipe.ratingCount || 0,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        this.recipes.set(id, newRecipe);
        return newRecipe;
      }
      async updateRecipe(id, recipe) {
        const existing = this.recipes.get(id);
        if (!existing) {
          throw new Error("Recipe not found");
        }
        const updated = {
          ...existing,
          ...recipe,
          updatedAt: /* @__PURE__ */ new Date()
        };
        this.recipes.set(id, updated);
        return updated;
      }
      async deleteRecipe(id) {
        this.recipes.delete(id);
        this.recipeIngredients.delete(id);
        for (const [userId, favorites] of Array.from(this.userFavorites.entries())) {
          const filtered = favorites.filter((fav) => fav.recipeId !== id);
          this.userFavorites.set(userId, filtered);
        }
        this.recipeRatings.delete(id);
      }
      async searchRecipes(query, category, difficulty) {
        return Array.from(this.recipes.values()).filter((recipe) => {
          if (query) {
            const searchTerm = query.toLowerCase();
            const nameMatch = recipe.name.toLowerCase().includes(searchTerm);
            const descMatch = recipe.description?.toLowerCase().includes(searchTerm);
            if (!nameMatch && !descMatch) return false;
          }
          if (category && recipe.category !== category) return false;
          if (difficulty && recipe.difficulty !== difficulty) return false;
          return true;
        }).sort((a, b) => {
          const ratingDiff = parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
          if (ratingDiff !== 0) return ratingDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      }
      // Recipe ingredient operations
      async getRecipeIngredients(recipeId) {
        const recipeIngs = this.recipeIngredients.get(recipeId) || [];
        return recipeIngs.map((ri) => ({
          ...ri,
          ingredient: this.ingredients.get(ri.ingredientId)
        })).filter((ri) => ri.ingredient).sort((a, b) => a.order - b.order);
      }
      async createRecipeIngredient(recipeIngredient) {
        const id = this.nextId.recipeIngredient++;
        const newRecipeIngredient = {
          id,
          ...recipeIngredient,
          recipeId: recipeIngredient.recipeId || null,
          ingredientId: recipeIngredient.ingredientId || null,
          createdAt: /* @__PURE__ */ new Date()
        };
        const existing = this.recipeIngredients.get(recipeIngredient.recipeId) || [];
        existing.push(newRecipeIngredient);
        this.recipeIngredients.set(recipeIngredient.recipeId, existing);
        return newRecipeIngredient;
      }
      async deleteRecipeIngredients(recipeId) {
        this.recipeIngredients.delete(recipeId);
      }
      // User favorite operations
      async getUserFavorites(userId) {
        const favorites = this.userFavorites.get(userId) || [];
        return favorites.map((fav) => ({
          ...fav,
          recipe: this.recipes.get(fav.recipeId)
        })).filter((fav) => fav.recipe).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      async addUserFavorite(userId, recipeId) {
        const id = this.nextId.favorite++;
        const favorite = {
          id,
          userId,
          recipeId,
          createdAt: /* @__PURE__ */ new Date()
        };
        const existing = this.userFavorites.get(userId) || [];
        existing.push(favorite);
        this.userFavorites.set(userId, existing);
        return favorite;
      }
      async removeUserFavorite(userId, recipeId) {
        const existing = this.userFavorites.get(userId) || [];
        const filtered = existing.filter((fav) => fav.recipeId !== recipeId);
        this.userFavorites.set(userId, filtered);
      }
      async isUserFavorite(userId, recipeId) {
        const favorites = this.userFavorites.get(userId) || [];
        return favorites.some((fav) => fav.recipeId === recipeId);
      }
      // Recipe rating operations
      async getRecipeRatings(recipeId) {
        return (this.recipeRatings.get(recipeId) || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      async createRecipeRating(rating) {
        const id = this.nextId.rating++;
        const newRating = {
          id,
          ...rating,
          recipeId: rating.recipeId || null,
          userId: rating.userId || null,
          review: rating.review || null,
          createdAt: /* @__PURE__ */ new Date()
        };
        const existing = this.recipeRatings.get(rating.recipeId) || [];
        existing.push(newRating);
        this.recipeRatings.set(rating.recipeId, existing);
        const allRatings = await this.getRecipeRatings(rating.recipeId);
        const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        const recipe = this.recipes.get(rating.recipeId);
        if (recipe) {
          const updatedRecipe = {
            ...recipe,
            rating: avgRating.toFixed(2),
            ratingCount: allRatings.length
          };
          this.recipes.set(rating.recipeId, updatedRecipe);
        }
        return newRating;
      }
      async updateRecipeRating(userId, recipeId, rating, review) {
        const ratings = this.recipeRatings.get(recipeId) || [];
        const existingIndex = ratings.findIndex((r) => r.userId === userId);
        if (existingIndex === -1) {
          throw new Error("Rating not found");
        }
        ratings[existingIndex] = {
          ...ratings[existingIndex],
          rating,
          review: review || null
        };
        this.recipeRatings.set(recipeId, ratings);
        const allRatings = await this.getRecipeRatings(recipeId);
        const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        const recipe = this.recipes.get(recipeId);
        if (recipe) {
          const updatedRecipe = {
            ...recipe,
            rating: avgRating.toFixed(2),
            ratingCount: allRatings.length
          };
          this.recipes.set(recipeId, updatedRecipe);
        }
        return ratings[existingIndex];
      }
      async getUserRecipeRating(userId, recipeId) {
        const ratings = this.recipeRatings.get(recipeId) || [];
        return ratings.find((r) => r.userId === userId);
      }
      // Admin methods for MemoryStorage
      async getUserById(id) {
        return this.getUser(id);
      }
      async getUsers() {
        return Array.from(this.users.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      async getUsersCount() {
        return this.users.size;
      }
      async getRecentUsers(limit) {
        const users2 = await this.getUsers();
        return users2.slice(0, limit);
      }
      async updateIngredient(id, ingredient) {
        const existing = this.ingredients.get(id);
        if (!existing) return void 0;
        const updated = {
          ...existing,
          ...ingredient,
          id,
          createdAt: existing.createdAt
        };
        this.ingredients.set(id, updated);
        return updated;
      }
      async deleteIngredient(id) {
        return this.ingredients.delete(id);
      }
      async getIngredientsCount() {
        return this.ingredients.size;
      }
      async getRecipesCount() {
        return this.recipes.size;
      }
      async getRecentRecipes(limit) {
        const recipes2 = Array.from(this.recipes.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return recipes2.slice(0, limit);
      }
    };
    PostgresStorage = class {
      // User operations
      async getUser(id) {
        const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return result[0];
      }
      async getUserByEmail(email) {
        const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
        return result[0];
      }
      async getUserByGoogleId(googleId) {
        const result = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);
        return result[0];
      }
      async upsertUser(user) {
        const existingUser = user.email ? await this.getUserByEmail(user.email) : user.googleId ? await this.getUserByGoogleId(user.googleId) : null;
        if (existingUser) {
          const result = await db.update(users).set({ ...user, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, existingUser.id)).returning();
          return result[0];
        } else {
          const newUser = {
            ...user,
            id: user.id || nanoid(),
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          };
          const result = await db.insert(users).values(newUser).returning();
          return result[0];
        }
      }
      \u0442;
      // Ingredient operations
      async getIngredients() {
        return await db.select().from(ingredients);
      }
      async getIngredientsByCategory(category) {
        return await db.select().from(ingredients).where(eq(ingredients.category, category));
      }
      async createIngredient(ingredient) {
        const result = await db.insert(ingredients).values(ingredient).returning();
        return result[0];
      }
      // Glass type operations
      async getGlassTypes() {
        return await db.select().from(glassTypes);
      }
      async getGlassType(id) {
        const result = await db.select().from(glassTypes).where(eq(glassTypes.id, id)).limit(1);
        return result[0];
      }
      async createGlassType(glassType) {
        const result = await db.insert(glassTypes).values(glassType).returning();
        return result[0];
      }
      // Recipe operations
      async getRecipes(limit = 50, offset = 0) {
        return await db.select().from(recipes).orderBy(desc(recipes.createdAt)).limit(limit).offset(offset);
      }
      async getRecipe(id) {
        const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
        return result[0];
      }
      async getRecipeWithIngredients(id) {
        const recipe = await this.getRecipe(id);
        if (!recipe) return void 0;
        const recipeIngredientsData = await db.select().from(recipeIngredients).leftJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id)).where(eq(recipeIngredients.recipeId, id)).orderBy(recipeIngredients.order);
        const ingredientsWithData = recipeIngredientsData.map((row) => ({
          ...row.recipe_ingredients,
          ingredient: row.ingredients
        }));
        return {
          ...recipe,
          ingredients: ingredientsWithData
        };
      }
      async getUserRecipes(userId) {
        return await db.select().from(recipes).where(eq(recipes.createdBy, userId)).orderBy(desc(recipes.createdAt));
      }
      async createRecipe(recipe) {
        const newRecipe = {
          ...recipe,
          id: recipe.id || nanoid(),
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        const result = await db.insert(recipes).values(newRecipe).returning();
        return result[0];
      }
      async updateRecipe(id, recipe) {
        const result = await db.update(recipes).set({ ...recipe, updatedAt: /* @__PURE__ */ new Date() }).where(eq(recipes.id, id)).returning();
        return result[0];
      }
      async deleteRecipe(id) {
        await db.delete(recipes).where(eq(recipes.id, id));
      }
      async searchRecipes(query, category, difficulty) {
        let queryBuilder = db.select().from(recipes);
        const conditions = [];
        if (query) {
          conditions.push(
            sql`${recipes.name} ILIKE ${"%" + query + "%"} OR ${recipes.description} ILIKE ${"%" + query + "%"}`
          );
        }
        if (category) {
          conditions.push(eq(recipes.category, category));
        }
        if (difficulty) {
          conditions.push(eq(recipes.difficulty, difficulty));
        }
        if (conditions.length > 0) {
          queryBuilder = queryBuilder.where(and(...conditions));
        }
        return await queryBuilder.orderBy(desc(recipes.rating), desc(recipes.createdAt)).limit(50);
      }
      // Recipe ingredient operations
      async getRecipeIngredients(recipeId) {
        const result = await db.select().from(recipeIngredients).leftJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id)).where(eq(recipeIngredients.recipeId, recipeId)).orderBy(recipeIngredients.order);
        return result.map((row) => ({
          ...row.recipe_ingredients,
          ingredient: row.ingredients
        }));
      }
      async createRecipeIngredient(recipeIngredient) {
        const result = await db.insert(recipeIngredients).values(recipeIngredient).returning();
        return result[0];
      }
      async deleteRecipeIngredients(recipeId) {
        await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeId));
      }
      // User favorite operations
      async getUserFavorites(userId) {
        const result = await db.select().from(userFavorites).leftJoin(recipes, eq(userFavorites.recipeId, recipes.id)).where(eq(userFavorites.userId, userId)).orderBy(desc(userFavorites.createdAt));
        return result.map((row) => ({
          ...row.user_favorites,
          recipe: row.recipes
        }));
      }
      async addUserFavorite(userId, recipeId) {
        const favorite = {
          userId,
          recipeId,
          createdAt: /* @__PURE__ */ new Date()
        };
        const result = await db.insert(userFavorites).values(favorite).returning();
        return result[0];
      }
      async removeUserFavorite(userId, recipeId) {
        await db.delete(userFavorites).where(and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.recipeId, recipeId)
        ));
      }
      async isUserFavorite(userId, recipeId) {
        const result = await db.select().from(userFavorites).where(and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.recipeId, recipeId)
        )).limit(1);
        return result.length > 0;
      }
      // Recipe rating operations
      async getRecipeRatings(recipeId) {
        return await db.select().from(recipeRatings).where(eq(recipeRatings.recipeId, recipeId)).orderBy(desc(recipeRatings.createdAt));
      }
      async createRecipeRating(rating) {
        const newRating = {
          ...rating,
          createdAt: /* @__PURE__ */ new Date()
        };
        const result = await db.insert(recipeRatings).values(newRating).returning();
        await this.updateRecipeAverageRating(rating.recipeId);
        return result[0];
      }
      async updateRecipeRating(userId, recipeId, rating, review) {
        const result = await db.update(recipeRatings).set({ rating, review }).where(and(
          eq(recipeRatings.userId, userId),
          eq(recipeRatings.recipeId, recipeId)
        )).returning();
        await this.updateRecipeAverageRating(recipeId);
        return result[0];
      }
      async getUserRecipeRating(userId, recipeId) {
        const result = await db.select().from(recipeRatings).where(and(
          eq(recipeRatings.userId, userId),
          eq(recipeRatings.recipeId, recipeId)
        )).limit(1);
        return result[0];
      }
      async updateRecipeAverageRating(recipeId) {
        const ratings = await this.getRecipeRatings(recipeId);
        if (ratings.length > 0) {
          const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
          await db.update(recipes).set({
            rating: avgRating.toFixed(2),
            ratingCount: ratings.length
          }).where(eq(recipes.id, recipeId));
        }
      }
    };
    storage = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgresql") ? new PostgresStorage() : new MemoryStorage();
    console.log(`Using ${storage.constructor.name} for data persistence`);
  }
});

// server/admin-middleware.ts
var admin_middleware_exports = {};
__export(admin_middleware_exports, {
  PERMISSIONS: () => PERMISSIONS,
  UserRole: () => UserRole,
  adminAuth: () => adminAuth,
  canEditResource: () => canEditResource,
  getUserPermissions: () => getUserPermissions,
  hasPermission: () => hasPermission,
  logAdminAction: () => logAdminAction,
  requireAdmin: () => requireAdmin,
  requireModerator: () => requireModerator,
  requirePermission: () => requirePermission
});
async function adminAuth(req, res, next) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0430\u0443\u0442\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u044F",
        code: "AUTHENTICATION_REQUIRED"
      });
    }
    const user = await storage.getUserById(req.user.id);
    if (!user) {
      return res.status(401).json({
        message: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D",
        code: "USER_NOT_FOUND"
      });
    }
    req.user.role = user.role || "user" /* USER */;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(500).json({
      message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u043F\u0440\u0430\u0432 \u0434\u043E\u0441\u0442\u0443\u043F\u0430",
      code: "AUTH_ERROR"
    });
  }
}
function requirePermission(permission) {
  return (req, res, next) => {
    const userRole = req.user?.role || "user" /* USER */;
    const userPermissions = PERMISSIONS[userRole] || [];
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        message: "\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u043F\u0440\u0430\u0432 \u0434\u043E\u0441\u0442\u0443\u043F\u0430",
        code: "INSUFFICIENT_PERMISSIONS",
        required: permission,
        userRole
      });
    }
    next();
  };
}
function requireAdmin(req, res, next) {
  const userRole = req.user?.role || "user" /* USER */;
  if (userRole !== "admin" /* ADMIN */) {
    return res.status(403).json({
      message: "\u0422\u0440\u0435\u0431\u0443\u044E\u0442\u0441\u044F \u043F\u0440\u0430\u0432\u0430 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430",
      code: "ADMIN_REQUIRED",
      userRole
    });
  }
  next();
}
function requireModerator(req, res, next) {
  const userRole = req.user?.role || "user" /* USER */;
  if (userRole !== "moderator" /* MODERATOR */ && userRole !== "admin" /* ADMIN */) {
    return res.status(403).json({
      message: "\u0422\u0440\u0435\u0431\u0443\u044E\u0442\u0441\u044F \u043F\u0440\u0430\u0432\u0430 \u043C\u043E\u0434\u0435\u0440\u0430\u0442\u043E\u0440\u0430",
      code: "MODERATOR_REQUIRED",
      userRole
    });
  }
  next();
}
function canEditResource(resourceUserId, currentUserId, currentUserRole) {
  if (currentUserRole === "admin" /* ADMIN */) {
    return true;
  }
  if (currentUserRole === "moderator" /* MODERATOR */) {
    return true;
  }
  return resourceUserId === currentUserId;
}
function getUserPermissions(userRole) {
  return PERMISSIONS[userRole] || PERMISSIONS["user" /* USER */];
}
function hasPermission(userRole, permission) {
  const permissions = getUserPermissions(userRole);
  return permissions.includes(permission);
}
function logAdminAction(action) {
  return (req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`[ADMIN ACTION] ${action}`, {
          userId: req.user?.id,
          userEmail: req.user?.email,
          userRole: req.user?.role,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          ip: req.ip,
          userAgent: req.get("User-Agent")
        });
      }
      return originalSend.call(this, data);
    };
    next();
  };
}
var UserRole, PERMISSIONS;
var init_admin_middleware = __esm({
  "server/admin-middleware.ts"() {
    "use strict";
    init_storage();
    UserRole = /* @__PURE__ */ ((UserRole2) => {
      UserRole2["USER"] = "user";
      UserRole2["MODERATOR"] = "moderator";
      UserRole2["ADMIN"] = "admin";
      return UserRole2;
    })(UserRole || {});
    PERMISSIONS = {
      ["user" /* USER */]: [
        "read:recipes",
        "create:recipes",
        "update:own_recipes",
        "delete:own_recipes",
        "read:ingredients",
        "create:favorites",
        "create:ratings"
      ],
      ["moderator" /* MODERATOR */]: [
        "read:recipes",
        "create:recipes",
        "update:recipes",
        "delete:recipes",
        "read:ingredients",
        "create:ingredients",
        "update:ingredients",
        "read:users",
        "moderate:content"
      ],
      ["admin" /* ADMIN */]: [
        "read:recipes",
        "create:recipes",
        "update:recipes",
        "delete:recipes",
        "read:ingredients",
        "create:ingredients",
        "update:ingredients",
        "delete:ingredients",
        "read:users",
        "update:users",
        "delete:users",
        "manage:system",
        "access:admin_panel"
      ]
    };
  }
});

// client/src/lib/alkoteka-wines-data.ts
var ALKOTEKA_WINES, ALKOTEKA_STATS;
var init_alkoteka_wines_data = __esm({
  "client/src/lib/alkoteka-wines-data.ts"() {
    "use strict";
    ALKOTEKA_WINES = [
      // Вставляйте сюда результаты парсинга
      // Пример использования:
      // 1. Запустите: npm run parse:alkoteka "https://alkoteka.com/product/..."
      // 2. Скопируйте вывод скрипта
      // 3. Вставьте сюда
      // Пустой массив - заполните реальными данными через парсер
    ];
    ALKOTEKA_STATS = {
      totalWines: ALKOTEKA_WINES.length,
      red: 0,
      white: 0,
      rose: 0,
      sparkling: 0,
      fortified: 0
    };
  }
});

// client/src/lib/extended-ingredients-data.ts
var EXTENDED_INGREDIENTS, EXTENDED_GLASS_TYPES, CATEGORY_STATS2;
var init_extended_ingredients_data = __esm({
  "client/src/lib/extended-ingredients-data.ts"() {
    "use strict";
    init_alkoteka_wines_data();
    EXTENDED_INGREDIENTS = [
      // === ВОДКА ===
      {
        name: "\u0412\u043E\u0434\u043A\u0430 \u0420\u0443\u0441\u0441\u043A\u0438\u0439 \u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442",
        category: "alcohol",
        color: "#FFFFFF",
        abv: 40,
        pricePerLiter: 1200,
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 },
        unit: "ml"
      },
      {
        name: "\u0412\u043E\u0434\u043A\u0430 \u0411\u0435\u043B\u0443\u0433\u0430",
        category: "alcohol",
        color: "#FFFFFF",
        abv: 40,
        pricePerLiter: 2500,
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 },
        unit: "ml"
      },
      {
        name: "\u0412\u043E\u0434\u043A\u0430 \u0425\u043E\u0440\u0442\u0438\u0446\u0430",
        category: "alcohol",
        color: "#FFFFFF",
        abv: 40,
        pricePerLiter: 800,
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 },
        unit: "ml"
      },
      // === ВИСКИ ===
      {
        name: "\u0414\u0436\u0435\u043A \u0414\u044D\u043D\u0438\u044D\u043B\u0441",
        category: "alcohol",
        color: "#D2691E",
        abv: 40,
        pricePerLiter: 3500,
        tasteProfile: { sweet: 2, sour: 0, bitter: 4, alcohol: 9 },
        unit: "ml"
      },
      {
        name: "\u0414\u0436\u0435\u0439\u043C\u0441\u043E\u043D",
        category: "alcohol",
        color: "#DAA520",
        abv: 40,
        pricePerLiter: 2800,
        tasteProfile: { sweet: 1, sour: 0, bitter: 3, alcohol: 9 },
        unit: "ml"
      },
      {
        name: "\u0411\u0430\u043B\u043B\u0430\u043D\u0442\u0430\u0439\u043D\u0441",
        category: "alcohol",
        color: "#CD853F",
        abv: 40,
        pricePerLiter: 2200,
        tasteProfile: { sweet: 1, sour: 0, bitter: 4, alcohol: 9 },
        unit: "ml"
      },
      {
        name: "\u0427\u0438\u0432\u0430\u0441 \u0420\u0438\u0433\u0430\u043B",
        category: "alcohol",
        color: "#B8860B",
        abv: 40,
        pricePerLiter: 4500,
        tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 9 },
        unit: "ml"
      },
      // === ДЖИН ===
      {
        name: "\u0411\u043E\u043C\u0431\u0435\u0439 \u0421\u0430\u043F\u0444\u0438\u0440",
        category: "alcohol",
        color: "#F0F8FF",
        abv: 47,
        pricePerLiter: 2800,
        tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 },
        unit: "ml"
      },
      {
        name: "\u0422\u0430\u043D\u043A\u0435\u0440\u0435\u0439",
        category: "alcohol",
        color: "#F8F8FF",
        abv: 43,
        pricePerLiter: 2500,
        tasteProfile: { sweet: 0, sour: 0, bitter: 4, alcohol: 9 },
        unit: "ml"
      },
      {
        name: "\u0411\u0438\u0444\u0438\u0442\u0435\u0440",
        category: "alcohol",
        color: "#F5F5F5",
        abv: 40,
        pricePerLiter: 1800,
        tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 },
        unit: "ml"
      },
      // === РОМ ===
      {
        name: "\u0411\u0430\u043A\u0430\u0440\u0434\u0438 \u0411\u0435\u043B\u044B\u0439",
        category: "alcohol",
        color: "#FFFACD",
        abv: 40,
        pricePerLiter: 1800,
        tasteProfile: { sweet: 2, sour: 0, bitter: 0, alcohol: 8 },
        unit: "ml"
      },
      {
        name: "\u041A\u0430\u043F\u0438\u0442\u0430\u043D \u041C\u043E\u0440\u0433\u0430\u043D",
        category: "alcohol",
        color: "#8B4513",
        abv: 35,
        pricePerLiter: 2200,
        tasteProfile: { sweet: 4, sour: 0, bitter: 1, alcohol: 7 },
        unit: "ml"
      },
      {
        name: "\u0425\u0430\u0432\u0430\u043D\u0430 \u041A\u043B\u0443\u0431",
        category: "alcohol",
        color: "#D2691E",
        abv: 40,
        pricePerLiter: 2500,
        tasteProfile: { sweet: 3, sour: 0, bitter: 1, alcohol: 8 },
        unit: "ml"
      },
      // === ТЕКИЛА ===
      {
        name: "\u0425\u043E\u0441\u0435 \u041A\u0443\u044D\u0440\u0432\u043E",
        category: "alcohol",
        color: "#F5F5DC",
        abv: 38,
        pricePerLiter: 2e3,
        tasteProfile: { sweet: 0, sour: 1, bitter: 2, alcohol: 8 },
        unit: "ml"
      },
      {
        name: "\u0421\u0430\u0443\u0437\u0430",
        category: "alcohol",
        color: "#F5DEB3",
        abv: 38,
        pricePerLiter: 1800,
        tasteProfile: { sweet: 0, sour: 1, bitter: 2, alcohol: 8 },
        unit: "ml"
      },
      {
        name: "\u041F\u0430\u0442\u0440\u043E\u043D",
        category: "alcohol",
        color: "#FFFAF0",
        abv: 40,
        pricePerLiter: 5500,
        tasteProfile: { sweet: 1, sour: 1, bitter: 1, alcohol: 8 },
        unit: "ml"
      },
      // === КОНЬЯК/БРЕНДИ ===
      {
        name: "\u0425\u0435\u043D\u043D\u0435\u0441\u0441\u0438 VS",
        category: "alcohol",
        color: "#8B4513",
        abv: 40,
        pricePerLiter: 4500,
        tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 8 },
        unit: "ml"
      },
      {
        name: "\u041C\u0430\u0440\u0442\u0435\u043B\u044C VS",
        category: "alcohol",
        color: "#A0522D",
        abv: 40,
        pricePerLiter: 3800,
        tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 8 },
        unit: "ml"
      },
      {
        name: "\u0410\u0440\u0430\u0440\u0430\u0442 5 \u0437\u0432\u0435\u0437\u0434",
        category: "alcohol",
        color: "#8B4513",
        abv: 40,
        pricePerLiter: 1800,
        tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 8 },
        unit: "ml"
      },
      // === ЛИКЁРЫ ===
      {
        name: "\u0410\u043C\u0430\u0440\u0435\u0442\u0442\u043E \u0414\u0438\u0441\u0430\u0440\u043E\u043D\u043D\u043E",
        category: "alcohol",
        color: "#8B4513",
        abv: 28,
        pricePerLiter: 2800,
        tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 5 },
        unit: "ml"
      },
      {
        name: "\u0411\u0435\u0439\u043B\u0438\u0441",
        category: "alcohol",
        color: "#D2B48C",
        abv: 17,
        pricePerLiter: 2200,
        tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 4 },
        unit: "ml"
      },
      {
        name: "\u041A\u0430\u043C\u043F\u0430\u0440\u0438",
        category: "alcohol",
        color: "#DC143C",
        abv: 25,
        pricePerLiter: 2500,
        tasteProfile: { sweet: 3, sour: 2, bitter: 8, alcohol: 5 },
        unit: "ml"
      },
      {
        name: "\u041A\u0443\u0430\u043D\u0442\u0440\u043E",
        category: "alcohol",
        color: "#FFA500",
        abv: 40,
        pricePerLiter: 3200,
        tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 7 },
        unit: "ml"
      },
      {
        name: "\u041A\u0430\u043B\u0443\u0430",
        category: "alcohol",
        color: "#2F1B14",
        abv: 20,
        pricePerLiter: 2e3,
        tasteProfile: { sweet: 8, sour: 0, bitter: 3, alcohol: 4 },
        unit: "ml"
      },
      // === ВЕРМУТ ===
      {
        name: "\u041C\u0430\u0440\u0442\u0438\u043D\u0438 \u0420\u043E\u0441\u0441\u043E",
        category: "alcohol",
        color: "#8B0000",
        abv: 15,
        pricePerLiter: 1200,
        tasteProfile: { sweet: 6, sour: 1, bitter: 4, alcohol: 3 },
        unit: "ml"
      },
      {
        name: "\u041C\u0430\u0440\u0442\u0438\u043D\u0438 \u0411\u044C\u044F\u043D\u043A\u043E",
        category: "alcohol",
        color: "#F5F5DC",
        abv: 15,
        pricePerLiter: 1200,
        tasteProfile: { sweet: 5, sour: 2, bitter: 3, alcohol: 3 },
        unit: "ml"
      },
      {
        name: "\u0427\u0438\u043D\u0437\u0430\u043D\u043E \u0420\u043E\u0441\u0441\u043E",
        category: "alcohol",
        color: "#8B0000",
        abv: 15,
        pricePerLiter: 1e3,
        tasteProfile: { sweet: 6, sour: 1, bitter: 4, alcohol: 3 },
        unit: "ml"
      },
      // === ВИНО ===
      {
        name: "\u041A\u0430\u0431\u0435\u0440\u043D\u0435 \u0421\u043E\u0432\u0438\u043D\u044C\u043E\u043D",
        category: "alcohol",
        color: "#722F37",
        abv: 13,
        pricePerLiter: 800,
        tasteProfile: { sweet: 1, sour: 3, bitter: 6, alcohol: 3 },
        unit: "ml"
      },
      {
        name: "\u0428\u0430\u0440\u0434\u043E\u043D\u0435",
        category: "alcohol",
        color: "#F7E7CE",
        abv: 12,
        pricePerLiter: 900,
        tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 },
        unit: "ml"
      },
      {
        name: "\u041F\u0438\u043D\u043E \u041D\u0443\u0430\u0440",
        category: "alcohol",
        color: "#722F37",
        abv: 12,
        pricePerLiter: 1200,
        tasteProfile: { sweet: 2, sour: 3, bitter: 4, alcohol: 3 },
        unit: "ml"
      },
      {
        name: "\u0420\u043E\u0437\u0435",
        category: "alcohol",
        color: "#FFB6C1",
        abv: 11,
        pricePerLiter: 700,
        tasteProfile: { sweet: 4, sour: 3, bitter: 1, alcohol: 3 },
        unit: "ml"
      },
      // === ИГРИСТОЕ ВИНО ===
      {
        name: "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435 \u0414\u043E\u043C \u041F\u0435\u0440\u0438\u043D\u044C\u043E\u043D",
        category: "alcohol",
        color: "#F7E7CE",
        abv: 12,
        pricePerLiter: 15e3,
        tasteProfile: { sweet: 3, sour: 5, bitter: 0, alcohol: 3 },
        unit: "ml"
      },
      {
        name: "\u041F\u0440\u043E\u0441\u0435\u043A\u043A\u043E",
        category: "alcohol",
        color: "#F7E7CE",
        abv: 11,
        pricePerLiter: 1500,
        tasteProfile: { sweet: 4, sour: 4, bitter: 0, alcohol: 3 },
        unit: "ml"
      },
      {
        name: "\u041A\u0430\u0432\u0430",
        category: "alcohol",
        color: "#F7E7CE",
        abv: 11,
        pricePerLiter: 1200,
        tasteProfile: { sweet: 3, sour: 5, bitter: 0, alcohol: 3 },
        unit: "ml"
      },
      // === ПИВО ===
      {
        name: "\u0425\u0430\u0439\u043D\u0435\u043A\u0435\u043D",
        category: "alcohol",
        color: "#FFD700",
        abv: 5,
        pricePerLiter: 200,
        tasteProfile: { sweet: 1, sour: 1, bitter: 5, alcohol: 2 },
        unit: "ml"
      },
      {
        name: "\u0421\u0442\u0435\u043B\u043B\u0430 \u0410\u0440\u0442\u0443\u0430",
        category: "alcohol",
        color: "#F0E68C",
        abv: 5,
        pricePerLiter: 180,
        tasteProfile: { sweet: 1, sour: 1, bitter: 4, alcohol: 2 },
        unit: "ml"
      },
      {
        name: "\u0413\u0438\u043D\u043D\u0435\u0441\u0441",
        category: "alcohol",
        color: "#2F1B14",
        abv: 4,
        pricePerLiter: 220,
        tasteProfile: { sweet: 2, sour: 0, bitter: 7, alcohol: 2 },
        unit: "ml"
      },
      {
        name: "\u0411\u0430\u043B\u0442\u0438\u043A\u0430 7",
        category: "alcohol",
        color: "#FFD700",
        abv: 5,
        pricePerLiter: 120,
        tasteProfile: { sweet: 1, sour: 1, bitter: 5, alcohol: 2 },
        unit: "ml"
      },
      // === АБСЕНТ ===
      {
        name: "\u0410\u0431\u0441\u0435\u043D\u0442 \u041A\u0441\u0435\u043D\u0442\u0430",
        category: "alcohol",
        color: "#7CFC00",
        abv: 70,
        pricePerLiter: 2500,
        tasteProfile: { sweet: 0, sour: 0, bitter: 8, alcohol: 10 },
        unit: "ml"
      },
      {
        name: "\u0410\u0431\u0441\u0435\u043D\u0442 \u0422\u0443\u043D\u043D\u0435\u043B\u044C",
        category: "alcohol",
        color: "#7CFC00",
        abv: 55,
        pricePerLiter: 1800,
        tasteProfile: { sweet: 0, sour: 0, bitter: 7, alcohol: 9 },
        unit: "ml"
      },
      // === СПЕЦИАЛЬНЫЕ НАПИТКИ ===
      {
        name: "\u041A\u0430\u043B\u044C\u0432\u0430\u0434\u043E\u0441",
        category: "alcohol",
        color: "#D2691E",
        abv: 40,
        pricePerLiter: 3500,
        tasteProfile: { sweet: 2, sour: 1, bitter: 2, alcohol: 8 },
        unit: "ml"
      },
      {
        name: "\u0413\u0440\u0430\u043F\u043F\u0430",
        category: "alcohol",
        color: "#FFFFFF",
        abv: 40,
        pricePerLiter: 2800,
        tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 },
        unit: "ml"
      },
      {
        name: "\u041C\u0430\u0440\u0441\u0430\u043B\u0430",
        category: "alcohol",
        color: "#8B4513",
        abv: 15,
        pricePerLiter: 1500,
        tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 3 },
        unit: "ml"
      },
      // === БИТТЕРЫ ===
      {
        name: "\u0410\u043D\u0433\u043E\u0441\u0442\u0443\u0440\u0430",
        category: "bitter",
        color: "#8B0000",
        abv: 45,
        pricePerLiter: 2e3,
        tasteProfile: { sweet: 1, sour: 0, bitter: 9, alcohol: 8 },
        unit: "ml"
      },
      {
        name: "\u041F\u0435\u0439\u0448\u043E \u0431\u0438\u0442\u0442\u0435\u0440",
        category: "bitter",
        color: "#8B4513",
        abv: 35,
        pricePerLiter: 2500,
        tasteProfile: { sweet: 0, sour: 0, bitter: 8, alcohol: 6 },
        unit: "ml"
      },
      // === ОРИГИНАЛЬНЫЕ ИНГРЕДИЕНТЫ (сохраняем существующие) ===
      // Соки
      {
        name: "\u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D\u043E\u0432\u044B\u0439 \u0441\u043E\u043A",
        category: "juice",
        color: "#FFA500",
        abv: 0,
        pricePerLiter: 200,
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u0410\u043D\u0430\u043D\u0430\u0441\u043E\u0432\u044B\u0439 \u0441\u043E\u043A",
        category: "juice",
        color: "#FFE135",
        abv: 0,
        pricePerLiter: 250,
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u041A\u043B\u044E\u043A\u0432\u0435\u043D\u043D\u044B\u0439 \u0441\u043E\u043A",
        category: "juice",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 300,
        tasteProfile: { sweet: 4, sour: 6, bitter: 1, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u041B\u0438\u043C\u043E\u043D\u043D\u044B\u0439 \u0441\u043E\u043A",
        category: "juice",
        color: "#FFFF00",
        abv: 0,
        pricePerLiter: 400,
        tasteProfile: { sweet: 1, sour: 9, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u041B\u0430\u0439\u043C\u043E\u0432\u044B\u0439 \u0441\u043E\u043A",
        category: "juice",
        color: "#32CD32",
        abv: 0,
        pricePerLiter: 450,
        tasteProfile: { sweet: 1, sour: 8, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u0413\u0440\u0435\u0439\u043F\u0444\u0440\u0443\u0442\u043E\u0432\u044B\u0439 \u0441\u043E\u043A",
        category: "juice",
        color: "#FF69B4",
        abv: 0,
        pricePerLiter: 350,
        tasteProfile: { sweet: 3, sour: 6, bitter: 2, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u0422\u043E\u043C\u0430\u0442\u043D\u044B\u0439 \u0441\u043E\u043A",
        category: "juice",
        color: "#FF6347",
        abv: 0,
        pricePerLiter: 180,
        tasteProfile: { sweet: 2, sour: 3, bitter: 1, alcohol: 0 },
        unit: "ml"
      },
      // Сиропы
      {
        name: "\u041F\u0440\u043E\u0441\u0442\u043E\u0439 \u0441\u0438\u0440\u043E\u043F",
        category: "syrup",
        color: "#FFFFFF",
        abv: 0,
        pricePerLiter: 150,
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u0421\u0438\u0440\u043E\u043F \u0433\u0440\u0430\u043D\u0430\u0442\u0430",
        category: "syrup",
        color: "#B22222",
        abv: 0,
        pricePerLiter: 350,
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u041A\u043E\u043A\u043E\u0441\u043E\u0432\u044B\u0439 \u0441\u0438\u0440\u043E\u043F",
        category: "syrup",
        color: "#FFFACD",
        abv: 0,
        pricePerLiter: 400,
        tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u041C\u044F\u0442\u043D\u044B\u0439 \u0441\u0438\u0440\u043E\u043F",
        category: "syrup",
        color: "#90EE90",
        abv: 0,
        pricePerLiter: 300,
        tasteProfile: { sweet: 7, sour: 0, bitter: 2, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u041A\u0430\u0440\u0430\u043C\u0435\u043B\u044C\u043D\u044B\u0439 \u0441\u0438\u0440\u043E\u043F",
        category: "syrup",
        color: "#D2691E",
        abv: 0,
        pricePerLiter: 320,
        tasteProfile: { sweet: 10, sour: 0, bitter: 1, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u0412\u0430\u043D\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u0438\u0440\u043E\u043F",
        category: "syrup",
        color: "#F5DEB3",
        abv: 0,
        pricePerLiter: 380,
        tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      // Миксеры
      {
        name: "\u0422\u043E\u043D\u0438\u043A",
        category: "mixer",
        color: "#F0F8FF",
        abv: 0,
        pricePerLiter: 150,
        tasteProfile: { sweet: 2, sour: 1, bitter: 4, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u0421\u043E\u0434\u043E\u0432\u0430\u044F",
        category: "mixer",
        color: "#F0F8FF",
        abv: 0,
        pricePerLiter: 80,
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u041A\u043E\u043A\u0430-\u043A\u043E\u043B\u0430",
        category: "mixer",
        color: "#2F1B14",
        abv: 0,
        pricePerLiter: 120,
        tasteProfile: { sweet: 8, sour: 1, bitter: 1, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "\u0418\u043C\u0431\u0438\u0440\u043D\u043E\u0435 \u043F\u0438\u0432\u043E",
        category: "mixer",
        color: "#DAA520",
        abv: 0,
        pricePerLiter: 200,
        tasteProfile: { sweet: 4, sour: 2, bitter: 3, alcohol: 0 },
        unit: "ml"
      },
      // Фрукты и декор
      {
        name: "\u041B\u0430\u0439\u043C",
        category: "fruit",
        color: "#32CD32",
        abv: 0,
        pricePerLiter: 500,
        tasteProfile: { sweet: 2, sour: 7, bitter: 0, alcohol: 0 },
        unit: "piece"
      },
      {
        name: "\u041B\u0438\u043C\u043E\u043D",
        category: "fruit",
        color: "#FFFF00",
        abv: 0,
        pricePerLiter: 400,
        tasteProfile: { sweet: 2, sour: 8, bitter: 0, alcohol: 0 },
        unit: "piece"
      },
      {
        name: "\u041C\u044F\u0442\u0430",
        category: "fruit",
        color: "#00FF00",
        abv: 0,
        pricePerLiter: 800,
        tasteProfile: { sweet: 1, sour: 0, bitter: 3, alcohol: 0 },
        unit: "piece"
      },
      {
        name: "\u0412\u0438\u0448\u043D\u044F",
        category: "fruit",
        color: "#DC143C",
        abv: 0,
        pricePerLiter: 600,
        tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
        unit: "piece"
      },
      {
        name: "\u0410\u043F\u0435\u043B\u044C\u0441\u0438\u043D",
        category: "fruit",
        color: "#FFA500",
        abv: 0,
        pricePerLiter: 350,
        tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 },
        unit: "piece"
      },
      {
        name: "\u041E\u043B\u0438\u0432\u043A\u0438",
        category: "garnish",
        color: "#808000",
        abv: 0,
        pricePerLiter: 800,
        tasteProfile: { sweet: 0, sour: 2, bitter: 3, alcohol: 0 },
        unit: "piece"
      },
      // Лёд
      {
        name: "\u041B\u0451\u0434",
        category: "ice",
        color: "#E0E0E0",
        abv: 0,
        pricePerLiter: 50,
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 },
        unit: "g"
      },
      // === ВИНА ИЗ ALKOTEKA (Реальные позиции) ===
      ...ALKOTEKA_WINES
    ];
    EXTENDED_GLASS_TYPES = [
      { name: "Old-fashioned", capacity: 300, shape: "old-fashioned" },
      { name: "Highball", capacity: 350, shape: "highball" },
      { name: "Martini", capacity: 150, shape: "martini" },
      { name: "Shot", capacity: 50, shape: "shot" },
      { name: "Rocks", capacity: 250, shape: "rocks" },
      { name: "Coupe", capacity: 180, shape: "coupe" },
      { name: "Wine", capacity: 200, shape: "wine" },
      { name: "Champagne", capacity: 180, shape: "champagne" },
      { name: "Beer", capacity: 500, shape: "beer" },
      { name: "Snifter", capacity: 200, shape: "snifter" }
    ];
    CATEGORY_STATS2 = {
      alcohol: EXTENDED_INGREDIENTS.filter((i) => i.category === "alcohol").length,
      juice: EXTENDED_INGREDIENTS.filter((i) => i.category === "juice").length,
      syrup: EXTENDED_INGREDIENTS.filter((i) => i.category === "syrup").length,
      mixer: EXTENDED_INGREDIENTS.filter((i) => i.category === "mixer").length,
      fruit: EXTENDED_INGREDIENTS.filter((i) => i.category === "fruit").length,
      garnish: EXTENDED_INGREDIENTS.filter((i) => i.category === "garnish").length,
      bitter: EXTENDED_INGREDIENTS.filter((i) => i.category === "bitter").length,
      ice: EXTENDED_INGREDIENTS.filter((i) => i.category === "ice").length,
      total: EXTENDED_INGREDIENTS.length
    };
  }
});

// scripts/init-extended-ingredients.ts
var init_extended_ingredients_exports = {};
__export(init_extended_ingredients_exports, {
  initializeExtendedIngredients: () => initializeExtendedIngredients
});
async function initializeExtendedIngredients() {
  console.log("\u{1F680} \u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430 \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432...");
  console.log(`\u{1F4E6} \u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432 \u0432 extended-ingredients-data.ts: ${EXTENDED_INGREDIENTS.length}`);
  try {
    const existingIngredients = await storage.getIngredients();
    console.log(`\u{1F4CA} \u041D\u0430\u0439\u0434\u0435\u043D\u043E \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0445 \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432 \u0432 \u0411\u0414: ${existingIngredients.length}`);
    const existingNames = new Set(existingIngredients.map((ing) => ing.name));
    const newIngredients = EXTENDED_INGREDIENTS.filter((ing) => !existingNames.has(ing.name));
    console.log(`\u2728 \u041D\u043E\u0432\u044B\u0445 \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432 \u0434\u043B\u044F \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F: ${newIngredients.length}`);
    let addedCount = 0;
    for (const ingredientData of newIngredients) {
      try {
        const ingredient = await storage.createIngredient(ingredientData);
        console.log(`\u2705 \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D: ${ingredient.name} (${ingredient.category})`);
        addedCount++;
      } catch (error) {
        console.error(`\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0438 ${ingredientData.name}:`, error);
      }
    }
    console.log("\n\u{1F943} \u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0442\u0438\u043F\u043E\u0432 \u0441\u0442\u0430\u043A\u0430\u043D\u043E\u0432...");
    const existingGlasses = await storage.getGlassTypes();
    const existingGlassNames = new Set(existingGlasses.map((glass) => glass.name));
    const newGlasses = EXTENDED_GLASS_TYPES.filter((glass) => !existingGlassNames.has(glass.name));
    console.log(`\u2728 \u041D\u043E\u0432\u044B\u0445 \u0442\u0438\u043F\u043E\u0432 \u0441\u0442\u0430\u043A\u0430\u043D\u043E\u0432 \u0434\u043B\u044F \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F: ${newGlasses.length}`);
    let addedGlassesCount = 0;
    for (const glassData of newGlasses) {
      try {
        const glass = await storage.createGlassType(glassData);
        console.log(`\u2705 \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0441\u0442\u0430\u043A\u0430\u043D: ${glass.name} (${glass.capacity}ml)`);
        addedGlassesCount++;
      } catch (error) {
        console.error(`\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0438 \u0441\u0442\u0430\u043A\u0430\u043D\u0430 ${glassData.name}:`, error);
      }
    }
    const finalIngredients = await storage.getIngredients();
    const finalGlasses = await storage.getGlassTypes();
    console.log("\n\u{1F4C8} \u0424\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430:");
    console.log(`\u{1F379} \u0412\u0441\u0435\u0433\u043E \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432: ${finalIngredients.length}`);
    console.log(`\u{1F943} \u0412\u0441\u0435\u0433\u043E \u0442\u0438\u043F\u043E\u0432 \u0441\u0442\u0430\u043A\u0430\u043D\u043E\u0432: ${finalGlasses.length}`);
    console.log(`\u2795 \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432: ${addedCount}`);
    console.log(`\u2795 \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0441\u0442\u0430\u043A\u0430\u043D\u043E\u0432: ${addedGlassesCount}`);
    const categoryStats = finalIngredients.reduce((acc, ing) => {
      acc[ing.category] = (acc[ing.category] || 0) + 1;
      return acc;
    }, {});
    console.log("\n\u{1F4CA} \u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u043F\u043E \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F\u043C:");
    Object.entries(categoryStats).forEach(([category, count]) => {
      const emoji = getCategoryEmoji(category);
      console.log(`  ${emoji} ${category}: ${count} \u0448\u0442.`);
    });
    console.log("\n\u{1F389} \u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E!");
  } catch (error) {
    console.error("\u{1F4A5} \u041A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438:", error);
    process.exit(1);
  }
}
function getCategoryEmoji(category) {
  const emojiMap = {
    "alcohol": "\u{1F37A}",
    "juice": "\u{1F9C3}",
    "syrup": "\u{1F36F}",
    "mixer": "\u{1F964}",
    "fruit": "\u{1F34B}",
    "garnish": "\u{1FAD2}",
    "bitter": "\u{1F33F}",
    "ice": "\u{1F9CA}"
  };
  return emojiMap[category] || "\u{1F539}";
}
var init_init_extended_ingredients = __esm({
  "scripts/init-extended-ingredients.ts"() {
    "use strict";
    init_extended_ingredients_data();
    init_storage();
    if (__require.main === module) {
      initializeExtendedIngredients().then(() => {
        console.log("\u2728 \u0421\u043A\u0440\u0438\u043F\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D");
        process.exit(0);
      }).catch((error) => {
        console.error("\u{1F4A5} \u0421\u043A\u0440\u0438\u043F\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D \u0441 \u043E\u0448\u0438\u0431\u043A\u043E\u0439:", error);
        process.exit(1);
      });
    }
  }
});

// server/seed.ts
var seed_exports = {};
__export(seed_exports, {
  forceSeedIngredients: () => forceSeedIngredients,
  seedDatabase: () => seedDatabase
});
async function seedDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      console.log("Running in memory storage mode - database seeding skipped (data preloaded in MemoryStorage)");
      return;
    }
    console.log("\u{1F331} Seeding database with full ingredients data...");
    console.log(`\u{1F4E6} Total ingredients to seed: ${allIngredients.length}`);
    const existingIngredients = await db.select().from(ingredients).limit(1);
    const existingGlassTypes = await db.select().from(glassTypes).limit(1);
    if (existingIngredients.length === 0) {
      console.log("\u{1F4E5} Inserting ingredients...");
      const batchSize = 100;
      for (let i = 0; i < allIngredients.length; i += batchSize) {
        const batch = allIngredients.slice(i, i + batchSize);
        await db.insert(ingredients).values(batch);
        console.log(`  \u2713 Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allIngredients.length / batchSize)} (${batch.length} items)`);
      }
      console.log(`\u2705 Inserted ${allIngredients.length} ingredients`);
    } else {
      console.log(`\u23ED\uFE0F  Ingredients already exist (${existingIngredients.length}+ found), skipping...`);
    }
    if (existingGlassTypes.length === 0) {
      console.log("\u{1F4E5} Inserting glass types...");
      await db.insert(glassTypes).values(sampleGlassTypes);
      console.log(`\u2705 Inserted ${sampleGlassTypes.length} glass types`);
    } else {
      console.log("\u23ED\uFE0F  Glass types already exist, skipping...");
    }
    console.log("\u{1F389} Database seeded successfully!");
  } catch (error) {
    console.error("\u274C Error seeding database:", error);
    throw error;
  }
}
async function forceSeedIngredients() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL - cannot force seed");
    return;
  }
  console.log("\u{1F504} Force re-seeding ingredients...");
  await db.delete(ingredients);
  console.log("\u{1F5D1}\uFE0F  Cleared existing ingredients");
  const batchSize = 100;
  for (let i = 0; i < allIngredients.length; i += batchSize) {
    const batch = allIngredients.slice(i, i + batchSize);
    await db.insert(ingredients).values(batch);
    console.log(`  \u2713 Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allIngredients.length / batchSize)}`);
  }
  console.log(`\u2705 Force seeded ${allIngredients.length} ingredients!`);
}
var allIngredients, sampleGlassTypes;
var init_seed = __esm({
  "server/seed.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_ingredients_data();
    allIngredients = SAMPLE_INGREDIENTS.map((ing) => ({
      name: ing.name,
      category: ing.category,
      subtype: ing.subtype || null,
      color: ing.color,
      abv: String(ing.abv || 0),
      pricePerLiter: String(ing.pricePerLiter || 0),
      tasteProfile: ing.tasteProfile,
      unit: ing.unit,
      sourceUrl: ing.sourceUrl || null,
      sourceName: ing.sourceName || null,
      sourceIcon: ing.sourceIcon || null,
      imageUrl: ing.imageUrl || null,
      volume: ing.volume || null
    }));
    sampleGlassTypes = [
      { name: "\u0428\u043E\u0442", capacity: 50, shape: "shot" },
      { name: "\u041E\u043B\u0434 \u0424\u044D\u0448\u043D", capacity: 300, shape: "old-fashioned" },
      { name: "\u0425\u0430\u0439\u0431\u043E\u043B", capacity: 270, shape: "highball" },
      { name: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u044C\u043D\u0430\u044F \u0440\u044E\u043C\u043A\u0430", capacity: 150, shape: "martini" },
      { name: "\u041C\u0430\u0440\u0433\u0430\u0440\u0438\u0442\u0430", capacity: 250, shape: "margarita" },
      { name: "\u0425\u0430\u0440\u0440\u0438\u043A\u0435\u0439\u043D", capacity: 450, shape: "hurricane" },
      { name: "\u0422\u0443\u043C\u0431\u043B\u0435\u0440", capacity: 300, shape: "tumbler" },
      { name: "\u041A\u043E\u043D\u044C\u044F\u0447\u043D\u044B\u0439 \u0431\u043E\u043A\u0430\u043B", capacity: 350, shape: "snifter" },
      { name: "\u0424\u0443\u0436\u0435\u0440 \u0434\u043B\u044F \u0448\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0433\u043E", capacity: 170, shape: "champagne-flute" },
      { name: "\u041F\u0438\u0432\u043D\u0430\u044F \u043A\u0440\u0443\u0436\u043A\u0430", capacity: 500, shape: "beer-mug" },
      { name: "\u0411\u043E\u043A\u0430\u043B \u0434\u043B\u044F \u043A\u0440\u0430\u0441\u043D\u043E\u0433\u043E \u0432\u0438\u043D\u0430", capacity: 300, shape: "red-wine" },
      { name: "\u0411\u043E\u043A\u0430\u043B \u0434\u043B\u044F \u0431\u0435\u043B\u043E\u0433\u043E \u0432\u0438\u043D\u0430", capacity: 260, shape: "white-wine" },
      { name: "\u0411\u043E\u043A\u0430\u043B \u0441\u0430\u0443\u044D\u0440", capacity: 120, shape: "sour" },
      { name: "\u0427\u0430\u0448\u0430 \u0434\u043B\u044F \u0448\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0433\u043E", capacity: 180, shape: "champagne-saucer" }
    ];
    if (import.meta.url === `file://${process.argv[1]}`) {
      seedDatabase();
    }
  }
});

// server/vercel-entry.ts
import "dotenv/config";
import express from "express";

// server/routes.ts
init_storage();
import { createServer } from "http";

// server/auth.ts
init_storage();
init_schema();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPg from "connect-pg-simple";
import MemoryStore from "memorystore";
import { nanoid as nanoid2 } from "nanoid";
import bcrypt from "bcryptjs";
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  let sessionStore;
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgresql")) {
    const pgStore = connectPg(session);
    sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: "sessions"
    });
    console.log("Using PostgreSQL session store");
  } else {
    const MemStore = MemoryStore(session);
    sessionStore = new MemStore({
      checkPeriod: 864e5,
      // prune expired entries every 24h
      ttl: sessionTtl
    });
    console.log("Using memory session store (development mode)");
  }
  return session({
    secret: process.env.SESSION_SECRET || "cocktailo-session-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const callbackURL = process.env.APP_URL ? `${process.env.APP_URL}/api/auth/google/callback` : process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}/api/auth/google/callback` : `http://localhost:${process.env.PORT || 3e3}/api/auth/google/callback`;
    console.log("Google OAuth configured with callback URL:", callbackURL);
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await storage.getUserByGoogleId(profile.id);
        if (!user) {
          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await storage.getUserByEmail(email);
          }
          if (!user) {
            user = await storage.upsertUser({
              id: nanoid2(),
              googleId: profile.id,
              email: profile.emails?.[0]?.value || null,
              nickname: profile.name?.givenName || profile.displayName || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",
              profileImageUrl: profile.photos?.[0]?.value || null
            });
          } else {
            user = await storage.upsertUser({
              ...user,
              googleId: profile.id,
              profileImageUrl: profile.photos?.[0]?.value || user.profileImageUrl
            });
          }
        } else {
          user = await storage.upsertUser({
            ...user,
            email: profile.emails?.[0]?.value || user.email,
            nickname: profile.name?.givenName || profile.displayName || user.nickname,
            profileImageUrl: profile.photos?.[0]?.value || user.profileImageUrl
          });
        }
        console.log("Google OAuth successful for user:", user.email);
        return done(null, user);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, false);
      }
    }));
  } else {
    console.warn("Google OAuth credentials not provided. Google authentication will be disabled.");
  }
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  }, async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return done(null, false, { message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 email \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C" });
      }
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return done(null, false, { message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 email \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C" });
      }
      return done(null, user);
    } catch (error) {
      console.error("Local auth error:", error);
      return done(error, false);
    }
  }));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        console.error("Failed to deserialize user out of session");
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error("Failed to deserialize user out of session:", error);
      done(null, false);
    }
  });
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app2.get(
      "/api/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );
    app2.get(
      "/api/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/auth?error=google_auth_failed" }),
      (req, res) => {
        console.log("Google OAuth callback successful, user:", req.user?.email);
        res.redirect("/");
      }
    );
  } else {
    app2.get("/api/auth/google", (req, res) => {
      res.redirect("/auth?error=google_oauth_not_configured");
    });
    app2.get("/api/auth/google/callback", (req, res) => {
      res.redirect("/auth?error=google_oauth_not_configured");
    });
  }
  app2.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      req.session.destroy((err2) => {
        if (err2) {
          console.error("Session destroy error:", err2);
        }
        res.clearCookie("connect.sid");
        res.json({ success: true });
      });
    });
  });
  app2.patch("/api/auth/profile", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
      }
      const { nickname, profileImageUrl } = req.body;
      if (!nickname || nickname.trim().length < 2) {
        return res.status(400).json({ error: "\u041D\u0438\u043A\u043D\u0435\u0439\u043C \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 2 \u0441\u0438\u043C\u0432\u043E\u043B\u0430" });
      }
      if (nickname.trim().length > 50) {
        return res.status(400).json({ error: "\u041D\u0438\u043A\u043D\u0435\u0439\u043C \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0434\u043B\u0438\u043D\u043D\u0435\u0435 50 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432" });
      }
      if (profileImageUrl && profileImageUrl.length > 0 && !profileImageUrl.startsWith("data:image/")) {
        return res.status(400).json({ error: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F" });
      }
      const updatedUser = await storage.upsertUser({
        ...req.user,
        nickname: nickname.trim(),
        profileImageUrl: profileImageUrl || req.user.profileImageUrl
      });
      const { passwordHash: _, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.message?.includes("duplicate") || error.message?.includes("unique")) {
        res.status(400).json({ error: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0442\u0430\u043A\u0438\u043C \u043D\u0438\u043A\u043D\u0435\u0439\u043C\u043E\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442" });
      } else {
        res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430" });
      }
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, nickname } = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0442\u0430\u043A\u0438\u043C email \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442" });
      }
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const newUser = await storage.upsertUser({
        id: nanoid2(),
        email,
        nickname,
        profileImageUrl: null,
        googleId: null,
        passwordHash,
        emailVerified: false
      });
      req.login(newUser, (err) => {
        if (err) {
          console.error("Auto-login after registration error:", err);
          return res.status(500).json({ error: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441\u043E\u0437\u0434\u0430\u043D, \u043D\u043E \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u0432\u0445\u043E\u0434\u0430" });
        }
        const { passwordHash: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ user: userWithoutPassword });
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error?.issues) {
        return res.status(400).json({ error: error.issues[0].message });
      }
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438" });
    }
  });
  app2.post("/api/auth/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
    } catch (error) {
      if (error?.issues) {
        return res.status(400).json({ error: error.issues[0].message });
      }
      return res.status(400).json({ error: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435" });
    }
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0445\u043E\u0434\u0430" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 email \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C" });
      }
      req.login(user, (err2) => {
        if (err2) {
          console.error("Login session error:", err2);
          return res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0441\u0435\u0441\u0441\u0438\u0438" });
        }
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      });
    })(req, res, next);
  });
}
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
};
var optionalAuth = (req, res, next) => {
  next();
};

// server/cocktail-generator-enhanced.ts
var ALCOHOL_SUBTYPES = [
  // Крепкий алкоголь (35-50%)
  "\u0412\u043E\u0434\u043A\u0430",
  "\u0412\u0438\u0441\u043A\u0438",
  "\u0411\u0443\u0440\u0431\u043E\u043D",
  "\u0414\u0436\u0438\u043D",
  "\u0420\u043E\u043C",
  "\u0422\u0435\u043A\u0438\u043B\u0430",
  "\u041A\u043E\u043D\u044C\u044F\u043A",
  "\u0411\u0440\u0435\u043D\u0434\u0438",
  "\u0410\u0431\u0441\u0435\u043D\u0442",
  "\u041A\u0430\u043B\u044C\u0432\u0430\u0434\u043E\u0441",
  "\u0413\u0440\u0430\u043F\u043F\u0430",
  "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430",
  // Средний алкоголь (15-35%)
  "\u041B\u0438\u043A\u0451\u0440",
  "\u0412\u0435\u0440\u043C\u0443\u0442",
  // Слабый алкоголь (3-15%)
  "\u041F\u0438\u0432\u043E",
  "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435",
  "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435",
  "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435",
  "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435",
  "\u0418\u0433\u0440\u0438\u0441\u0442\u043E\u0435 \u0432\u0438\u043D\u043E",
  "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435"
];
var GENERATION_MODES = {
  classic: {
    name: "\u041A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0438\u0439",
    description: "\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0435 \u0432\u0440\u0435\u043C\u0435\u043D\u0435\u043C \u0440\u0435\u0446\u0435\u043F\u0442\u044B \u0441 \u0433\u0430\u0440\u043C\u043E\u043D\u0438\u0447\u043D\u044B\u043C \u0441\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u0435\u043C \u0432\u043A\u0443\u0441\u043E\u0432",
    alcoholRatio: [0.35, 0.6],
    allowedAbvRange: [15, 35],
    ingredientCount: [3, 5],
    requiredCategories: ["alcohol"],
    preferredCategories: ["alcohol", "juice", "syrup", "bitter"],
    forbiddenCategories: ["energy_drink"],
    forbiddenSubtypes: ["\u041F\u0438\u0432\u043E", "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435"],
    allowedAlcoholSubtypes: [
      "\u0412\u043E\u0434\u043A\u0430",
      "\u0412\u0438\u0441\u043A\u0438",
      "\u0411\u0443\u0440\u0431\u043E\u043D",
      "\u0414\u0436\u0438\u043D",
      "\u0420\u043E\u043C",
      "\u0422\u0435\u043A\u0438\u043B\u0430",
      "\u041A\u043E\u043D\u044C\u044F\u043A",
      "\u0411\u0440\u0435\u043D\u0434\u0438",
      "\u041B\u0438\u043A\u0451\u0440",
      "\u0412\u0435\u0440\u043C\u0443\u0442",
      "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430",
      "\u0410\u0431\u0441\u0435\u043D\u0442",
      "\u041A\u0430\u043B\u044C\u0432\u0430\u0434\u043E\u0441",
      "\u0413\u0440\u0430\u043F\u043F\u0430"
    ],
    tasteBalance: { sweet: 5, sour: 4, bitter: 3, alcohol: 6 },
    glassTypes: ["old-fashioned", "martini", "highball", "coupe", "sour"],
    strictness: "moderate"
  },
  crazy: {
    name: "\u0421\u0443\u043C\u0430\u0441\u0448\u0435\u0434\u0448\u0438\u0439",
    description: "\u042D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u044C \u0434\u043B\u044F \u043B\u044E\u0431\u0438\u0442\u0435\u043B\u0435\u0439 \u043D\u0435\u043E\u0431\u044B\u0447\u043D\u044B\u0445 \u0441\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u0439",
    alcoholRatio: [0.25, 0.75],
    allowedAbvRange: [10, 45],
    ingredientCount: [4, 7],
    requiredCategories: ["alcohol"],
    preferredCategories: ["alcohol", "juice", "syrup", "bitter", "mixer", "energy_drink", "soda"],
    forbiddenCategories: [],
    forbiddenSubtypes: [],
    allowedAlcoholSubtypes: ALCOHOL_SUBTYPES,
    // Все подкатегории разрешены
    tasteBalance: { sweet: 6, sour: 6, bitter: 5, alcohol: 7 },
    glassTypes: ["highball", "hurricane", "margarita", "tumbler"],
    strictness: "loose"
  },
  summer: {
    name: "\u041B\u0435\u0442\u043D\u0438\u0439",
    description: "\u041E\u0441\u0432\u0435\u0436\u0430\u044E\u0449\u0438\u0439 \u043D\u0430\u043F\u0438\u0442\u043E\u043A, \u0438\u0434\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u0434\u043B\u044F \u0436\u0430\u0440\u043A\u043E\u0433\u043E \u0434\u043D\u044F",
    alcoholRatio: [0.15, 0.4],
    allowedAbvRange: [5, 20],
    ingredientCount: [3, 6],
    requiredCategories: ["juice"],
    preferredCategories: ["alcohol", "juice", "fruit", "soda", "mixer"],
    forbiddenCategories: ["bitter", "energy_drink"],
    forbiddenSubtypes: ["\u0412\u0438\u0441\u043A\u0438", "\u0411\u0443\u0440\u0431\u043E\u043D", "\u041A\u043E\u043D\u044C\u044F\u043A", "\u0411\u0440\u0435\u043D\u0434\u0438", "\u0410\u0431\u0441\u0435\u043D\u0442", "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430"],
    allowedAlcoholSubtypes: [
      "\u0412\u043E\u0434\u043A\u0430",
      "\u0414\u0436\u0438\u043D",
      "\u0420\u043E\u043C",
      "\u0422\u0435\u043A\u0438\u043B\u0430",
      "\u041B\u0438\u043A\u0451\u0440",
      "\u0412\u0435\u0440\u043C\u0443\u0442",
      "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435",
      "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435",
      "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435",
      "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435"
    ],
    tasteBalance: { sweet: 7, sour: 6, bitter: 1, alcohol: 3 },
    glassTypes: ["highball", "hurricane", "wine", "champagne-flute", "tumbler"],
    strictness: "moderate"
  },
  nonalcoholic: {
    name: "\u0411\u0435\u0437\u0430\u043B\u043A\u043E\u0433\u043E\u043B\u044C\u043D\u044B\u0439",
    description: "\u0411\u0435\u0437\u0430\u043B\u043A\u043E\u0433\u043E\u043B\u044C\u043D\u044B\u0439 \u043D\u0430\u043F\u0438\u0442\u043E\u043A, \u043F\u043E\u043B\u043D\u044B\u0439 \u0432\u043A\u0443\u0441\u0430 \u0438 \u0430\u0440\u043E\u043C\u0430\u0442\u0430",
    alcoholRatio: [0, 0],
    allowedAbvRange: [0, 0.5],
    // Почти 0 алкоголя
    ingredientCount: [3, 6],
    // Минимум 3 ингредиента
    requiredCategories: ["juice", "fruit"],
    // Обязательно сок И фрукты
    preferredCategories: ["juice", "syrup", "fruit", "soda", "mixer"],
    forbiddenCategories: ["alcohol", "bitter"],
    forbiddenSubtypes: ALCOHOL_SUBTYPES,
    // ВСЕ алкогольные подкатегории запрещены
    allowedAlcoholSubtypes: [],
    tasteBalance: { sweet: 6, sour: 5, bitter: 1, alcohol: 0 },
    glassTypes: ["highball", "tumbler", "hurricane", "old-fashioned"],
    strictness: "strict"
  },
  shot: {
    name: "\u0428\u043E\u0442",
    description: "\u041A\u0440\u0435\u043F\u043A\u0438\u0439 \u0448\u043E\u0442 \u0434\u043B\u044F \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0438\u0445 \u0446\u0435\u043D\u0438\u0442\u0435\u043B\u0435\u0439",
    alcoholRatio: [0.7, 1],
    allowedAbvRange: [25, 50],
    ingredientCount: [2, 3],
    requiredCategories: ["alcohol"],
    preferredCategories: ["alcohol", "syrup", "bitter"],
    forbiddenCategories: ["juice", "soda", "fruit", "energy_drink", "mixer"],
    forbiddenSubtypes: ["\u041F\u0438\u0432\u043E", "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435"],
    allowedAlcoholSubtypes: [
      "\u0412\u043E\u0434\u043A\u0430",
      "\u0412\u0438\u0441\u043A\u0438",
      "\u0411\u0443\u0440\u0431\u043E\u043D",
      "\u0414\u0436\u0438\u043D",
      "\u0420\u043E\u043C",
      "\u0422\u0435\u043A\u0438\u043B\u0430",
      "\u041A\u043E\u043D\u044C\u044F\u043A",
      "\u0411\u0440\u0435\u043D\u0434\u0438",
      "\u041B\u0438\u043A\u0451\u0440",
      "\u0410\u0431\u0441\u0435\u043D\u0442",
      "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430"
    ],
    tasteBalance: { sweet: 3, sour: 2, bitter: 4, alcohol: 9 },
    glassTypes: ["shot"],
    strictness: "strict"
  },
  // Новые режимы
  wine_cocktail: {
    name: "\u0412\u0438\u043D\u043D\u044B\u0439 \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u044C",
    description: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0432\u0438\u043D\u0430",
    alcoholRatio: [0.4, 0.7],
    allowedAbvRange: [8, 18],
    ingredientCount: [2, 4],
    requiredCategories: ["alcohol"],
    preferredCategories: ["alcohol", "juice", "fruit", "syrup"],
    forbiddenCategories: ["energy_drink", "bitter"],
    forbiddenSubtypes: [
      "\u0412\u043E\u0434\u043A\u0430",
      "\u0412\u0438\u0441\u043A\u0438",
      "\u0411\u0443\u0440\u0431\u043E\u043D",
      "\u0414\u0436\u0438\u043D",
      "\u0420\u043E\u043C",
      "\u0422\u0435\u043A\u0438\u043B\u0430",
      "\u041A\u043E\u043D\u044C\u044F\u043A",
      "\u0411\u0440\u0435\u043D\u0434\u0438",
      "\u0410\u0431\u0441\u0435\u043D\u0442",
      "\u041D\u0430\u0441\u0442\u043E\u0439\u043A\u0430",
      "\u041F\u0438\u0432\u043E"
    ],
    allowedAlcoholSubtypes: [
      "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435",
      "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435",
      "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435",
      "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435",
      "\u0428\u0430\u043C\u043F\u0430\u043D\u0441\u043A\u043E\u0435",
      "\u041B\u0438\u043A\u0451\u0440",
      "\u0412\u0435\u0440\u043C\u0443\u0442"
    ],
    tasteBalance: { sweet: 5, sour: 4, bitter: 2, alcohol: 4 },
    glassTypes: ["wine", "champagne-flute", "highball", "tumbler"],
    strictness: "moderate"
  },
  beer_cocktail: {
    name: "\u041F\u0438\u0432\u043D\u043E\u0439 \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u044C",
    description: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u043F\u0438\u0432\u0430",
    alcoholRatio: [0.5, 0.9],
    allowedAbvRange: [3, 12],
    ingredientCount: [2, 4],
    requiredCategories: ["alcohol"],
    preferredCategories: ["alcohol", "juice", "soda"],
    forbiddenCategories: ["syrup", "bitter", "energy_drink"],
    forbiddenSubtypes: [
      "\u0412\u043E\u0434\u043A\u0430",
      "\u0412\u0438\u0441\u043A\u0438",
      "\u0411\u0443\u0440\u0431\u043E\u043D",
      "\u041A\u043E\u043D\u044C\u044F\u043A",
      "\u0411\u0440\u0435\u043D\u0434\u0438",
      "\u0410\u0431\u0441\u0435\u043D\u0442",
      "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435",
      "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435",
      "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435",
      "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435"
    ],
    allowedAlcoholSubtypes: ["\u041F\u0438\u0432\u043E", "\u041B\u0438\u043A\u0451\u0440"],
    tasteBalance: { sweet: 3, sour: 3, bitter: 5, alcohol: 4 },
    glassTypes: ["beer-mug", "highball", "tumbler"],
    strictness: "moderate"
  },
  energy: {
    name: "\u042D\u043D\u0435\u0440\u0433\u0435\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439",
    description: "\u041A\u043E\u043A\u0442\u0435\u0439\u043B\u0438 \u0441 \u044D\u043D\u0435\u0440\u0433\u0435\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C\u0438 \u043D\u0430\u043F\u0438\u0442\u043A\u0430\u043C\u0438",
    alcoholRatio: [0.2, 0.5],
    allowedAbvRange: [10, 25],
    ingredientCount: [2, 4],
    requiredCategories: ["energy_drink"],
    preferredCategories: ["alcohol", "energy_drink", "juice"],
    forbiddenCategories: ["bitter", "fruit"],
    forbiddenSubtypes: ["\u041A\u043E\u043D\u044C\u044F\u043A", "\u0411\u0440\u0435\u043D\u0434\u0438", "\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", "\u041F\u0438\u0432\u043E"],
    allowedAlcoholSubtypes: ["\u0412\u043E\u0434\u043A\u0430", "\u0414\u0436\u0438\u043D", "\u0420\u043E\u043C", "\u0422\u0435\u043A\u0438\u043B\u0430", "\u041B\u0438\u043A\u0451\u0440"],
    tasteBalance: { sweet: 6, sour: 4, bitter: 2, alcohol: 5 },
    glassTypes: ["highball", "tumbler", "hurricane"],
    strictness: "moderate"
  }
};
var INCOMPATIBLE_COMBINATIONS = [
  // Пиво не сочетается с крепким алкоголем
  [["\u041F\u0438\u0432\u043E"], ["\u0412\u043E\u0434\u043A\u0430", "\u0412\u0438\u0441\u043A\u0438", "\u0411\u0443\u0440\u0431\u043E\u043D", "\u0414\u0436\u0438\u043D", "\u0420\u043E\u043C", "\u0422\u0435\u043A\u0438\u043B\u0430", "\u041A\u043E\u043D\u044C\u044F\u043A", "\u0411\u0440\u0435\u043D\u0434\u0438", "\u0410\u0431\u0441\u0435\u043D\u0442"]],
  // Вино не сочетается с крепким алкоголем (кроме ликёров)
  [["\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435"], ["\u0412\u043E\u0434\u043A\u0430", "\u0412\u0438\u0441\u043A\u0438", "\u0411\u0443\u0440\u0431\u043E\u043D", "\u0422\u0435\u043A\u0438\u043B\u0430", "\u041A\u043E\u043D\u044C\u044F\u043A", "\u0411\u0440\u0435\u043D\u0434\u0438"]],
  // Энергетики не сочетаются с вином и пивом
  [["energy_drink"], ["\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", "\u0412\u0438\u043D\u043E \u0438\u0433\u0440\u0438\u0441\u0442\u043E\u0435", "\u041F\u0438\u0432\u043E"]],
  // Биттеры не сочетаются с молочными и сладкими ликёрами
  [["bitter"], ["\u0412\u0438\u043D\u043E \u043A\u0440\u0430\u0441\u043D\u043E\u0435", "\u0412\u0438\u043D\u043E \u0431\u0435\u043B\u043E\u0435", "\u0412\u0438\u043D\u043E \u0440\u043E\u0437\u043E\u0432\u043E\u0435", "\u041F\u0438\u0432\u043E"]]
];
var EnhancedCocktailGenerator = class {
  ingredients;
  glassTypes;
  constructor(ingredients2, glassTypes2) {
    this.ingredients = ingredients2;
    this.glassTypes = glassTypes2;
  }
  /**
   * Главный метод генерации коктейля
   */
  generateCocktail(filters) {
    const mode = GENERATION_MODES[filters.mode] || GENERATION_MODES.classic;
    const availableIngredients = this.filterIngredientsByMode(filters, mode);
    if (availableIngredients.length < 2) {
      throw new Error("\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432 \u0434\u043B\u044F \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u043A\u043E\u043A\u0442\u0435\u0439\u043B\u044F \u0441 \u0437\u0430\u0434\u0430\u043D\u043D\u044B\u043C\u0438 \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u043C\u0438");
    }
    const glass = this.selectGlass(filters, mode);
    const candidates = [];
    const maxAttempts = 15;
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const recipe = this.generateSingleRecipe(availableIngredients, glass, mode, filters);
        if (this.validateRecipeForMode(recipe, mode, filters)) {
          candidates.push(recipe);
        }
      } catch (error) {
        continue;
      }
    }
    if (candidates.length === 0) {
      throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0438\u0439 \u0440\u0435\u0446\u0435\u043F\u0442. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B.");
    }
    candidates.sort((a, b) => b.matchScore - a.matchScore);
    return candidates[0];
  }
  /**
   * Фильтрует ингредиенты по правилам режима
   */
  filterIngredientsByMode(filters, mode) {
    return this.ingredients.filter((ingredient) => {
      if (mode.forbiddenCategories.includes(ingredient.category)) {
        return false;
      }
      if (ingredient.subtype && mode.forbiddenSubtypes.includes(ingredient.subtype)) {
        return false;
      }
      if (ingredient.category === "alcohol") {
        if (mode.allowedAlcoholSubtypes.length === 0) {
          return false;
        }
        if (ingredient.subtype && !mode.allowedAlcoholSubtypes.includes(ingredient.subtype)) {
          const matchesByName = mode.allowedAlcoholSubtypes.some(
            (subtype) => ingredient.name.toLowerCase().includes(subtype.toLowerCase())
          );
          if (!matchesByName) {
            return false;
          }
        }
      }
      if (filters.excludedIngredients?.includes(ingredient.id)) {
        return false;
      }
      if (filters.excludedCategories?.includes(ingredient.category)) {
        return false;
      }
      if (ingredient.subtype && filters.excludedSubtypes?.includes(ingredient.subtype)) {
        return false;
      }
      if (ingredient.category === "alcohol") {
        const abv = parseFloat(ingredient.abv?.toString() || "0");
        if (filters.maxAlcoholContent && abv > filters.maxAlcoholContent) {
        }
      }
      return true;
    });
  }
  /**
   * Выбирает подходящий стакан
   */
  selectGlass(filters, mode) {
    if (filters.glassType && filters.glassType !== "any") {
      const preferred = this.glassTypes.find((g) => g.shape === filters.glassType);
      if (preferred) return preferred;
    }
    const modeGlasses = this.glassTypes.filter((g) => mode.glassTypes.includes(g.shape));
    if (modeGlasses.length > 0) {
      return modeGlasses[Math.floor(Math.random() * modeGlasses.length)];
    }
    return this.glassTypes[Math.floor(Math.random() * this.glassTypes.length)];
  }
  /**
   * Генерирует один рецепт
   */
  generateSingleRecipe(availableIngredients, glass, mode, filters) {
    const targetVolume = glass.capacity;
    let ingredientCount;
    switch (filters.complexity) {
      case "simple":
        ingredientCount = mode.ingredientCount[0];
        break;
      case "complex":
        ingredientCount = mode.ingredientCount[1];
        break;
      default:
        ingredientCount = Math.floor(
          mode.ingredientCount[0] + Math.random() * (mode.ingredientCount[1] - mode.ingredientCount[0] + 1)
        );
    }
    const selectedIngredients = this.selectIngredientsForMode(
      availableIngredients,
      ingredientCount,
      mode,
      filters
    );
    if (selectedIngredients.length < 2) {
      throw new Error("\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u0438\u043C\u044B\u0445 \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432");
    }
    const recipeIngredients2 = this.calculateProportions(selectedIngredients, targetVolume, mode);
    const totalVolume = recipeIngredients2.filter((item) => item.unit !== "piece").reduce((sum, item) => sum + item.amount, 0);
    const totalAlcohol = recipeIngredients2.reduce((sum, item) => {
      if (item.unit === "piece") return sum;
      const abv = parseFloat(item.ingredient.abv?.toString() || "0");
      return sum + item.amount * (abv / 100);
    }, 0);
    const totalAbv = totalVolume > 0 ? totalAlcohol / totalVolume * 100 : 0;
    const totalCost = recipeIngredients2.reduce((sum, item) => {
      const pricePerLiter = parseFloat(item.ingredient.pricePerLiter?.toString() || "0");
      if (item.unit === "piece") return sum + pricePerLiter / 10;
      const isFruitOrGarnish = item.ingredient.category === "fruit" || item.ingredient.category === "garnish";
      const isGramBased = item.unit === "g" || item.unit === "kg";
      if (isFruitOrGarnish || isGramBased) {
        const pricePerKgInRubles = pricePerLiter / 100;
        const amountInKg = item.unit === "kg" ? item.amount : item.amount / 1e3;
        return sum + amountInKg * pricePerKgInRubles;
      }
      return sum + item.amount / 1e3 * pricePerLiter;
    }, 0);
    const tasteBalance = this.calculateTasteBalance(recipeIngredients2, totalVolume);
    const matchScore = this.calculateMatchScore(
      { totalAbv, totalCost, tasteBalance, ingredients: recipeIngredients2 },
      mode,
      filters
    );
    return {
      name: this.generateName(selectedIngredients, mode),
      description: this.generateDescription(selectedIngredients, mode),
      glass,
      ingredients: recipeIngredients2,
      totalVolume,
      totalAbv,
      totalCost,
      category: filters.mode,
      difficulty: this.calculateDifficulty(recipeIngredients2.length),
      tasteBalance,
      matchScore
    };
  }
  /**
   * Выбирает ингредиенты для режима с учётом совместимости
   */
  selectIngredientsForMode(available, count, mode, filters) {
    const selected = [];
    const byCategory = available.reduce((acc, ing) => {
      if (!acc[ing.category]) acc[ing.category] = [];
      acc[ing.category].push(ing);
      return acc;
    }, {});
    if (mode.name === "\u0411\u0435\u0437\u0430\u043B\u043A\u043E\u0433\u043E\u043B\u044C\u043D\u044B\u0439") {
      const minCategories = 3;
      const targetCategories = ["juice", "fruit", "syrup", "soda", "mixer"];
      const usedCategories = /* @__PURE__ */ new Set();
      const shuffledCategories = [...targetCategories].sort(() => Math.random() - 0.5);
      for (const cat of shuffledCategories) {
        if (selected.length >= count) break;
        const categoryItems = (byCategory[cat] || []).filter((ing) => !selected.includes(ing));
        if (categoryItems.length > 0) {
          const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
          selected.push(randomItem);
          usedCategories.add(cat);
        }
        if (usedCategories.size >= minCategories && selected.length >= 3) break;
      }
      while (selected.length < count) {
        const randomCat = shuffledCategories[Math.floor(Math.random() * shuffledCategories.length)];
        const categoryItems = (byCategory[randomCat] || []).filter((ing) => !selected.includes(ing));
        if (categoryItems.length > 0) {
          const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
          selected.push(randomItem);
        } else {
          break;
        }
      }
      return selected;
    }
    for (const reqCat of mode.requiredCategories) {
      const categoryItems = byCategory[reqCat] || [];
      if (categoryItems.length > 0) {
        const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
        if (!selected.includes(randomItem)) {
          selected.push(randomItem);
        }
      }
    }
    if (filters.requiredIngredients) {
      for (const reqId of filters.requiredIngredients) {
        const ing = available.find((i) => i.id === reqId);
        if (ing && !selected.includes(ing)) {
          selected.push(ing);
        }
      }
    }
    if (filters.requiredCategories) {
      for (const reqCat of filters.requiredCategories) {
        if (!selected.some((s) => s.category === reqCat)) {
          const categoryItems = byCategory[reqCat] || [];
          if (categoryItems.length > 0) {
            const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
            if (!selected.includes(randomItem)) {
              selected.push(randomItem);
            }
          }
        }
      }
    }
    const preferredCats = filters.preferredCategories?.length ? filters.preferredCategories : mode.preferredCategories;
    for (const prefCat of preferredCats) {
      if (selected.length >= count) break;
      const categoryItems = (byCategory[prefCat] || []).filter((ing) => !selected.includes(ing));
      if (categoryItems.length > 0) {
        const compatibleItems = categoryItems.filter(
          (ing) => this.isCompatibleWithSelected(ing, selected)
        );
        if (compatibleItems.length > 0) {
          const randomItem = compatibleItems[Math.floor(Math.random() * compatibleItems.length)];
          selected.push(randomItem);
        }
      }
    }
    const remainingItems = available.filter(
      (ing) => !selected.includes(ing) && this.isCompatibleWithSelected(ing, selected)
    );
    while (selected.length < count && remainingItems.length > 0) {
      const idx = Math.floor(Math.random() * remainingItems.length);
      selected.push(remainingItems[idx]);
      remainingItems.splice(idx, 1);
    }
    return selected;
  }
  /**
   * Проверяет совместимость ингредиента с уже выбранными
   */
  isCompatibleWithSelected(ingredient, selected) {
    for (const [group1, group2] of INCOMPATIBLE_COMBINATIONS) {
      const ingInGroup1 = group1.includes(ingredient.subtype || "") || group1.includes(ingredient.category);
      for (const sel of selected) {
        const selInGroup2 = group2.includes(sel.subtype || "") || group2.includes(sel.category);
        const selInGroup1 = group1.includes(sel.subtype || "") || group1.includes(sel.category);
        const ingInGroup2 = group2.includes(ingredient.subtype || "") || group2.includes(ingredient.category);
        if (ingInGroup1 && selInGroup2 || ingInGroup2 && selInGroup1) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * Валидирует рецепт на соответствие режиму
   */
  validateRecipeForMode(recipe, mode, filters) {
    if (recipe.totalAbv < mode.allowedAbvRange[0] || recipe.totalAbv > mode.allowedAbvRange[1]) {
      if (mode.strictness === "strict") {
        return false;
      }
    }
    if (filters.maxAlcoholContent && recipe.totalAbv > filters.maxAlcoholContent) {
      return false;
    }
    if (filters.minAlcoholContent && recipe.totalAbv < filters.minAlcoholContent) {
      return false;
    }
    if (filters.maxPrice && recipe.totalCost > filters.maxPrice) {
      return false;
    }
    for (const reqCat of mode.requiredCategories) {
      if (!recipe.ingredients.some((item) => item.ingredient.category === reqCat)) {
        return false;
      }
    }
    if (filters.requiredCategories) {
      for (const reqCat of filters.requiredCategories) {
        if (!recipe.ingredients.some((item) => item.ingredient.category === reqCat)) {
          return false;
        }
      }
    }
    if (filters.requiredIngredients) {
      for (const reqId of filters.requiredIngredients) {
        if (!recipe.ingredients.some((item) => item.ingredient.id === reqId)) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * Рассчитывает пропорции ингредиентов
   */
  calculateProportions(ingredients2, targetVolume, mode) {
    const roundTo5 = (value, min = 5) => {
      return Math.max(min, Math.round(value / 5) * 5);
    };
    const recipeIngredients2 = ingredients2.map((ingredient, index2) => {
      let baseAmount;
      const [minAlcRatio, maxAlcRatio] = mode.alcoholRatio;
      const avgAlcRatio = (minAlcRatio + maxAlcRatio) / 2;
      switch (ingredient.category) {
        case "alcohol":
          if (mode.allowedAlcoholSubtypes.length === 0) {
            baseAmount = 0;
          } else {
            baseAmount = targetVolume * avgAlcRatio;
          }
          break;
        case "juice":
          baseAmount = targetVolume * (1 - avgAlcRatio) * 0.6;
          break;
        case "syrup":
          baseAmount = targetVolume * 0.08;
          break;
        case "soda":
        case "mixer":
          baseAmount = targetVolume * 0.25;
          break;
        case "energy_drink":
          baseAmount = targetVolume * 0.3;
          break;
        case "bitter":
          baseAmount = 5;
          break;
        case "fruit":
          baseAmount = 30;
          break;
        case "garnish":
          baseAmount = 1;
          break;
        default:
          baseAmount = targetVolume * 0.15;
      }
      const variation = 0.8 + Math.random() * 0.4;
      const amount = baseAmount * variation;
      return {
        ingredient,
        amount: ingredient.unit === "piece" ? 1 : amount,
        unit: ingredient.category === "fruit" ? "g" : ingredient.unit,
        order: index2 + 1
      };
    });
    recipeIngredients2.forEach((item) => {
      if (item.unit !== "piece") {
        const minVal = item.ingredient.category === "fruit" ? 20 : 5;
        item.amount = roundTo5(item.amount, minVal);
      }
    });
    const currentVolume = recipeIngredients2.filter((item) => item.unit !== "piece").reduce((sum, item) => sum + item.amount, 0);
    if (currentVolume > 0 && currentVolume !== targetVolume) {
      const scale = targetVolume / currentVolume;
      recipeIngredients2.forEach((item) => {
        if (item.unit !== "piece") {
          const minVal = item.ingredient.category === "fruit" ? 20 : 5;
          item.amount = roundTo5(item.amount * scale, minVal);
        }
      });
    }
    return recipeIngredients2;
  }
  /**
   * Рассчитывает вкусовой баланс
   */
  calculateTasteBalance(ingredients2, totalVolume) {
    if (totalVolume === 0) {
      return { sweet: 5, sour: 5, bitter: 5, alcohol: 0 };
    }
    let sweet = 0, sour = 0, bitter = 0, alcohol = 0;
    ingredients2.forEach((item) => {
      if (item.unit === "piece") return;
      const ratio = item.amount / totalVolume;
      const profile = item.ingredient.tasteProfile || { sweet: 0, sour: 0, bitter: 0, alcohol: 0 };
      sweet += (profile.sweet || 0) * ratio;
      sour += (profile.sour || 0) * ratio;
      bitter += (profile.bitter || 0) * ratio;
      alcohol += (profile.alcohol || 0) * ratio;
    });
    return {
      sweet: Math.min(10, Math.round(sweet)),
      sour: Math.min(10, Math.round(sour)),
      bitter: Math.min(10, Math.round(bitter)),
      alcohol: Math.min(10, Math.round(alcohol))
    };
  }
  /**
   * Рассчитывает соответствие фильтрам
   */
  calculateMatchScore(recipe, mode, filters) {
    let score = 50;
    const [minAbv, maxAbv] = mode.allowedAbvRange;
    if (recipe.totalAbv >= minAbv && recipe.totalAbv <= maxAbv) {
      score += 20;
    } else {
      const deviation = Math.min(
        Math.abs(recipe.totalAbv - minAbv),
        Math.abs(recipe.totalAbv - maxAbv)
      );
      score -= Math.min(20, deviation);
    }
    if (filters.tastePreferences) {
      const prefs = filters.tastePreferences;
      ["sweet", "sour", "bitter", "alcohol"].forEach((taste) => {
        const pref = prefs[taste];
        if (pref !== void 0) {
          const diff = Math.abs(recipe.tasteBalance[taste] - pref);
          score += Math.max(0, 5 - diff);
        }
      });
    }
    if (filters.maxPrice) {
      if (recipe.totalCost <= filters.maxPrice * 0.7) {
        score += 10;
      } else if (recipe.totalCost <= filters.maxPrice) {
        score += 5;
      }
    }
    if (filters.requiredIngredients) {
      const hasAll = filters.requiredIngredients.every(
        (reqId) => recipe.ingredients.some((item) => item.ingredient.id === reqId)
      );
      if (hasAll) score += 10;
    }
    return Math.min(100, Math.max(0, score));
  }
  /**
   * Генерирует название коктейля
   */
  generateName(ingredients2, mode) {
    const adjectives = {
      classic: ["\u0417\u043E\u043B\u043E\u0442\u043E\u0439", "\u0420\u0443\u0431\u0438\u043D\u043E\u0432\u044B\u0439", "\u0418\u0437\u0443\u043C\u0440\u0443\u0434\u043D\u044B\u0439", "\u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u043A\u0438\u0439", "\u0411\u0430\u0440\u0445\u0430\u0442\u043D\u044B\u0439"],
      crazy: ["\u0414\u0438\u043A\u0438\u0439", "\u042F\u0440\u043A\u0438\u0439", "\u0411\u0435\u0437\u0443\u043C\u043D\u044B\u0439", "\u041E\u0433\u043D\u0435\u043D\u043D\u044B\u0439", "\u0412\u0437\u0440\u044B\u0432\u043D\u043E\u0439"],
      summer: ["\u041B\u0435\u0442\u043D\u0438\u0439", "\u0422\u0440\u043E\u043F\u0438\u0447\u0435\u0441\u043A\u0438\u0439", "\u0421\u043E\u043B\u043D\u0435\u0447\u043D\u044B\u0439", "\u0421\u0432\u0435\u0436\u0438\u0439", "\u041C\u043E\u0440\u0441\u043A\u043E\u0439"],
      nonalcoholic: ["\u0421\u043B\u0430\u0434\u043A\u0438\u0439", "\u0424\u0440\u0443\u043A\u0442\u043E\u0432\u044B\u0439", "\u042F\u0433\u043E\u0434\u043D\u044B\u0439", "\u041E\u0441\u0432\u0435\u0436\u0430\u044E\u0449\u0438\u0439", "\u041D\u0435\u0436\u043D\u044B\u0439"],
      shot: ["\u041A\u0440\u0435\u043F\u043A\u0438\u0439", "\u0416\u0433\u0443\u0447\u0438\u0439", "\u041E\u0441\u0442\u0440\u044B\u0439", "\u041F\u044B\u043B\u0430\u044E\u0449\u0438\u0439", "\u0420\u0435\u0437\u043A\u0438\u0439"],
      wine_cocktail: ["\u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434\u043D\u044B\u0439", "\u0411\u0430\u0440\u0445\u0430\u0442\u043D\u044B\u0439", "\u0420\u043E\u0437\u043E\u0432\u044B\u0439", "\u0418\u0433\u0440\u0438\u0441\u0442\u044B\u0439", "\u042D\u043B\u0435\u0433\u0430\u043D\u0442\u043D\u044B\u0439"],
      beer_cocktail: ["\u0425\u043C\u0435\u043B\u044C\u043D\u043E\u0439", "\u0421\u043E\u043B\u043E\u0434\u043E\u0432\u044B\u0439", "\u041F\u0435\u043D\u043D\u044B\u0439", "\u042F\u043D\u0442\u0430\u0440\u043D\u044B\u0439", "\u0421\u0432\u0435\u0442\u043B\u044B\u0439"],
      energy: ["\u042D\u043D\u0435\u0440\u0433\u0438\u0447\u043D\u044B\u0439", "\u0411\u043E\u0434\u0440\u044F\u0449\u0438\u0439", "\u0417\u0430\u0440\u044F\u0436\u0430\u044E\u0449\u0438\u0439", "\u041C\u043E\u043B\u043D\u0438\u0435\u043D\u043E\u0441\u043D\u044B\u0439", "\u041F\u0443\u043B\u044C\u0441\u0438\u0440\u0443\u044E\u0449\u0438\u0439"]
    };
    const nouns = {
      classic: ["\u0417\u0430\u043A\u0430\u0442", "\u0412\u0435\u0447\u0435\u0440", "\u041C\u043E\u043C\u0435\u043D\u0442", "\u0411\u0440\u0438\u0437", "\u0421\u043E\u043D"],
      crazy: ["\u0428\u0442\u043E\u0440\u043C", "\u0412\u0437\u0440\u044B\u0432", "\u0412\u0438\u0445\u0440\u044C", "\u0425\u0430\u043E\u0441", "\u0411\u0443\u0440\u044F"],
      summer: ["\u041F\u043B\u044F\u0436", "\u0411\u0440\u0438\u0437", "\u0412\u043E\u043B\u043D\u0430", "\u0420\u0430\u0441\u0441\u0432\u0435\u0442", "\u041F\u0440\u0438\u0431\u043E\u0439"],
      nonalcoholic: ["\u041C\u0435\u0447\u0442\u0430", "\u0420\u0430\u0434\u0443\u0433\u0430", "\u041E\u0431\u043B\u0430\u043A\u043E", "\u041D\u0435\u043A\u0442\u0430\u0440", "\u0420\u043E\u0441\u0430"],
      shot: ["\u0423\u0434\u0430\u0440", "\u0412\u044B\u0441\u0442\u0440\u0435\u043B", "\u0412\u0441\u043F\u044B\u0448\u043A\u0430", "\u041C\u043E\u043B\u043D\u0438\u044F", "\u0413\u0440\u043E\u043C"],
      wine_cocktail: ["\u0417\u0430\u043A\u0430\u0442", "\u0421\u0430\u0434", "\u0414\u043E\u043B\u0438\u043D\u0430", "\u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434\u043D\u0438\u043A", "\u0411\u043E\u043A\u0430\u043B"],
      beer_cocktail: ["\u041A\u0440\u0443\u0436\u043A\u0430", "\u041F\u0435\u043D\u0430", "\u0412\u0435\u0447\u0435\u0440", "\u0411\u043E\u0447\u043A\u0430", "\u041F\u043E\u0433\u0440\u0435\u0431"],
      energy: ["\u0417\u0430\u0440\u044F\u0434", "\u0418\u043C\u043F\u0443\u043B\u044C\u0441", "\u0422\u043E\u043B\u0447\u043E\u043A", "\u0421\u0442\u0430\u0440\u0442", "\u0420\u044B\u0432\u043E\u043A"]
    };
    const modeKey = mode.name.toLowerCase().includes("\u0431\u0435\u0437\u0430\u043B\u043A\u043E\u0433\u043E\u043B\u044C\u043D\u044B\u0439") ? "nonalcoholic" : mode.name.toLowerCase().includes("\u043B\u0435\u0442\u043D\u0438\u0439") ? "summer" : mode.name.toLowerCase().includes("\u0441\u0443\u043C\u0430\u0441\u0448\u0435\u0434\u0448\u0438\u0439") ? "crazy" : mode.name.toLowerCase().includes("\u0448\u043E\u0442") ? "shot" : mode.name.toLowerCase().includes("\u0432\u0438\u043D\u043D\u044B\u0439") ? "wine_cocktail" : mode.name.toLowerCase().includes("\u043F\u0438\u0432\u043D\u043E\u0439") ? "beer_cocktail" : mode.name.toLowerCase().includes("\u044D\u043D\u0435\u0440\u0433\u0435\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439") ? "energy" : "classic";
    const adj = adjectives[modeKey] || adjectives.classic;
    const noun = nouns[modeKey] || nouns.classic;
    return `${adj[Math.floor(Math.random() * adj.length)]} ${noun[Math.floor(Math.random() * noun.length)]}`;
  }
  /**
   * Генерирует описание коктейля
   */
  generateDescription(ingredients2, mode) {
    const mainIngredients = ingredients2.slice(0, 3).map((ing) => ing.name).join(", ");
    return `${mode.description}. \u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u044B: ${mainIngredients}.`;
  }
  /**
   * Определяет сложность рецепта
   */
  calculateDifficulty(ingredientCount) {
    if (ingredientCount <= 3) return "easy";
    if (ingredientCount <= 5) return "medium";
    return "hard";
  }
};
function generateEnhancedRecipe(ingredients2, glassTypes2, mode, filters) {
  const generator = new EnhancedCocktailGenerator(ingredients2, glassTypes2);
  const generationFilters = {
    mode,
    ...filters
  };
  return generator.generateCocktail(generationFilters);
}
var AVAILABLE_MODES = Object.entries(GENERATION_MODES).map(([id, config]) => ({
  id,
  name: config.name,
  description: config.description,
  allowedAbvRange: config.allowedAbvRange
}));

// server/admin-routes.ts
init_storage();
init_admin_middleware();
init_schema();
import { z as z2 } from "zod";
function registerAdminRoutes(app2) {
  app2.get(
    "/api/admin/dashboard",
    adminAuth,
    requirePermission("access:admin_panel"),
    async (req, res) => {
      try {
        const [
          totalUsers,
          totalRecipes,
          totalIngredients,
          recentRecipes,
          recentUsers
        ] = await Promise.all([
          storage.getUsersCount?.() || 0,
          storage.getRecipesCount?.() || 0,
          storage.getIngredientsCount?.() || 0,
          storage.getRecentRecipes?.(5) || [],
          storage.getRecentUsers?.(5) || []
        ]);
        res.json({
          stats: {
            totalUsers,
            totalRecipes,
            totalIngredients,
            activeUsers: totalUsers
            // TODO: реализовать подсчет активных пользователей
          },
          recentActivity: {
            recipes: recentRecipes,
            users: recentUsers
          }
        });
      } catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438" });
      }
    }
  );
  app2.get(
    "/api/admin/ingredients",
    adminAuth,
    requirePermission("read:ingredients"),
    async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const category = req.query.category;
        const search = req.query.search;
        const ingredients2 = await storage.getIngredients();
        let filtered = ingredients2;
        if (category) {
          filtered = filtered.filter((ing) => ing.category === category);
        }
        if (search) {
          filtered = filtered.filter(
            (ing) => ing.name.toLowerCase().includes(search.toLowerCase())
          );
        }
        const total = filtered.length;
        const offset = (page - 1) * limit;
        const paginatedIngredients = filtered.slice(offset, offset + limit);
        res.json({
          ingredients: paginatedIngredients,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        console.error("Admin ingredients error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432" });
      }
    }
  );
  app2.post(
    "/api/admin/ingredients",
    adminAuth,
    requirePermission("create:ingredients"),
    logAdminAction("CREATE_INGREDIENT"),
    async (req, res) => {
      try {
        const validatedData = insertIngredientSchema.parse(req.body);
        const ingredient = await storage.createIngredient(validatedData);
        res.status(201).json({
          message: "\u0418\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442 \u0441\u043E\u0437\u0434\u0430\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E",
          ingredient
        });
      } catch (error) {
        if (error instanceof z2.ZodError) {
          return res.status(400).json({
            message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0438 \u0434\u0430\u043D\u043D\u044B\u0445",
            errors: error.errors
          });
        }
        console.error("Create ingredient error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u0430" });
      }
    }
  );
  app2.put(
    "/api/admin/ingredients/:id",
    adminAuth,
    requirePermission("update:ingredients"),
    logAdminAction("UPDATE_INGREDIENT"),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const validatedData = insertIngredientSchema.partial().parse(req.body);
        const ingredient = await storage.updateIngredient?.(id, validatedData);
        if (!ingredient) {
          return res.status(404).json({ message: "\u0418\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
        }
        res.json({
          message: "\u0418\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E",
          ingredient
        });
      } catch (error) {
        if (error instanceof z2.ZodError) {
          return res.status(400).json({
            message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0438 \u0434\u0430\u043D\u043D\u044B\u0445",
            errors: error.errors
          });
        }
        console.error("Update ingredient error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u0430" });
      }
    }
  );
  app2.delete(
    "/api/admin/ingredients/:id",
    adminAuth,
    requirePermission("delete:ingredients"),
    logAdminAction("DELETE_INGREDIENT"),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const success = await storage.deleteIngredient?.(id);
        if (!success) {
          return res.status(404).json({ message: "\u0418\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
        }
        res.json({ message: "\u0418\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442 \u0443\u0434\u0430\u043B\u0435\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E" });
      } catch (error) {
        console.error("Delete ingredient error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u0430" });
      }
    }
  );
  app2.get(
    "/api/admin/recipes",
    adminAuth,
    requirePermission("read:recipes"),
    async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status;
        const search = req.query.search;
        const recipes2 = await storage.getRecipes();
        let filtered = recipes2;
        if (search) {
          filtered = filtered.filter(
            (recipe) => recipe.name.toLowerCase().includes(search.toLowerCase())
          );
        }
        const total = filtered.length;
        const offset = (page - 1) * limit;
        const paginatedRecipes = filtered.slice(offset, offset + limit);
        res.json({
          recipes: paginatedRecipes,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        console.error("Admin recipes error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0440\u0435\u0446\u0435\u043F\u0442\u043E\u0432" });
      }
    }
  );
  app2.put(
    "/api/admin/recipes/:id/status",
    adminAuth,
    requirePermission("moderate:content"),
    logAdminAction("MODERATE_RECIPE"),
    async (req, res) => {
      try {
        const recipeId = req.params.id;
        const { status, reason } = req.body;
        if (!["published", "rejected", "pending"].includes(status)) {
          return res.status(400).json({
            message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0441\u0442\u0430\u0442\u0443\u0441. \u0414\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0435: published, rejected, pending"
          });
        }
        res.json({
          message: `\u0421\u0442\u0430\u0442\u0443\u0441 \u0440\u0435\u0446\u0435\u043F\u0442\u0430 \u0438\u0437\u043C\u0435\u043D\u0435\u043D \u043D\u0430 ${status}`
          // recipe
        });
      } catch (error) {
        console.error("Update recipe status error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0441\u0442\u0430\u0442\u0443\u0441\u0430 \u0440\u0435\u0446\u0435\u043F\u0442\u0430" });
      }
    }
  );
  app2.delete(
    "/api/admin/recipes/:id",
    adminAuth,
    requirePermission("delete:recipes"),
    logAdminAction("DELETE_RECIPE"),
    async (req, res) => {
      try {
        const recipeId = req.params.id;
        const success = await storage.deleteRecipe?.(recipeId);
        if (!success) {
          return res.status(404).json({ message: "\u0420\u0435\u0446\u0435\u043F\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
        }
        res.json({ message: "\u0420\u0435\u0446\u0435\u043F\u0442 \u0443\u0434\u0430\u043B\u0435\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E" });
      } catch (error) {
        console.error("Delete recipe error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u0440\u0435\u0446\u0435\u043F\u0442\u0430" });
      }
    }
  );
  app2.get(
    "/api/admin/users",
    adminAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search;
        const users2 = await storage.getUsers?.() || [];
        let filtered = users2;
        if (search) {
          filtered = filtered.filter(
            (user) => user.email.toLowerCase().includes(search.toLowerCase()) || user.nickname.toLowerCase().includes(search.toLowerCase())
          );
        }
        const total = filtered.length;
        const offset = (page - 1) * limit;
        const paginatedUsers = filtered.slice(offset, offset + limit);
        const safeUsers = paginatedUsers.map((user) => ({
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          role: user.role || "user" /* USER */,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }));
        res.json({
          users: safeUsers,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        console.error("Admin users error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439" });
      }
    }
  );
  app2.put(
    "/api/admin/users/:id/role",
    adminAuth,
    requireAdmin,
    logAdminAction("CHANGE_USER_ROLE"),
    async (req, res) => {
      try {
        const userId = req.params.id;
        const { role } = req.body;
        if (!Object.values(UserRole).includes(role)) {
          return res.status(400).json({
            message: "\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0440\u043E\u043B\u044C. \u0414\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0435: user, moderator, admin"
          });
        }
        if (userId === req.user?.id) {
          return res.status(400).json({
            message: "\u041D\u0435\u043B\u044C\u0437\u044F \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u0443\u044E \u0440\u043E\u043B\u044C"
          });
        }
        res.json({
          message: `\u0420\u043E\u043B\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0430 \u043D\u0430 ${role}`
          // user: { id: user.id, email: user.email, role: user.role }
        });
      } catch (error) {
        console.error("Change user role error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0440\u043E\u043B\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" });
      }
    }
  );
  app2.post(
    "/api/admin/system/init-ingredients",
    adminAuth,
    requireAdmin,
    logAdminAction("INIT_INGREDIENTS"),
    async (req, res) => {
      try {
        const { initializeExtendedIngredients: initializeExtendedIngredients2 } = await Promise.resolve().then(() => (init_init_extended_ingredients(), init_extended_ingredients_exports));
        await initializeExtendedIngredients2();
        res.json({
          message: "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D"
        });
      } catch (error) {
        console.error("Init ingredients error:", error);
        res.status(500).json({
          message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u043E\u0432",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  );
  app2.get(
    "/api/admin/system/stats",
    adminAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const stats = {
          database: {
            connected: true,
            // TODO: реальная проверка подключения к БД
            type: process.env.DATABASE_URL ? "PostgreSQL" : "Memory"
          },
          server: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            nodeVersion: process.version
          },
          application: {
            version: "1.0.0",
            // TODO: получать из package.json
            environment: process.env.NODE_ENV || "development"
          }
        };
        res.json(stats);
      } catch (error) {
        console.error("System stats error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u043D\u043E\u0439 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438" });
      }
    }
  );
  app2.get(
    "/api/admin/permissions",
    adminAuth,
    async (req, res) => {
      try {
        const userRole = req.user?.role || "user" /* USER */;
        const { getUserPermissions: getUserPermissions2 } = await Promise.resolve().then(() => (init_admin_middleware(), admin_middleware_exports));
        const permissions = getUserPermissions2(userRole);
        res.json({
          role: userRole,
          permissions
        });
      } catch (error) {
        console.error("Get permissions error:", error);
        res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043F\u0440\u0430\u0432 \u0434\u043E\u0441\u0442\u0443\u043F\u0430" });
      }
    }
  );
}

// server/routes.ts
init_schema();
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", optionalAuth, async (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });
  app2.patch("/api/auth/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { nickname, profileImageUrl } = req.body;
      if (!nickname || nickname.trim().length < 2) {
        return res.status(400).json({ error: "Nickname must be at least 2 characters" });
      }
      const updatedUser = await storage.updateUserProfile(userId, {
        nickname: nickname.trim(),
        profileImageUrl: profileImageUrl || void 0
      });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  app2.get("/api/ingredients", async (req, res) => {
    try {
      const { category } = req.query;
      const ingredients2 = category ? await storage.getIngredientsByCategory(category) : await storage.getIngredients();
      res.json(ingredients2);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      res.status(500).json({ message: "Failed to fetch ingredients" });
    }
  });
  app2.post("/api/ingredients", async (req, res) => {
    try {
      const ingredient = insertIngredientSchema.parse(req.body);
      const newIngredient = await storage.createIngredient(ingredient);
      res.status(201).json(newIngredient);
    } catch (error) {
      console.error("Error creating ingredient:", error);
      res.status(500).json({ message: "Failed to create ingredient" });
    }
  });
  app2.get("/api/glass-types", async (req, res) => {
    try {
      const glassTypes2 = await storage.getGlassTypes();
      res.json(glassTypes2);
    } catch (error) {
      console.error("Error fetching glass types:", error);
      res.status(500).json({ message: "Failed to fetch glass types" });
    }
  });
  app2.get("/api/glass-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const glassType = await storage.getGlassType(id);
      if (!glassType) {
        return res.status(404).json({ message: "Glass type not found" });
      }
      res.json(glassType);
    } catch (error) {
      console.error("Error fetching glass type:", error);
      res.status(500).json({ message: "Failed to fetch glass type" });
    }
  });
  app2.post("/api/glass-types", async (req, res) => {
    try {
      const glassType = insertGlassTypeSchema.parse(req.body);
      const newGlassType = await storage.createGlassType(glassType);
      res.status(201).json(newGlassType);
    } catch (error) {
      console.error("Error creating glass type:", error);
      res.status(500).json({ message: "Failed to create glass type" });
    }
  });
  app2.get("/api/recipes", async (req, res) => {
    try {
      const { limit = 20, offset = 0, search, category, difficulty } = req.query;
      let recipes2;
      if (search || category || difficulty) {
        recipes2 = await storage.searchRecipes(
          search || "",
          category,
          difficulty
        );
      } else {
        recipes2 = await storage.getRecipes(
          parseInt(limit),
          parseInt(offset)
        );
      }
      res.json(recipes2);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });
  app2.get("/api/recipes/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const userRecipes = await storage.getUserRecipes(userId);
      res.json(userRecipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      res.status(500).json({ message: "Failed to fetch user recipes" });
    }
  });
  app2.get("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await storage.getRecipeWithIngredients(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });
  app2.post("/api/recipes", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const recipeData = insertRecipeSchema.parse({
        ...req.body,
        createdBy: userId
      });
      const recipe = await storage.createRecipe(recipeData);
      if (req.body.ingredients && Array.isArray(req.body.ingredients)) {
        for (const ingredient of req.body.ingredients) {
          await storage.createRecipeIngredient({
            recipeId: recipe.id,
            ...ingredient
          });
        }
      }
      res.status(201).json(recipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });
  app2.put("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await storage.getRecipe(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      const updateData = insertRecipeSchema.partial().parse(req.body);
      const updatedRecipe = await storage.updateRecipe(req.params.id, updateData);
      if (req.body.ingredients && Array.isArray(req.body.ingredients)) {
        await storage.deleteRecipeIngredients(req.params.id);
        for (const ingredient of req.body.ingredients) {
          await storage.createRecipeIngredient({
            recipeId: req.params.id,
            ...ingredient
          });
        }
      }
      res.json(updatedRecipe);
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });
  app2.delete("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await storage.getRecipe(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      await storage.deleteRecipe(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });
  app2.get("/api/users/:userId/recipes", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      res.status(500).json({ message: "Failed to fetch user recipes" });
    }
  });
  app2.get("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites.map((fav) => fav.recipe));
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      res.status(500).json({ message: "Failed to fetch user favorites" });
    }
  });
  app2.post("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { recipeId } = req.body;
      if (!recipeId) {
        return res.status(400).json({ error: "Recipe ID is required" });
      }
      const recipe = await storage.getRecipe(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      const isAlreadyFavorite = await storage.isUserFavorite(userId, recipeId);
      if (isAlreadyFavorite) {
        return res.status(409).json({ error: "Recipe already in favorites" });
      }
      const favorite = await storage.addUserFavorite(userId, recipeId);
      res.status(201).json({
        message: "Recipe added to favorites",
        favorite
      });
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });
  app2.delete("/api/favorites/:recipeId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { recipeId } = req.params;
      const isInFavorites = await storage.isUserFavorite(userId, recipeId);
      if (!isInFavorites) {
        return res.status(404).json({ error: "Recipe not found in favorites" });
      }
      await storage.removeUserFavorite(userId, recipeId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });
  app2.get("/api/recipes/:recipeId/ratings", async (req, res) => {
    try {
      const ratings = await storage.getRecipeRatings(req.params.recipeId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching recipe ratings:", error);
      res.status(500).json({ message: "Failed to fetch recipe ratings" });
    }
  });
  app2.post("/api/recipes/:recipeId/ratings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { recipeId } = req.params;
      const { rating, review } = req.body;
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }
      const recipe = await storage.getRecipe(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      const existingRating = await storage.getUserRecipeRating(userId, recipeId);
      let result;
      if (existingRating) {
        result = await storage.updateRecipeRating(userId, recipeId, rating, review);
        res.json({
          message: "Rating updated successfully",
          rating: result
        });
      } else {
        result = await storage.createRecipeRating({
          userId,
          recipeId,
          rating,
          review: review || null
        });
        res.status(201).json({
          message: "Rating added successfully",
          rating: result
        });
      }
    } catch (error) {
      console.error("Error creating/updating rating:", error);
      res.status(500).json({ message: "Failed to create/update rating" });
    }
  });
  app2.get("/api/recipes/:recipeId/ratings/my", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { recipeId } = req.params;
      const rating = await storage.getUserRecipeRating(userId, recipeId);
      if (!rating) {
        return res.status(404).json({ error: "No rating found for this recipe" });
      }
      res.json(rating);
    } catch (error) {
      console.error("Error fetching user rating:", error);
      res.status(500).json({ message: "Failed to fetch user rating" });
    }
  });
  app2.get("/api/favorites/:recipeId/check", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { recipeId } = req.params;
      const isFavorite = await storage.isUserFavorite(userId, recipeId);
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });
  app2.post("/api/recipes/generate", async (req, res) => {
    try {
      const {
        mode = "classic",
        requiredIngredients,
        requiredCategories,
        excludedIngredients,
        excludedSubtypes,
        excludedCategories,
        maxAlcoholContent,
        minAlcoholContent,
        maxPrice,
        preferredCategories,
        preferredSubtypes,
        glassType,
        complexity,
        tastePreferences
      } = req.body;
      const ingredients2 = await storage.getIngredients();
      const glassTypes2 = await storage.getGlassTypes();
      const generatedRecipe = generateEnhancedRecipe(ingredients2, glassTypes2, mode, {
        requiredIngredients,
        requiredCategories,
        excludedIngredients,
        excludedSubtypes,
        excludedCategories,
        maxAlcoholContent,
        minAlcoholContent,
        maxPrice,
        preferredCategories,
        preferredSubtypes,
        glassType,
        complexity,
        tastePreferences
      });
      res.json(generatedRecipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
      res.status(500).json({
        message: error.message || "Failed to generate recipe"
      });
    }
  });
  app2.get("/api/recipes/generation-modes", async (req, res) => {
    res.json(AVAILABLE_MODES);
  });
  app2.post("/api/admin/force-seed", async (req, res) => {
    const { secret } = req.body;
    const adminSecret = process.env.ADMIN_SEED_SECRET || "cocktailo-force-seed-2024";
    if (secret !== adminSecret) {
      return res.status(403).json({ error: "Invalid secret" });
    }
    try {
      const { forceSeedIngredients: forceSeedIngredients2 } = await Promise.resolve().then(() => (init_seed(), seed_exports));
      await forceSeedIngredients2();
      const ingredients2 = await storage.getIngredients();
      res.json({
        success: true,
        message: `Database re-seeded with ${ingredients2.length} ingredients`
      });
    } catch (error) {
      console.error("Force seed error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  registerAdminRoutes(app2);
  if (process.env.VERCEL) {
    return null;
  }
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vercel-entry.ts
init_seed();
var app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
function log(message) {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [express] ${message}`);
}
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
var isInitialized = false;
async function initializeApp() {
  if (isInitialized) return app;
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgresql")) {
    await seedDatabase();
  }
  await registerRoutes(app);
  app.use((err, req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`Error on ${req.method} ${req.path}:`, err);
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });
  isInitialized = true;
  return app;
}
var vercel_entry_default = app;
export {
  vercel_entry_default as default,
  initializeApp
};
