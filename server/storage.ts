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
    // Initialize enhanced ingredients database (3 per category)
    const sampleIngredients: InsertIngredient[] = [
      // Alcohol (3 items)
      {
        name: "Водка Premium",
        category: "alcohol",
        color: "#FFFFFF",
        abv: "40.00",
        pricePerLiter: "1200.00",
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 },
        unit: "ml"
      },
      {
        name: "Белый ром Bacardi",
        category: "alcohol", 
        color: "#FFFACD",
        abv: "40.00",
        pricePerLiter: "1500.00",
        tasteProfile: { sweet: 2, sour: 0, bitter: 0, alcohol: 8 },
        unit: "ml"
      },
      {
        name: "Джин Bombay",
        category: "alcohol",
        color: "#F8F8FF", 
        abv: "42.00",
        pricePerLiter: "1800.00",
        tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 },
        unit: "ml"
      },

      // Juices (3 items)  
      {
        name: "Апельсиновый сок",
        category: "juice",
        color: "#FFA500",
        abv: "0.00",
        pricePerLiter: "200.00",
        tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "Ананасовый сок", 
        category: "juice",
        color: "#FFE135",
        abv: "0.00",
        pricePerLiter: "250.00", 
        tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "Клюквенный сок",
        category: "juice",
        color: "#DC143C",
        abv: "0.00", 
        pricePerLiter: "300.00",
        tasteProfile: { sweet: 4, sour: 6, bitter: 1, alcohol: 0 },
        unit: "ml"
      },

      // Syrups (3 items)
      {
        name: "Простой сироп",
        category: "syrup",
        color: "#FFFFFF",
        abv: "0.00",
        pricePerLiter: "150.00",
        tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "Сироп граната",
        category: "syrup",
        color: "#B22222",
        abv: "0.00",
        pricePerLiter: "350.00",
        tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
        unit: "ml"
      },
      {
        name: "Кокосовый сироп",
        category: "syrup", 
        color: "#FFFACD",
        abv: "0.00",
        pricePerLiter: "400.00",
        tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 0 },
        unit: "ml"
      },

      // Fruits (3 items) - price per kg  
      {
        name: "Лайм свежий",
        category: "fruit",
        color: "#32CD32", 
        abv: "0.00",
        pricePerLiter: "500.00", // per kg
        tasteProfile: { sweet: 2, sour: 7, bitter: 0, alcohol: 0 },
        unit: "kg"
      },
      {
        name: "Лимон свежий",
        category: "fruit",
        color: "#FFFF00",
        abv: "0.00",
        pricePerLiter: "400.00", // per kg
        tasteProfile: { sweet: 2, sour: 8, bitter: 0, alcohol: 0 },
        unit: "kg"
      },
      {
        name: "Мята свежая",
        category: "fruit",
        color: "#00FF00",
        abv: "0.00", 
        pricePerLiter: "800.00", // per kg
        tasteProfile: { sweet: 1, sour: 0, bitter: 3, alcohol: 0 },
        unit: "kg" 
      },

      // Ice (3 items)
      {
        name: "Лёд кубиками",
        category: "ice",
        color: "#E0E0E0",
        abv: "0.00",
        pricePerLiter: "50.00", // per kg
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 },
        unit: "kg"
      },
      {
        name: "Лёд дроблёный",
        category: "ice", 
        color: "#D3D3D3",
        abv: "0.00",
        pricePerLiter: "60.00", // per kg
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 },
        unit: "kg"
      },
      {
        name: "Лёд сферический",
        category: "ice",
        color: "#F0F8FF", 
        abv: "0.00",
        pricePerLiter: "100.00", // per kg
        tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 },
        unit: "kg"
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
}

// Use memory storage for Replit environment migration
export const storage = new MemoryStorage();