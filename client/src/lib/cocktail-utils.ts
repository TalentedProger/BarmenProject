import type { Ingredient, RecipeIngredient } from "@shared/schema";

export interface TasteProfile {
  sweet: number;
  sour: number;
  bitter: number;
  alcohol: number;
}

export interface CocktailCalculation {
  totalVolume: number;
  totalAbv: number;
  totalCost: number;
  tasteBalance: TasteProfile;
}

export function calculateCocktailStats(
  ingredients: (RecipeIngredient & { ingredient: Ingredient })[]
): CocktailCalculation {
  if (!ingredients.length) {
    return {
      totalVolume: 0,
      totalAbv: 0,
      totalCost: 0,
      tasteBalance: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 }
    };
  }

  let totalVolume = 0;
  let totalAlcohol = 0;
  let totalCost = 0;
  let totalSweet = 0;
  let totalSour = 0;
  let totalBitter = 0;
  let totalAlcoholTaste = 0;

  ingredients.forEach(({ ingredient, amount }) => {
    const volume = parseFloat(amount.toString());
    const abv = parseFloat(ingredient.abv?.toString() || "0");
    const pricePerLiter = parseFloat(ingredient.pricePerLiter.toString());
    const tasteProfile = ingredient.tasteProfile as TasteProfile;

    totalVolume += volume;
    totalAlcohol += (volume * abv) / 100;
    totalCost += (volume / 1000) * pricePerLiter;

    // Weight taste contributions by volume
    const weight = volume / 100; // Normalize by 100ml
    totalSweet += (tasteProfile.sweet || 0) * weight;
    totalSour += (tasteProfile.sour || 0) * weight;
    totalBitter += (tasteProfile.bitter || 0) * weight;
    totalAlcoholTaste += (tasteProfile.alcohol || 0) * weight;
  });

  const totalAbv = totalVolume > 0 ? (totalAlcohol / totalVolume) * 100 : 0;
  const totalWeight = totalVolume / 100;

  return {
    totalVolume: Math.round(totalVolume),
    totalAbv: Math.round(totalAbv * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    tasteBalance: {
      sweet: Math.min(10, Math.round((totalSweet / totalWeight) * 10) / 10),
      sour: Math.min(10, Math.round((totalSour / totalWeight) * 10) / 10),
      bitter: Math.min(10, Math.round((totalBitter / totalWeight) * 10) / 10),
      alcohol: Math.min(10, Math.round((totalAlcoholTaste / totalWeight) * 10) / 10)
    }
  };
}

export function getIngredientColor(ingredient: Ingredient): string {
  return ingredient.color || "#888888";
}

export function generateCocktailName(): string {
  const adjectives = [
    "Тропический", "Полуночный", "Золотой", "Алый", "Лазурный", 
    "Изумрудный", "Закатный", "Штормовой", "Огненный", "Ледяной"
  ];
  const nouns = [
    "Бриз", "Гром", "Волна", "Сон", "Искра", 
    "Пламя", "Туман", "Порыв", "Блаженство", "Пунш"
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective} ${noun}`;
}

export function validateCocktailIngredients(
  ingredients: (RecipeIngredient & { ingredient: Ingredient })[]
): string[] {
  const errors: string[] = [];
  
  if (!ingredients.length) {
    errors.push("Добавьте хотя бы один ингредиент");
    return errors;
  }

  const stats = calculateCocktailStats(ingredients);
  
  if (stats.totalVolume < 30) {
    errors.push("Слишком маленький объем коктейля");
  }
  
  if (stats.totalVolume > 500) {
    errors.push("Слишком большой объем коктейля");
  }

  if (stats.tasteBalance.sweet > 8) {
    errors.push("Слишком много сладких ингредиентов");
  }
  
  if (stats.tasteBalance.bitter > 7) {
    errors.push("Слишком много горьких ингредиентов");
  }

  if (stats.totalAbv > 50) {
    errors.push("Слишком крепкий коктейль");
  }

  return errors;
}
