import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
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
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(401).json({ message: "Unauthorized" });
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

  app.post('/api/ingredients', isAuthenticated, async (req, res) => {
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

  app.post('/api/glass-types', isAuthenticated, async (req, res) => {
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
      const userId = req.user.claims.sub;
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

  app.put('/api/recipes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipe = await storage.getRecipe(req.params.id);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      if (recipe.createdBy !== userId) {
        return res.status(403).json({ message: "Not authorized to update this recipe" });
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

  app.delete('/api/recipes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipe = await storage.getRecipe(req.params.id);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      if (recipe.createdBy !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this recipe" });
      }
      
      await storage.deleteRecipe(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });

  // User recipe routes
  app.get('/api/users/:userId/recipes', isAuthenticated, async (req: any, res) => {
    try {
      const requesterId = req.user.claims.sub;
      const targetUserId = req.params.userId;
      
      // Users can only see their own recipes
      if (requesterId !== targetUserId) {
        return res.status(403).json({ message: "Not authorized to view these recipes" });
      }
      
      const recipes = await storage.getUserRecipes(targetUserId);
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      res.status(500).json({ message: "Failed to fetch user recipes" });
    }
  });

  // User favorite routes
  app.get('/api/users/:userId/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const requesterId = req.user.claims.sub;
      const targetUserId = req.params.userId;
      
      if (requesterId !== targetUserId) {
        return res.status(403).json({ message: "Not authorized to view these favorites" });
      }
      
      const favorites = await storage.getUserFavorites(targetUserId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      res.status(500).json({ message: "Failed to fetch user favorites" });
    }
  });

  app.post('/api/users/:userId/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const requesterId = req.user.claims.sub;
      const targetUserId = req.params.userId;
      
      if (requesterId !== targetUserId) {
        return res.status(403).json({ message: "Not authorized to add favorites" });
      }
      
      const { recipeId } = req.body;
      const favorite = await storage.addUserFavorite(targetUserId, recipeId);
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete('/api/users/:userId/favorites/:recipeId', isAuthenticated, async (req: any, res) => {
    try {
      const requesterId = req.user.claims.sub;
      const targetUserId = req.params.userId;
      
      if (requesterId !== targetUserId) {
        return res.status(403).json({ message: "Not authorized to remove favorites" });
      }
      
      await storage.removeUserFavorite(targetUserId, req.params.recipeId);
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
      const userId = req.user.claims.sub;
      const recipeId = req.params.recipeId;
      
      const ratingData = insertRecipeRatingSchema.parse({
        ...req.body,
        userId,
        recipeId
      });
      
      // Check if user already rated this recipe
      const existingRating = await storage.getUserRecipeRating(userId, recipeId);
      
      let rating;
      if (existingRating) {
        rating = await storage.updateRecipeRating(userId, recipeId, ratingData.rating, ratingData.review);
      } else {
        rating = await storage.createRecipeRating(ratingData);
      }
      
      res.status(201).json(rating);
    } catch (error) {
      console.error("Error creating/updating rating:", error);
      res.status(500).json({ message: "Failed to create/update rating" });
    }
  });

  // Random recipe generator
  app.post('/api/recipes/generate', async (req, res) => {
    try {
      const { mode = 'classic' } = req.body;
      
      // Get all ingredients and glass types
      const ingredients = await storage.getIngredients();
      const glassTypes = await storage.getGlassTypes();
      
      // Generate random recipe based on mode
      const generatedRecipe = generateRandomRecipe(ingredients, glassTypes, mode);
      
      res.json(generatedRecipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
      res.status(500).json({ message: "Failed to generate recipe" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate random recipes
function generateRandomRecipe(ingredients: any[], glassTypes: any[], mode: string) {
  const alcoholIngredients = ingredients.filter(i => i.category === 'alcohol');
  const juiceIngredients = ingredients.filter(i => i.category === 'juice');
  const syrupIngredients = ingredients.filter(i => i.category === 'syrup');
  const fruitIngredients = ingredients.filter(i => i.category === 'fruit');
  
  let selectedIngredients = [];
  let glassType = glassTypes[Math.floor(Math.random() * glassTypes.length)];
  
  switch (mode) {
    case 'classic':
      selectedIngredients = [
        alcoholIngredients[Math.floor(Math.random() * alcoholIngredients.length)],
        juiceIngredients[Math.floor(Math.random() * juiceIngredients.length)],
        syrupIngredients[Math.floor(Math.random() * syrupIngredients.length)]
      ];
      break;
    case 'crazy':
      selectedIngredients = [
        alcoholIngredients[Math.floor(Math.random() * alcoholIngredients.length)],
        alcoholIngredients[Math.floor(Math.random() * alcoholIngredients.length)],
        juiceIngredients[Math.floor(Math.random() * juiceIngredients.length)],
        syrupIngredients[Math.floor(Math.random() * syrupIngredients.length)],
        fruitIngredients[Math.floor(Math.random() * fruitIngredients.length)]
      ];
      break;
    case 'summer':
      selectedIngredients = [
        alcoholIngredients.filter(i => i.name.toLowerCase().includes('rum') || i.name.toLowerCase().includes('vodka'))[0] || alcoholIngredients[0],
        juiceIngredients.filter(i => i.name.toLowerCase().includes('pineapple') || i.name.toLowerCase().includes('orange'))[0] || juiceIngredients[0],
        fruitIngredients[Math.floor(Math.random() * fruitIngredients.length)]
      ];
      break;
    case 'nonalcoholic':
      selectedIngredients = [
        juiceIngredients[Math.floor(Math.random() * juiceIngredients.length)],
        juiceIngredients[Math.floor(Math.random() * juiceIngredients.length)],
        syrupIngredients[Math.floor(Math.random() * syrupIngredients.length)]
      ];
      break;
    case 'shot':
      glassType = glassTypes.find(g => g.shape === 'shot') || glassTypes[0];
      selectedIngredients = [
        alcoholIngredients[Math.floor(Math.random() * alcoholIngredients.length)]
      ];
      break;
    default:
      selectedIngredients = [
        alcoholIngredients[Math.floor(Math.random() * alcoholIngredients.length)],
        juiceIngredients[Math.floor(Math.random() * juiceIngredients.length)]
      ];
  }
  
  // Generate random amounts based on glass capacity
  const baseAmount = Math.floor(glassType.capacity / selectedIngredients.length);
  const recipeIngredients = selectedIngredients.filter(Boolean).map((ingredient, index) => ({
    ingredient,
    amount: baseAmount + Math.floor(Math.random() * 20) - 10, // ±10ml variance
    unit: 'ml',
    order: index + 1
  }));
  
  return {
    name: generateRandomName(),
    description: `A ${mode} cocktail with ${selectedIngredients.filter(Boolean).map(i => i.name).join(', ')}`,
    glass: glassType,
    ingredients: recipeIngredients,
    totalVolume: recipeIngredients.reduce((sum, ri) => sum + ri.amount, 0),
    category: mode
  };
}

function generateRandomName(): string {
  const adjectives = ['Tropical', 'Midnight', 'Golden', 'Crimson', 'Azure', 'Emerald', 'Sunset', 'Storm', 'Fire', 'Ice'];
  const nouns = ['Breeze', 'Thunder', 'Wave', 'Dream', 'Spark', 'Flame', 'Mist', 'Rush', 'Bliss', 'Punch'];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective} ${noun}`;
}
