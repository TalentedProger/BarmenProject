import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, optionalAuth } from "./auth";
import { generateEnhancedRecipe, AVAILABLE_MODES } from "./cocktail-generator-enhanced";
import { registerAdminRoutes } from "./admin-routes";
import { 
  insertIngredientSchema,
  insertGlassTypeSchema,
  insertRecipeSchema,
  insertRecipeIngredientSchema,
  insertUserFavoriteSchema,
  insertRecipeRatingSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Google OAuth authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', optionalAuth, async (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });

  app.patch('/api/auth/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { nickname, profileImageUrl } = req.body;

      // Validate input
      if (!nickname || nickname.trim().length < 2) {
        return res.status(400).json({ error: 'Nickname must be at least 2 characters' });
      }

      // Update user profile
      const updatedUser = await storage.updateUserProfile(userId, {
        nickname: nickname.trim(),
        profileImageUrl: profileImageUrl || undefined
      });

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Ingredient routes
  app.get('/api/ingredients', async (req, res) => {
    try {
      const { category } = req.query;
      const ingredients = category 
        ? await storage.getIngredientsByCategory(category as string)
        : await storage.getIngredients();
      res.json(ingredients);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      res.status(500).json({ message: "Failed to fetch ingredients" });
    }
  });

  app.post('/api/ingredients', async (req, res) => {
    try {
      const ingredient = insertIngredientSchema.parse(req.body);
      const newIngredient = await storage.createIngredient(ingredient);
      res.status(201).json(newIngredient);
    } catch (error) {
      console.error("Error creating ingredient:", error);
      res.status(500).json({ message: "Failed to create ingredient" });
    }
  });

  // Glass type routes
  app.get('/api/glass-types', async (req, res) => {
    try {
      const glassTypes = await storage.getGlassTypes();
      res.json(glassTypes);
    } catch (error) {
      console.error("Error fetching glass types:", error);
      res.status(500).json({ message: "Failed to fetch glass types" });
    }
  });

  app.get('/api/glass-types/:id', async (req, res) => {
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

  app.post('/api/glass-types', async (req, res) => {
    try {
      const glassType = insertGlassTypeSchema.parse(req.body);
      const newGlassType = await storage.createGlassType(glassType);
      res.status(201).json(newGlassType);
    } catch (error) {
      console.error("Error creating glass type:", error);
      res.status(500).json({ message: "Failed to create glass type" });
    }
  });

  // Recipe routes
  app.get('/api/recipes', async (req, res) => {
    try {
      const { limit = 20, offset = 0, search, category, difficulty } = req.query;
      
      let recipes;
      if (search || category || difficulty) {
        recipes = await storage.searchRecipes(
          search as string || "",
          category as string,
          difficulty as string
        );
      } else {
        recipes = await storage.getRecipes(
          parseInt(limit as string),
          parseInt(offset as string)
        );
      }
      
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Current user recipes route - must come before /:id route
  app.get('/api/recipes/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const userRecipes = await storage.getUserRecipes(userId);
      res.json(userRecipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      res.status(500).json({ message: "Failed to fetch user recipes" });
    }
  });

  app.get('/api/recipes/:id', async (req, res) => {
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

  app.post('/api/recipes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const recipeData = insertRecipeSchema.parse({
        ...req.body,
        createdBy: userId
      });
      
      const recipe = await storage.createRecipe(recipeData);
      
      // Add ingredients if provided
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

  app.put('/api/recipes/:id', async (req: any, res) => {
    try {
      const recipe = await storage.getRecipe(req.params.id);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      const updateData = insertRecipeSchema.partial().parse(req.body);
      const updatedRecipe = await storage.updateRecipe(req.params.id, updateData);
      
      // Update ingredients if provided
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

  app.delete('/api/recipes/:id', async (req: any, res) => {
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

  // User recipe routes (simplified for demo)
  app.get('/api/users/:userId/recipes', async (req: any, res) => {
    try {
      // For demo purposes, return empty array
      res.json([]);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      res.status(500).json({ message: "Failed to fetch user recipes" });
    }
  });



  // User favorite routes
  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites.map(fav => fav.recipe));
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      res.status(500).json({ message: "Failed to fetch user favorites" });
    }
  });

  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const { recipeId } = req.body;
      if (!recipeId) {
        return res.status(400).json({ error: 'Recipe ID is required' });
      }

      // Check if recipe exists
      const recipe = await storage.getRecipe(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      // Check if already in favorites
      const isAlreadyFavorite = await storage.isUserFavorite(userId, recipeId);
      if (isAlreadyFavorite) {
        return res.status(409).json({ error: 'Recipe already in favorites' });
      }

      const favorite = await storage.addUserFavorite(userId, recipeId);
      res.status(201).json({ 
        message: "Recipe added to favorites",
        favorite: favorite
      });
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete('/api/favorites/:recipeId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const { recipeId } = req.params;
      
      // Check if recipe is in favorites
      const isInFavorites = await storage.isUserFavorite(userId, recipeId);
      if (!isInFavorites) {
        return res.status(404).json({ error: 'Recipe not found in favorites' });
      }

      await storage.removeUserFavorite(userId, recipeId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Recipe rating routes
  app.get('/api/recipes/:recipeId/ratings', async (req, res) => {
    try {
      const ratings = await storage.getRecipeRatings(req.params.recipeId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching recipe ratings:", error);
      res.status(500).json({ message: "Failed to fetch recipe ratings" });
    }
  });

  app.post('/api/recipes/:recipeId/ratings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const { recipeId } = req.params;
      const { rating, review } = req.body;
      
      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      // Check if recipe exists
      const recipe = await storage.getRecipe(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      // Check if user already rated this recipe
      const existingRating = await storage.getUserRecipeRating(userId, recipeId);
      
      let result;
      if (existingRating) {
        // Update existing rating
        result = await storage.updateRecipeRating(userId, recipeId, rating, review);
        res.json({ 
          message: "Rating updated successfully",
          rating: result
        });
      } else {
        // Create new rating
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

  // Get user's rating for a specific recipe
  app.get('/api/recipes/:recipeId/ratings/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const { recipeId } = req.params;
      const rating = await storage.getUserRecipeRating(userId, recipeId);
      
      if (!rating) {
        return res.status(404).json({ error: 'No rating found for this recipe' });
      }
      
      res.json(rating);
    } catch (error) {
      console.error("Error fetching user rating:", error);
      res.status(500).json({ message: "Failed to fetch user rating" });
    }
  });

  // Check if recipe is in user's favorites
  app.get('/api/favorites/:recipeId/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const { recipeId } = req.params;
      const isFavorite = await storage.isUserFavorite(userId, recipeId);
      
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // Enhanced recipe generator with filters
  app.post('/api/recipes/generate', async (req, res) => {
    try {
      const { 
        mode = 'classic',
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
      
      // Get all ingredients and glass types
      const ingredients = await storage.getIngredients();
      const glassTypes = await storage.getGlassTypes();
      
      // Generate recipe with enhanced algorithm
      const generatedRecipe = generateEnhancedRecipe(ingredients, glassTypes, mode, {
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
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      res.status(500).json({ 
        message: error.message || "Failed to generate recipe" 
      });
    }
  });

  // Get available generation modes
  app.get('/api/recipes/generation-modes', async (req, res) => {
    res.json(AVAILABLE_MODES);
  });

  // Регистрируем админ маршруты
  registerAdminRoutes(app);

  // В Vercel serverless не нужен HTTP сервер
  if (process.env.VERCEL) {
    return null as any;
  }

  const httpServer = createServer(app);
  return httpServer;
}

// Old helper functions removed - now using enhanced cocktail-generator.ts
