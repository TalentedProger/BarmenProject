import {
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
        createdAt: new Date()
      });
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

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
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
      review
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

export const storage = new MemoryStorage();
