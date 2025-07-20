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
import { nanoid } from "nanoid";
import { db } from "./db";
import { eq, and, desc, asc, ilike, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for authentication)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
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

export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private ingredients: Map<number, Ingredient> = new Map();
  private glassTypes: Map<number, GlassType> = new Map();
  private recipes: Map<string, Recipe> = new Map();
  private recipeIngredients: Map<string, RecipeIngredient[]> = new Map();
  private userFavorites: Map<string, UserFavorite[]> = new Map();
  private recipeRatings: Map<string, RecipeRating[]> = new Map();
  private nextId = { ingredient: 1, glassType: 1, rating: 1, favorite: 1, recipeIngredient: 1 };

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample ingredients
    const sampleIngredients: InsertIngredient[] = [
      {
        name: "Водка",
        category: "alcohol",
        color: "#ffffff",
        abv: "40.00",
        pricePerLiter: "1500.00",
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 8 },
        unit: "ml"
      },
      {
        name: "Ром",
        category: "alcohol", 
        color: "#8B4513",
        abv: "40.00",
        pricePerLiter: "2000.00",
        tasteProfile: { sweet: 3, sour: 0, bitter: 0, alcohol: 8 },
        unit: "ml"
      },
      {
        name: "Апельсиновый сок",
        category: "juice",
        color: "#FFA500",
        abv: "0.00",
        pricePerLiter: "300.00",
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "Лимонный сок",
        category: "juice",
        color: "#FFFF00",
        abv: "0.00",
        pricePerLiter: "400.00",
        tasteProfile: { sweet: 1, sour: 9, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "Простой сироп",
        category: "syrup",
        color: "#F5F5DC",
        abv: "0.00",
        pricePerLiter: "200.00",
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "Лед",
        category: "ice",
        color: "#E0E0E0",
        abv: "0.00",
        pricePerLiter: "50.00",
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 },
        unit: "g"
      }
    ];

    sampleIngredients.forEach(ingredient => {
      const id = this.nextId.ingredient++;
      this.ingredients.set(id, {
        id,
        ...ingredient,
        abv: ingredient.abv || null,
        unit: ingredient.unit || "ml",
        createdAt: new Date()
      } as Ingredient);
    });

    // Initialize sample glass types
    const sampleGlassTypes: InsertGlassType[] = [
      { name: "Мартини", capacity: 180, shape: "martini" },
      { name: "Хайбол", capacity: 350, shape: "highball" },
      { name: "Олд фэшенд", capacity: 250, shape: "old-fashioned" },
      { name: "Шот", capacity: 50, shape: "shot" }
    ];

    sampleGlassTypes.forEach(glassType => {
      const id = this.nextId.glassType++;
      this.glassTypes.set(id, {
        id,
        ...glassType,
        createdAt: new Date()
      });
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.googleId === googleId);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      googleId: userData.googleId || null,
      updatedAt: new Date(),
      createdAt: this.users.get(userData.id)?.createdAt || new Date()
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Ingredient operations
  async getIngredients(): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values()).sort((a, b) => 
      a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    );
  }

  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values())
      .filter(ingredient => ingredient.category === category)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const id = this.nextId.ingredient++;
    const newIngredient: Ingredient = {
      id,
      ...ingredient,
      abv: ingredient.abv || null,
      unit: ingredient.unit || "ml",
      createdAt: new Date()
    };
    this.ingredients.set(id, newIngredient);
    return newIngredient;
  }

  // Glass type operations
  async getGlassTypes(): Promise<GlassType[]> {
    return Array.from(this.glassTypes.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getGlassType(id: number): Promise<GlassType | undefined> {
    return this.glassTypes.get(id);
  }

  async createGlassType(glassType: InsertGlassType): Promise<GlassType> {
    const id = this.nextId.glassType++;
    const newGlassType: GlassType = {
      id,
      ...glassType,
      createdAt: new Date()
    };
    this.glassTypes.set(id, newGlassType);
    return newGlassType;
  }

  // Recipe operations
  async getRecipes(limit = 20, offset = 0): Promise<Recipe[]> {
    const publicRecipes = Array.from(this.recipes.values())
      .filter(recipe => recipe.isPublic)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    return publicRecipes.slice(offset, offset + limit);
  }

  async getRecipe(id: string): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async getRecipeWithIngredients(id: string): Promise<(Recipe & { ingredients: (RecipeIngredient & { ingredient: Ingredient })[] }) | undefined> {
    const recipe = this.recipes.get(id);
    if (!recipe) return undefined;

    const ingredients = await this.getRecipeIngredients(id);
    return { ...recipe, ingredients };
  }

  async getUserRecipes(userId: string): Promise<Recipe[]> {
    return Array.from(this.recipes.values())
      .filter(recipe => recipe.createdBy === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const id = recipe.id || nanoid();
    const newRecipe: Recipe = {
      ...recipe,
      id,
      description: recipe.description || null,
      instructions: recipe.instructions || null,
      createdBy: recipe.createdBy || null,
      glassTypeId: recipe.glassTypeId || null,
      isPublic: recipe.isPublic ?? true,
      difficulty: recipe.difficulty || null,
      rating: recipe.rating || null,
      ratingCount: recipe.ratingCount || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }

  async updateRecipe(id: string, recipeData: Partial<InsertRecipe>): Promise<Recipe> {
    const existing = this.recipes.get(id);
    if (!existing) throw new Error("Recipe not found");
    
    const updatedRecipe: Recipe = {
      ...existing,
      ...recipeData,
      id,
      updatedAt: new Date()
    };
    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }

  async deleteRecipe(id: string): Promise<void> {
    this.recipes.delete(id);
    this.recipeIngredients.delete(id);
  }

  async searchRecipes(query: string, category?: string, difficulty?: string): Promise<Recipe[]> {
    return Array.from(this.recipes.values())
      .filter(recipe => {
        if (!recipe.isPublic) return false;
        
        if (query && !recipe.name.toLowerCase().includes(query.toLowerCase()) && 
            !recipe.description?.toLowerCase().includes(query.toLowerCase())) {
          return false;
        }
        
        if (category && recipe.category !== category) return false;
        if (difficulty && recipe.difficulty !== difficulty) return false;
        
        return true;
      })
      .sort((a, b) => {
        const ratingDiff = parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
        if (ratingDiff !== 0) return ratingDiff;
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      });
  }

  // Recipe ingredient operations
  async getRecipeIngredients(recipeId: string): Promise<(RecipeIngredient & { ingredient: Ingredient })[]> {
    const recipeIngs = this.recipeIngredients.get(recipeId) || [];
    return recipeIngs
      .map(ri => ({
        ...ri,
        ingredient: this.ingredients.get(ri.ingredientId!)!
      }))
      .filter(ri => ri.ingredient)
      .sort((a, b) => a.order - b.order);
  }

  async createRecipeIngredient(recipeIngredient: InsertRecipeIngredient): Promise<RecipeIngredient> {
    const id = this.nextId.recipeIngredient++;
    const newRecipeIngredient: RecipeIngredient = {
      id,
      ...recipeIngredient,
      recipeId: recipeIngredient.recipeId || null,
      ingredientId: recipeIngredient.ingredientId || null,
      createdAt: new Date()
    };
    
    const existing = this.recipeIngredients.get(recipeIngredient.recipeId!) || [];
    existing.push(newRecipeIngredient);
    this.recipeIngredients.set(recipeIngredient.recipeId!, existing);
    
    return newRecipeIngredient;
  }

  async deleteRecipeIngredients(recipeId: string): Promise<void> {
    this.recipeIngredients.delete(recipeId);
  }

  // User favorite operations
  async getUserFavorites(userId: string): Promise<(UserFavorite & { recipe: Recipe })[]> {
    const favorites = this.userFavorites.get(userId) || [];
    return favorites
      .map(fav => ({
        ...fav,
        recipe: this.recipes.get(fav.recipeId!)!
      }))
      .filter(fav => fav.recipe)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async addUserFavorite(userId: string, recipeId: string): Promise<UserFavorite> {
    const id = this.nextId.favorite++;
    const favorite: UserFavorite = {
      id,
      userId,
      recipeId,
      createdAt: new Date()
    };
    
    const existing = this.userFavorites.get(userId) || [];
    existing.push(favorite);
    this.userFavorites.set(userId, existing);
    
    return favorite;
  }

  async removeUserFavorite(userId: string, recipeId: string): Promise<void> {
    const existing = this.userFavorites.get(userId) || [];
    const filtered = existing.filter(fav => fav.recipeId !== recipeId);
    this.userFavorites.set(userId, filtered);
  }

  async isUserFavorite(userId: string, recipeId: string): Promise<boolean> {
    const favorites = this.userFavorites.get(userId) || [];
    return favorites.some(fav => fav.recipeId === recipeId);
  }

  // Recipe rating operations
  async getRecipeRatings(recipeId: string): Promise<RecipeRating[]> {
    return (this.recipeRatings.get(recipeId) || [])
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createRecipeRating(rating: InsertRecipeRating): Promise<RecipeRating> {
    const id = this.nextId.rating++;
    const newRating: RecipeRating = {
      id,
      ...rating,
      recipeId: rating.recipeId || null,
      userId: rating.userId || null,
      review: rating.review || null,
      createdAt: new Date()
    };
    
    const existing = this.recipeRatings.get(rating.recipeId!) || [];
    existing.push(newRating);
    this.recipeRatings.set(rating.recipeId!, existing);
    
    // Update recipe average rating
    const allRatings = await this.getRecipeRatings(rating.recipeId!);
    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    
    const recipe = this.recipes.get(rating.recipeId!);
    if (recipe) {
      const updatedRecipe = {
        ...recipe,
        rating: avgRating.toFixed(2),
        ratingCount: allRatings.length
      };
      this.recipes.set(rating.recipeId!, updatedRecipe);
    }
    
    return newRating;
  }

  async updateRecipeRating(userId: string, recipeId: string, rating: number, review?: string): Promise<RecipeRating> {
    const ratings = this.recipeRatings.get(recipeId) || [];
    const existingIndex = ratings.findIndex(r => r.userId === userId);
    
    if (existingIndex === -1) {
      throw new Error("Rating not found");
    }
    
    ratings[existingIndex] = {
      ...ratings[existingIndex],
      rating,
      review: review || null
    };
    this.recipeRatings.set(recipeId, ratings);
    
    // Update recipe average rating
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

  async getUserRecipeRating(userId: string, recipeId: string): Promise<RecipeRating | undefined> {
    const ratings = this.recipeRatings.get(recipeId) || [];
    return ratings.find(r => r.userId === userId);
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
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
    return await db.select().from(ingredients).orderBy(asc(ingredients.category), asc(ingredients.name));
  }

  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    return await db.select().from(ingredients)
      .where(eq(ingredients.category, category))
      .orderBy(asc(ingredients.name));
  }

  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const [newIngredient] = await db.insert(ingredients).values(ingredient).returning();
    return newIngredient;
  }

  // Glass type operations
  async getGlassTypes(): Promise<GlassType[]> {
    return await db.select().from(glassTypes).orderBy(asc(glassTypes.name));
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

    const recipeIngs = await this.getRecipeIngredients(id);
    return { ...recipe, ingredients: recipeIngs };
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

  async updateRecipe(id: string, recipeData: Partial<InsertRecipe>): Promise<Recipe> {
    const [updatedRecipe] = await db.update(recipes)
      .set({ ...recipeData, updatedAt: new Date() })
      .where(eq(recipes.id, id))
      .returning();
    return updatedRecipe;
  }

  async deleteRecipe(id: string): Promise<void> {
    await db.delete(recipes).where(eq(recipes.id, id));
  }

  async searchRecipes(query: string, category?: string, difficulty?: string): Promise<Recipe[]> {
    let conditions = eq(recipes.isPublic, true);
    
    if (query) {
      conditions = and(conditions, or(
        ilike(recipes.name, `%${query}%`),
        ilike(recipes.description, `%${query}%`)
      )) as any;
    }
    
    if (category) {
      conditions = and(conditions, eq(recipes.category, category)) as any;
    }
    
    if (difficulty) {
      conditions = and(conditions, eq(recipes.difficulty, difficulty)) as any;
    }

    return await db.select().from(recipes)
      .where(conditions)
      .orderBy(desc(recipes.rating), desc(recipes.createdAt));
  }

  // Recipe ingredient operations
  async getRecipeIngredients(recipeId: string): Promise<(RecipeIngredient & { ingredient: Ingredient })[]> {
    return await db.select({
      id: recipeIngredients.id,
      recipeId: recipeIngredients.recipeId,
      ingredientId: recipeIngredients.ingredientId,
      amount: recipeIngredients.amount,
      unit: recipeIngredients.unit,
      order: recipeIngredients.order,
      createdAt: recipeIngredients.createdAt,
      ingredient: ingredients
    })
    .from(recipeIngredients)
    .innerJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
    .where(eq(recipeIngredients.recipeId, recipeId))
    .orderBy(asc(recipeIngredients.order));
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
    return await db.select({
      id: userFavorites.id,
      userId: userFavorites.userId,
      recipeId: userFavorites.recipeId,
      createdAt: userFavorites.createdAt,
      recipe: recipes
    })
    .from(userFavorites)
    .innerJoin(recipes, eq(userFavorites.recipeId, recipes.id))
    .where(eq(userFavorites.userId, userId))
    .orderBy(desc(userFavorites.createdAt));
  }

  async addUserFavorite(userId: string, recipeId: string): Promise<UserFavorite> {
    const [favorite] = await db.insert(userFavorites).values({ userId, recipeId }).returning();
    return favorite;
  }

  async removeUserFavorite(userId: string, recipeId: string): Promise<void> {
    await db.delete(userFavorites)
      .where(and(eq(userFavorites.userId, userId), eq(userFavorites.recipeId, recipeId)));
  }

  async isUserFavorite(userId: string, recipeId: string): Promise<boolean> {
    const [favorite] = await db.select().from(userFavorites)
      .where(and(eq(userFavorites.userId, userId), eq(userFavorites.recipeId, recipeId)));
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
    await this.updateRecipeAverageRating(rating.recipeId!);
    
    return newRating;
  }

  async updateRecipeRating(userId: string, recipeId: string, rating: number, review?: string): Promise<RecipeRating> {
    const [updatedRating] = await db.update(recipeRatings)
      .set({ rating, review })
      .where(and(eq(recipeRatings.userId, userId), eq(recipeRatings.recipeId, recipeId)))
      .returning();
    
    // Update recipe average rating
    await this.updateRecipeAverageRating(recipeId);
    
    return updatedRating;
  }

  async getUserRecipeRating(userId: string, recipeId: string): Promise<RecipeRating | undefined> {
    const [rating] = await db.select().from(recipeRatings)
      .where(and(eq(recipeRatings.userId, userId), eq(recipeRatings.recipeId, recipeId)));
    return rating;
  }

  private async updateRecipeAverageRating(recipeId: string): Promise<void> {
    const ratings = await this.getRecipeRatings(recipeId);
    if (ratings.length === 0) return;
    
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    await db.update(recipes)
      .set({ 
        rating: avgRating.toFixed(2),
        ratingCount: ratings.length
      })
      .where(eq(recipes.id, recipeId));
  }
}

// Use database storage by default, fallback to memory for development
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemoryStorage();
