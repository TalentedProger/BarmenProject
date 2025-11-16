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

  ingredients.forEach(({ ingredient, amount, unit }) => {
    const quantity = parseFloat(amount.toString());
    const abv = parseFloat(ingredient.abv?.toString() || "0");
    const pricePerLiter = parseFloat(ingredient.pricePerLiter.toString());
    const tasteProfile = ingredient.tasteProfile as TasteProfile;

    // Фрукты и декор измеряются в граммах или килограммах
  const isFruitOrGarnish = ingredient.category === 'fruit' || ingredient.category === 'garnish';
  // ВАЖНО: Используем единицу измерения самого элемента рецепта, если она есть.
  // Это предотвращает ситуацию, когда ingredient.unit === 'kg', но сам рецепт хранит 'g'.
  const effectiveUnit = (unit && unit.trim()) ? unit : (ingredient.unit || "ml");
  const isKgBased = effectiveUnit === "kg";
  const isGramBased = effectiveUnit === "g";
  
  let volumeInMl = 0;
  let costCalculation = 0;
  let weight = 0;

    if (isFruitOrGarnish || isGramBased || isKgBased) {
      // Для фруктов и декора:
      // - Добавляем объем пропорционально массе (1г ≈ 1мл для визуализации)
      // - Цена рассчитывается в зависимости от единиц измерения
      
      if (isKgBased) {
      // Если количество в килограммах (например 0.015 кг = 15г)
      // pricePerLiter хранится в копейках (24900 = 249₽/кг)
      // Делим на 100, чтобы получить рубли, затем умножаем на quantity
      costCalculation = quantity * (pricePerLiter / 100);
      weight = (quantity * 1000) / 100; // Конвертируем кг в граммы для веса
      volumeInMl = quantity * 1000; // 1кг = 1000мл для визуализации заполнения
    } else {
      // Если количество в граммах
      // pricePerLiter - это цена за 1кг (1000г) в копейках, делим на 100 для рублей
      costCalculation = (quantity / 1000) * (pricePerLiter / 100);
      weight = quantity / 100;
      volumeInMl = quantity; // 1г = 1мл для визуализации заполнения
    }
  } else {
      // Для жидких ингредиентов (мл)
      volumeInMl = quantity;
      costCalculation = (quantity / 1000) * pricePerLiter; // цена за литр (1000мл)
      weight = volumeInMl / 100;
    }
    
    totalVolume += volumeInMl;
    totalAlcohol += (volumeInMl * abv) / 100;
    totalCost += costCalculation;

    // Weight taste contributions
    totalSweet += (tasteProfile.sweet || 0) * weight;
    totalSour += (tasteProfile.sour || 0) * weight;
    totalBitter += (tasteProfile.bitter || 0) * weight;
    totalAlcoholTaste += (tasteProfile.alcohol || 0) * weight;
  });

  const totalAbv = totalVolume > 0 ? (totalAlcohol / totalVolume) * 100 : 0;
  // Calculate total weight from ingredients for taste balance
  // Weight includes both liquids and solids (fruits/garnish)
  let totalIngredientWeight = 0;
  ingredients.forEach(({ ingredient, amount, unit }) => {
    const quantity = parseFloat(amount.toString());
    const isFruitOrGarnish = ingredient.category === 'fruit' || ingredient.category === 'garnish';
    const effectiveUnit = (unit && unit.trim()) ? unit : (ingredient.unit || "ml");
    const isKgBased = effectiveUnit === "kg";
    const isGramBased = effectiveUnit === "g";
    
    if (isFruitOrGarnish || isKgBased || isGramBased) {
      if (isKgBased) {
        totalIngredientWeight += (quantity * 1000) / 100; // kg to grams weight
      } else {
        totalIngredientWeight += quantity / 100; // grams weight
      }
    } else {
      totalIngredientWeight += quantity / 100; // ml weight
    }
  });
  
  const totalWeight = totalIngredientWeight || 1; // Avoid division by zero

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
  ingredients: (RecipeIngredient & { ingredient: Ingredient })[],
  selectedGlass?: { capacity: number }
): string[] {
  const errors: string[] = [];
  
  if (!ingredients.length) {
    errors.push("Добавьте хотя бы один ингредиент");
    return errors;
  }

  const stats = calculateCocktailStats(ingredients);
  
  // Check for glass overflow first
  if (selectedGlass && stats.totalVolume > selectedGlass.capacity) {
    errors.push(`Объем превышает вместимость стакана (${selectedGlass.capacity}ml)`);
  }
  
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
