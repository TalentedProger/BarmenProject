import {
  users,
  ingredients,
  glassTypes,
  recipes,
  recipeIngredients,
  userFavorites,
  recipeRatings,
  type User,
  type UpsertUser,
  type Ingredient,
  type InsertIngredient,
  type GlassType,
  type InsertGlassType,
  type Recipe,
  type InsertRecipe,
  type RecipeIngredient,
  type InsertRecipeIngredient,
  type UserFavorite,
  type InsertUserFavorite,
  type RecipeRating,
  type InsertRecipeRating,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Ingredient operations
  getIngredients(): Promise<Ingredient[]>;
  getIngredientsByCategory(category: string): Promise<Ingredient[]>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;

  // Glass type operations
  getGlassTypes(): Promise<GlassType[]>;
  getGlassType(id: number): Promise<GlassType | undefined>;
  createGlassType(glassType: InsertGlassType): Promise<GlassType>;

  // Recipe operations
  getRecipes(limit?: number, offset?: number): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | undefined>;
  getRecipeWithIngredients(id: string): Promise<(Recipe & { ingredients: (RecipeIngredient & { ingredient: Ingredient })[] }) | undefined>;
  getUserRecipes(userId: string): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: string, recipe: Partial<InsertRecipe>): Promise<Recipe>;
  deleteRecipe(id: string): Promise<void>;
  searchRecipes(query: string, category?: string, difficulty?: string): Promise<Recipe[]>;

  // Recipe ingredient operations
  getRecipeIngredients(recipeId: string): Promise<(RecipeIngredient & { ingredient: Ingredient })[]>;
  createRecipeIngredient(recipeIngredient: InsertRecipeIngredient): Promise<RecipeIngredient>;
  deleteRecipeIngredients(recipeId: string): Promise<void>;

  // User favorite operations
  getUserFavorites(userId: string): Promise<(UserFavorite & { recipe: Recipe })[]>;
  addUserFavorite(userId: string, recipeId: string): Promise<UserFavorite>;
  removeUserFavorite(userId: string, recipeId: string): Promise<void>;
  isUserFavorite(userId: string, recipeId: string): Promise<boolean>;

  // Recipe rating operations
  getRecipeRatings(recipeId: string): Promise<RecipeRating[]>;
  createRecipeRating(rating: InsertRecipeRating): Promise<RecipeRating>;
  updateRecipeRating(userId: string, recipeId: string, rating: number, review?: string): Promise<RecipeRating>;
  getUserRecipeRating(userId: string, recipeId: string): Promise<RecipeRating | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Ingredient operations
  async getIngredients(): Promise<Ingredient[]> {
    return await db.select().from(ingredients).orderBy(ingredients.category, ingredients.name);
  }

  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    return await db.select().from(ingredients).where(eq(ingredients.category, category)).orderBy(ingredients.name);
  }

  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const [newIngredient] = await db.insert(ingredients).values(ingredient).returning();
    return newIngredient;
  }

  // Glass type operations
  async getGlassTypes(): Promise<GlassType[]> {
    return await db.select().from(glassTypes).orderBy(glassTypes.name);
  }

  async getGlassType(id: number): Promise<GlassType | undefined> {
    const [glassType] = await db.select().from(glassTypes).where(eq(glassTypes.id, id));
    return glassType;
  }

  async createGlassType(glassType: InsertGlassType): Promise<GlassType> {
    const [newGlassType] = await db.insert(glassTypes).values(glassType).returning();
    return newGlassType;
  }

  // Recipe operations
  async getRecipes(limit = 20, offset = 0): Promise<Recipe[]> {
    return await db.select().from(recipes)
      .where(eq(recipes.isPublic, true))
      .orderBy(desc(recipes.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getRecipe(id: string): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe;
  }

  async getRecipeWithIngredients(id: string): Promise<(Recipe & { ingredients: (RecipeIngredient & { ingredient: Ingredient })[] }) | undefined> {
    const recipe = await this.getRecipe(id);
    if (!recipe) return undefined;

    const ingredients = await this.getRecipeIngredients(id);
    return { ...recipe, ingredients };
  }

  async getUserRecipes(userId: string): Promise<Recipe[]> {
    return await db.select().from(recipes)
      .where(eq(recipes.createdBy, userId))
      .orderBy(desc(recipes.createdAt));
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const [newRecipe] = await db.insert(recipes).values(recipe).returning();
    return newRecipe;
  }

  async updateRecipe(id: string, recipe: Partial<InsertRecipe>): Promise<Recipe> {
    const [updatedRecipe] = await db.update(recipes)
      .set({ ...recipe, updatedAt: new Date() })
      .where(eq(recipes.id, id))
      .returning();
    return updatedRecipe;
  }

  async deleteRecipe(id: string): Promise<void> {
    await db.delete(recipes).where(eq(recipes.id, id));
  }

  async searchRecipes(query: string, category?: string, difficulty?: string): Promise<Recipe[]> {
    let conditions = [eq(recipes.isPublic, true)];
    
    if (query) {
      conditions.push(
        or(
          ilike(recipes.name, `%${query}%`),
          ilike(recipes.description, `%${query}%`)
        )!
      );
    }
    
    if (category) {
      conditions.push(eq(recipes.category, category));
    }
    
    if (difficulty) {
      conditions.push(eq(recipes.difficulty, difficulty));
    }

    return await db.select().from(recipes)
      .where(and(...conditions))
      .orderBy(desc(recipes.rating), desc(recipes.createdAt));
  }

  // Recipe ingredient operations
  async getRecipeIngredients(recipeId: string): Promise<(RecipeIngredient & { ingredient: Ingredient })[]> {
    return await db.select()
      .from(recipeIngredients)
      .leftJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
      .where(eq(recipeIngredients.recipeId, recipeId))
      .orderBy(recipeIngredients.order)
      .then(rows => rows.map(row => ({
        ...row.recipe_ingredients,
        ingredient: row.ingredients!
      })));
  }

  async createRecipeIngredient(recipeIngredient: InsertRecipeIngredient): Promise<RecipeIngredient> {
    const [newRecipeIngredient] = await db.insert(recipeIngredients).values(recipeIngredient).returning();
    return newRecipeIngredient;
  }

  async deleteRecipeIngredients(recipeId: string): Promise<void> {
    await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeId));
  }

  // User favorite operations
  async getUserFavorites(userId: string): Promise<(UserFavorite & { recipe: Recipe })[]> {
    return await db.select()
      .from(userFavorites)
      .leftJoin(recipes, eq(userFavorites.recipeId, recipes.id))
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt))
      .then(rows => rows.map(row => ({
        ...row.user_favorites,
        recipe: row.recipes!
      })));
  }

  async addUserFavorite(userId: string, recipeId: string): Promise<UserFavorite> {
    const [favorite] = await db.insert(userFavorites).values({ userId, recipeId }).returning();
    return favorite;
  }

  async removeUserFavorite(userId: string, recipeId: string): Promise<void> {
    await db.delete(userFavorites).where(
      and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.recipeId, recipeId)
      )
    );
  }

  async isUserFavorite(userId: string, recipeId: string): Promise<boolean> {
    const [favorite] = await db.select().from(userFavorites).where(
      and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.recipeId, recipeId)
      )
    );
    return !!favorite;
  }

  // Recipe rating operations
  async getRecipeRatings(recipeId: string): Promise<RecipeRating[]> {
    return await db.select().from(recipeRatings)
      .where(eq(recipeRatings.recipeId, recipeId))
      .orderBy(desc(recipeRatings.createdAt));
  }

  async createRecipeRating(rating: InsertRecipeRating): Promise<RecipeRating> {
    const [newRating] = await db.insert(recipeRatings).values(rating).returning();
    
    // Update recipe average rating
    const ratings = await this.getRecipeRatings(rating.recipeId!);
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    await db.update(recipes)
      .set({ 
        rating: avgRating.toFixed(2),
        ratingCount: ratings.length
      })
      .where(eq(recipes.id, rating.recipeId!));

    return newRating;
  }

  async updateRecipeRating(userId: string, recipeId: string, rating: number, review?: string): Promise<RecipeRating> {
    const [updatedRating] = await db.update(recipeRatings)
      .set({ rating, review })
      .where(
        and(
          eq(recipeRatings.userId, userId),
          eq(recipeRatings.recipeId, recipeId)
        )
      )
      .returning();

    // Update recipe average rating
    const ratings = await this.getRecipeRatings(recipeId);
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    await db.update(recipes)
      .set({ 
        rating: avgRating.toFixed(2),
        ratingCount: ratings.length
      })
      .where(eq(recipes.id, recipeId));

    return updatedRating;
  }

  async getUserRecipeRating(userId: string, recipeId: string): Promise<RecipeRating | undefined> {
    const [rating] = await db.select().from(recipeRatings).where(
      and(
        eq(recipeRatings.userId, userId),
        eq(recipeRatings.recipeId, recipeId)
      )
    );
    return rating;
  }
}

export const storage = new DatabaseStorage();
