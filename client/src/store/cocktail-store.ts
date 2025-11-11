import { create } from 'zustand';
import type { Ingredient, GlassType, RecipeIngredient } from '@shared/schema';
import { calculateCocktailStats, type CocktailCalculation } from '@/lib/cocktail-utils';

interface CocktailIngredient extends RecipeIngredient {
  ingredient: Ingredient;
}

interface CocktailStore {
  // State
  selectedGlass: GlassType | null;
  ingredients: CocktailIngredient[];
  cocktailStats: CocktailCalculation;
  recipeName: string;
  recipeDescription: string;
  
  // Actions
  setSelectedGlass: (glass: GlassType | null) => void;
  addIngredient: (ingredient: Ingredient, amount: number) => void;
  updateIngredient: (index: number, amount: number) => void;
  removeIngredient: (index: number) => void;
  clearIngredients: () => void;
  reorderIngredients: (startIndex: number, endIndex: number) => void;
  loadRecipe: (glass: GlassType, ingredients: { ingredient: Ingredient; amount: number; unit: string }[], name?: string, description?: string) => void;
  setRecipeName: (name: string) => void;
  setRecipeDescription: (description: string) => void;
  
  // Computed
  recalculateStats: () => void;
}

export const useCocktailStore = create<CocktailStore>((set, get) => ({
  selectedGlass: null,
  ingredients: [],
  cocktailStats: {
    totalVolume: 0,
    totalAbv: 0,
    totalCost: 0,
    tasteBalance: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 }
  },
  recipeName: '',
  recipeDescription: '',
  
  setSelectedGlass: (glass) => set({ selectedGlass: glass }),
  
  addIngredient: (ingredient, amount) => {
    const newIngredient: CocktailIngredient = {
      id: Date.now(), // temporary ID
      recipeId: '',
      ingredientId: ingredient.id!,
      amount: amount.toString(),
      unit: ingredient.unit,
      order: get().ingredients.length + 1,
      ingredient,
      createdAt: new Date()
    };
    
    set((state) => ({
      ingredients: [...state.ingredients, newIngredient]
    }));
    
    get().recalculateStats();
  },
  
  updateIngredient: (index, amount) => {
    set((state) => ({
      ingredients: state.ingredients.map((ingredient, i) => 
        i === index ? { ...ingredient, amount: amount.toString() } : ingredient
      )
    }));
    
    get().recalculateStats();
  },
  
  removeIngredient: (index) => {
    set((state) => ({
      ingredients: state.ingredients.filter((_, i) => i !== index)
    }));
    
    get().recalculateStats();
  },
  
  clearIngredients: () => {
    set({ 
      ingredients: [],
      cocktailStats: {
        totalVolume: 0,
        totalAbv: 0,
        totalCost: 0,
        tasteBalance: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 }
      }
    });
  },
  
  reorderIngredients: (startIndex, endIndex) => {
    set((state) => {
      const newIngredients = [...state.ingredients];
      const [reorderedItem] = newIngredients.splice(startIndex, 1);
      newIngredients.splice(endIndex, 0, reorderedItem);
      
      // Update order property
      return {
        ingredients: newIngredients.map((ingredient, index) => ({
          ...ingredient,
          order: index + 1
        }))
      };
    });
    
    get().recalculateStats();
  },
  
  recalculateStats: () => {
    const stats = calculateCocktailStats(get().ingredients);
    set({ cocktailStats: stats });
  },
  
  loadRecipe: (glass, recipeIngredients, name = '', description = '') => {
    const cocktailIngredients: CocktailIngredient[] = recipeIngredients.map((item, index) => ({
      id: Date.now() + index,
      recipeId: '',
      ingredientId: item.ingredient.id!,
      amount: item.amount.toString(),
      unit: item.unit,
      order: index + 1,
      ingredient: item.ingredient,
      createdAt: new Date()
    }));
    
    set({ 
      selectedGlass: glass,
      ingredients: cocktailIngredients,
      recipeName: name,
      recipeDescription: description
    });
    
    get().recalculateStats();
  },
  
  setRecipeName: (name) => set({ recipeName: name }),
  setRecipeDescription: (description) => set({ recipeDescription: description }),
}));
