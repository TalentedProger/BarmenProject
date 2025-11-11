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
import { SAMPLE_INGREDIENTS } from "../client/src/lib/ingredients-data";

export interface IStorage {
  // User operations (mandatory for authentication)
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(userId: string, data: { nickname?: string; profileImageUrl?: string }): Promise<User | undefined>;
  
  // Admin user operations
  getUsers?(): Promise<User[]>;
  getUsersCount?(): Promise<number>;
  getRecentUsers?(limit: number): Promise<User[]>;

  // Ingredient operations
  getIngredients(): Promise<Ingredient[]>;
  getIngredientsByCategory(category: string): Promise<Ingredient[]>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
  
  // Admin ingredient operations
  updateIngredient?(id: number, ingredient: Partial<InsertIngredient>): Promise<Ingredient | undefined>;
  deleteIngredient?(id: number): Promise<boolean>;
  getIngredientsCount?(): Promise<number>;

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
  
  // Admin recipe operations
  getRecipesCount?(): Promise<number>;
  getRecentRecipes?(limit: number): Promise<Recipe[]>;
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
    // Initialize ingredients database from SAMPLE_INGREDIENTS
    // Includes 90 real Alkoteka products and all other ingredients
    const sampleIngredients: InsertIngredient[] = SAMPLE_INGREDIENTS.map(ing => ({
      name: ing.name!,
      category: ing.category!,
      color: ing.color!,
      abv: String(ing.abv || 0),
      pricePerLiter: String(ing.pricePerLiter || 0),
      tasteProfile: ing.tasteProfile!,
      unit: ing.unit!,
      sourceUrl: ing.sourceUrl || null,
      sourceName: ing.sourceName || null,
      sourceIcon: ing.sourceIcon || null,
      imageUrl: ing.imageUrl || null,
      volume: ing.volume || null
    }));
    
    console.log(`🍹 Инициализация MemoryStorage: загружено ${sampleIngredients.length} ингредиентов`);

    sampleIngredients.forEach(ingredient => {
      const id = this.nextId.ingredient++;
      this.ingredients.set(id, {
        id,
        ...ingredient,
        abv: ingredient.abv || null,
        unit: ingredient.unit || "ml",
        createdAt: new Date()
      });
    });

    // Initialize sample glass types
    const sampleGlassTypes: InsertGlassType[] = [
      { name: "Шот", capacity: 50, shape: "shot" },
      { name: "Олд Фэшн", capacity: 300, shape: "old-fashioned" },
      { name: "Хайбол", capacity: 270, shape: "highball" },
      { name: "Коктейльная рюмка", capacity: 150, shape: "martini" },
      { name: "Маргарита", capacity: 250, shape: "margarita" },
      { name: "Харрикейн", capacity: 450, shape: "hurricane" },
      { name: "Тумблер", capacity: 300, shape: "tumbler" },
      { name: "Коньячный бокал", capacity: 350, shape: "snifter" },
      { name: "Фужер для шампанского", capacity: 170, shape: "champagne-flute" },
      { name: "Пивная кружка", capacity: 500, shape: "beer-mug" },
      { name: "Бокал для красного вина", capacity: 300, shape: "red-wine" },
      { name: "Бокал для белого вина", capacity: 260, shape: "white-wine" },
      { name: "Бокал сауэр", capacity: 120, shape: "sour" },
      { name: "Чаша для шампанского", capacity: 180, shape: "champagne-saucer" }
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
      nickname: userData.nickname,
      profileImageUrl: userData.profileImageUrl || null,
      googleId: userData.googleId || null,
      passwordHash: userData.passwordHash || null,
      emailVerified: userData.emailVerified || false,
      updatedAt: new Date(),
      createdAt: this.users.get(userData.id)?.createdAt || new Date()
    };
    this.users.set(userData.id, user);
    return user;
  }

  async updateUserProfile(userId: string, data: { nickname?: string; profileImageUrl?: string }): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) {
      return undefined;
    }

    const updatedUser: User = {
      ...user,
      nickname: data.nickname !== undefined ? data.nickname : user.nickname,
      profileImageUrl: data.profileImageUrl !== undefined ? data.profileImageUrl : user.profileImageUrl,
      updatedAt: new Date()
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
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
  async getRecipes(limit = 50, offset = 0): Promise<Recipe[]> {
    const allRecipes = Array.from(this.recipes.values())
      .sort((a, b) => {
        const ratingDiff = parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
        if (ratingDiff !== 0) return ratingDiff;
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      });
    
    return allRecipes.slice(offset, offset + limit);
  }

  async getRecipe(id: string): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async getRecipeWithIngredients(id: string): Promise<(Recipe & { ingredients: (RecipeIngredient & { ingredient: Ingredient })[] }) | undefined> {
    const recipe = await this.getRecipe(id);
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
      createdBy: recipe.createdBy || null,
      glassTypeId: recipe.glassTypeId || null,
      description: recipe.description || null,
      instructions: recipe.instructions || null,
      difficulty: recipe.difficulty || "easy",
      isPublic: recipe.isPublic !== false,
      rating: recipe.rating || "0",
      ratingCount: recipe.ratingCount || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }

  async updateRecipe(id: string, recipe: Partial<InsertRecipe>): Promise<Recipe> {
    const existing = this.recipes.get(id);
    if (!existing) {
      throw new Error("Recipe not found");
    }
    
    const updated = {
      ...existing,
      ...recipe,
      updatedAt: new Date()
    };
    this.recipes.set(id, updated);
    return updated;
  }

  async deleteRecipe(id: string): Promise<void> {
    this.recipes.delete(id);
    this.recipeIngredients.delete(id);
    // Remove from favorites
    for (const [userId, favorites] of Array.from(this.userFavorites.entries())) {
      const filtered = favorites.filter((fav: UserFavorite) => fav.recipeId !== id);
      this.userFavorites.set(userId, filtered);
    }
    // Remove ratings
    this.recipeRatings.delete(id);
  }

  async searchRecipes(query: string, category?: string, difficulty?: string): Promise<Recipe[]> {
    return Array.from(this.recipes.values())
      .filter(recipe => {
        if (query) {
          const searchTerm = query.toLowerCase();
          const nameMatch = recipe.name.toLowerCase().includes(searchTerm);
          const descMatch = recipe.description?.toLowerCase().includes(searchTerm);
          if (!nameMatch && !descMatch) return false;
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

  // Admin methods for MemoryStorage
  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id);
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getUsersCount(): Promise<number> {
    return this.users.size;
  }

  async getRecentUsers(limit: number): Promise<User[]> {
    const users = await this.getUsers();
    return users.slice(0, limit);
  }

  async updateIngredient(id: number, ingredient: Partial<InsertIngredient>): Promise<Ingredient | undefined> {
    const existing = this.ingredients.get(id);
    if (!existing) return undefined;

    const updated: Ingredient = {
      ...existing,
      ...ingredient,
      id,
      createdAt: existing.createdAt
    };
    this.ingredients.set(id, updated);
    return updated;
  }

  async deleteIngredient(id: number): Promise<boolean> {
    return this.ingredients.delete(id);
  }

  async getIngredientsCount(): Promise<number> {
    return this.ingredients.size;
  }

  async getRecipesCount(): Promise<number> {
    return this.recipes.size;
  }

  async getRecentRecipes(limit: number): Promise<Recipe[]> {
    const recipes = Array.from(this.recipes.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return recipes.slice(0, limit);
  }
}

import { db } from "./db";
import { eq, and, like, desc, sql } from "drizzle-orm";

export class PostgresStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);
    return result[0];
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existingUser = user.email ? await this.getUserByEmail(user.email) : 
                        user.googleId ? await this.getUserByGoogleId(user.googleId) : null;
    
    if (existingUser) {
      const result = await db.update(users)
        .set({ ...user, updatedAt: new Date() })
        .where(eq(users.id, existingUser.id))
        .returning();
      return result[0];
    } else {
      const newUser = {
        ...user,
        id: user.id || nanoid(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.insert(users).values(newUser).returning();
      return result[0];
    }
  }

т  // Ingredient operations
  async getIngredients(): Promise<Ingredient[]> {
    return await db.select().from(ingredients);
  }

  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    return await db.select().from(ingredients).where(eq(ingredients.category, category));
  }

  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const result = await db.insert(ingredients).values(ingredient).returning();
    return result[0];
  }

  // Glass type operations
  async getGlassTypes(): Promise<GlassType[]> {
    return await db.select().from(glassTypes);
  }

  async getGlassType(id: number): Promise<GlassType | undefined> {
    const result = await db.select().from(glassTypes).where(eq(glassTypes.id, id)).limit(1);
    return result[0];
  }

  async createGlassType(glassType: InsertGlassType): Promise<GlassType> {
    const result = await db.insert(glassTypes).values(glassType).returning();
    return result[0];
  }

  // Recipe operations
  async getRecipes(limit = 50, offset = 0): Promise<Recipe[]> {
    return await db.select().from(recipes)
      .orderBy(desc(recipes.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getRecipe(id: string): Promise<Recipe | undefined> {
    const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
    return result[0];
  }

  async getRecipeWithIngredients(id: string): Promise<(Recipe & { ingredients: (RecipeIngredient & { ingredient: Ingredient })[] }) | undefined> {
    const recipe = await this.getRecipe(id);
    if (!recipe) return undefined;

    const recipeIngredientsData = await db
      .select()
      .from(recipeIngredients)
      .leftJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
      .where(eq(recipeIngredients.recipeId, id))
      .orderBy(recipeIngredients.order);

    const ingredientsWithData = recipeIngredientsData.map(row => ({
      ...row.recipe_ingredients,
      ingredient: row.ingredients!
    }));

    return {
      ...recipe,
      ingredients: ingredientsWithData
    };
  }

  async getUserRecipes(userId: string): Promise<Recipe[]> {
    return await db.select().from(recipes)
      .where(eq(recipes.createdBy, userId))
      .orderBy(desc(recipes.createdAt));
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const newRecipe = {
      ...recipe,
      id: recipe.id || nanoid(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.insert(recipes).values(newRecipe).returning();
    return result[0];
  }

  async updateRecipe(id: string, recipe: Partial<InsertRecipe>): Promise<Recipe> {
    const result = await db.update(recipes)
      .set({ ...recipe, updatedAt: new Date() })
      .where(eq(recipes.id, id))
      .returning();
    return result[0];
  }

  async deleteRecipe(id: string): Promise<void> {
    await db.delete(recipes).where(eq(recipes.id, id));
  }

  async searchRecipes(query: string, category?: string, difficulty?: string): Promise<Recipe[]> {
    let queryBuilder = db.select().from(recipes);
    
    const conditions = [];
    
    if (query) {
      conditions.push(
        sql`${recipes.name} ILIKE ${'%' + query + '%'} OR ${recipes.description} ILIKE ${'%' + query + '%'}`
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

    return await queryBuilder
      .orderBy(desc(recipes.rating), desc(recipes.createdAt))
      .limit(50);
  }

  // Recipe ingredient operations
  async getRecipeIngredients(recipeId: string): Promise<(RecipeIngredient & { ingredient: Ingredient })[]> {
    const result = await db
      .select()
      .from(recipeIngredients)
      .leftJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
      .where(eq(recipeIngredients.recipeId, recipeId))
      .orderBy(recipeIngredients.order);

    return result.map(row => ({
      ...row.recipe_ingredients,
      ingredient: row.ingredients!
    }));
  }

  async createRecipeIngredient(recipeIngredient: InsertRecipeIngredient): Promise<RecipeIngredient> {
    const result = await db.insert(recipeIngredients).values(recipeIngredient).returning();
    return result[0];
  }

  async deleteRecipeIngredients(recipeId: string): Promise<void> {
    await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeId));
  }

  // User favorite operations
  async getUserFavorites(userId: string): Promise<(UserFavorite & { recipe: Recipe })[]> {
    const result = await db
      .select()
      .from(userFavorites)
      .leftJoin(recipes, eq(userFavorites.recipeId, recipes.id))
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));

    return result.map(row => ({
      ...row.user_favorites,
      recipe: row.recipes!
    }));
  }

  async addUserFavorite(userId: string, recipeId: string): Promise<UserFavorite> {
    const favorite = {
      userId,
      recipeId,
      createdAt: new Date()
    };
    const result = await db.insert(userFavorites).values(favorite).returning();
    return result[0];
  }

  async removeUserFavorite(userId: string, recipeId: string): Promise<void> {
    await db.delete(userFavorites)
      .where(and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.recipeId, recipeId)
      ));
  }

  async isUserFavorite(userId: string, recipeId: string): Promise<boolean> {
    const result = await db.select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.recipeId, recipeId)
      ))
      .limit(1);
    return result.length > 0;
  }

  // Recipe rating operations
  async getRecipeRatings(recipeId: string): Promise<RecipeRating[]> {
    return await db.select()
      .from(recipeRatings)
      .where(eq(recipeRatings.recipeId, recipeId))
      .orderBy(desc(recipeRatings.createdAt));
  }

  async createRecipeRating(rating: InsertRecipeRating): Promise<RecipeRating> {
    const newRating = {
      ...rating,
      createdAt: new Date()
    };
    const result = await db.insert(recipeRatings).values(newRating).returning();
    
    // Update average rating for the recipe
    await this.updateRecipeAverageRating(rating.recipeId);
    
    return result[0];
  }

  async updateRecipeRating(userId: string, recipeId: string, rating: number, review?: string): Promise<RecipeRating> {
    const result = await db.update(recipeRatings)
      .set({ rating, review })
      .where(and(
        eq(recipeRatings.userId, userId),
        eq(recipeRatings.recipeId, recipeId)
      ))
      .returning();
    
    // Update average rating for the recipe
    await this.updateRecipeAverageRating(recipeId);
    
    return result[0];
  }

  async getUserRecipeRating(userId: string, recipeId: string): Promise<RecipeRating | undefined> {
    const result = await db.select()
      .from(recipeRatings)
      .where(and(
        eq(recipeRatings.userId, userId),
        eq(recipeRatings.recipeId, recipeId)
      ))
      .limit(1);
    return result[0];
  }

  private async updateRecipeAverageRating(recipeId: string): Promise<void> {
    const ratings = await this.getRecipeRatings(recipeId);
    if (ratings.length > 0) {
      const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      await db.update(recipes)
        .set({
          rating: avgRating.toFixed(2),
          ratingCount: ratings.length
        })
        .where(eq(recipes.id, recipeId));
    }
  }
}

// Use PostgresStorage if database is available, otherwise fallback to MemoryStorage
export const storage = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql')
  ? new PostgresStorage()
  : new MemoryStorage();

console.log(`Using ${storage.constructor.name} for data persistence`);