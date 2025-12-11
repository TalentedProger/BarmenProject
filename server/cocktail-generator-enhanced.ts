import type { Ingredient, GlassType } from '@shared/schema';

// ===============================================
// УЛУЧШЕННЫЙ ГЕНЕРАТОР КОКТЕЙЛЕЙ
// Версия 2.0 - Полный учёт режимов и подкатегорий
// ===============================================

// Интерфейсы для генератора
export interface GenerationFilters {
  mode: string;
  requiredIngredients?: number[];      // ID ингредиентов, которые должны быть в рецепте
  requiredCategories?: string[];       // Категории, из которых должен быть хотя бы один ингредиент
  excludedIngredients?: number[];      // ID ингредиентов, которые запрещены
  excludedSubtypes?: string[];         // Подкатегории, которые запрещены (напр. 'Пиво', 'Вино красное')
  excludedCategories?: string[];       // Категории, которые запрещены
  maxAlcoholContent?: number;          // Максимальная крепость (%)
  minAlcoholContent?: number;          // Минимальная крепость (%)
  maxPrice?: number;                   // Максимальная стоимость (руб)
  preferredCategories?: string[];      // Предпочитаемые категории ингредиентов
  preferredSubtypes?: string[];        // Предпочитаемые подкатегории (напр. 'Водка', 'Виски')
  glassType?: string;                  // Предпочитаемый тип стакана
  complexity?: 'simple' | 'medium' | 'complex'; // Сложность рецепта
  tastePreferences?: {
    sweet?: number;   // 0-10
    sour?: number;    // 0-10
    bitter?: number;  // 0-10
    alcohol?: number; // 0-10
  };
}

export interface GeneratedRecipe {
  name: string;
  description: string;
  glass: GlassType;
  ingredients: {
    ingredient: Ingredient;
    amount: number;
    unit: string;
    order: number;
  }[];
  totalVolume: number;
  totalAbv: number;
  totalCost: number;
  category: string;
  difficulty: string;
  tasteBalance: {
    sweet: number;
    sour: number;
    bitter: number;
    alcohol: number;
  };
  matchScore: number;
}

// ===============================================
// КАТЕГОРИИ И ПОДКАТЕГОРИИ ИНГРЕДИЕНТОВ
// ===============================================

// Все категории ингредиентов в системе
const ALL_CATEGORIES = [
  'alcohol',      // Алкоголь
  'juice',        // Соки
  'syrup',        // Сиропы
  'mixer',        // Миксеры (тоник, газировка)
  'soda',         // Газированные напитки
  'energy_drink', // Энергетические напитки
  'fruit',        // Фрукты
  'bitter',       // Биттеры
  'garnish',      // Декор
  'ice',          // Лёд
];

// Подкатегории алкоголя (subtype)
const ALCOHOL_SUBTYPES = [
  // Крепкий алкоголь (35-50%)
  'Водка', 'Виски', 'Бурбон', 'Джин', 'Ром', 'Текила', 'Коньяк', 'Бренди',
  'Абсент', 'Кальвадос', 'Граппа', 'Настойка',
  // Средний алкоголь (15-35%)
  'Ликёр', 'Вермут',
  // Слабый алкоголь (3-15%)
  'Пиво', 'Вино красное', 'Вино белое', 'Вино розовое', 
  'Вино игристое', 'Игристое вино', 'Шампанское',
];

// Подкатегории для других категорий
const JUICE_SUBTYPES = [
  'Апельсиновый', 'Яблочный', 'Ананасовый', 'Клюквенный', 'Лимонный',
  'Лаймовый', 'Томатный', 'Грейпфрутовый', 'Вишневый', 'Гранатовый'
];

const SODA_SUBTYPES = [
  'Кола', 'Лимонад', 'Апельсиновая', 'Лимон-Лайм', 'Цитрус', 'Фруктовая', 'Тоник'
];

const SYRUP_SUBTYPES = [
  'Простой', 'Сахарный', 'Кокосовый', 'Гренадин', 'Карамельный', 'Ванильный',
  'Мятный', 'Малиновый', 'Клубничный', 'Шоколадный', 'Миндальный'
];

// ===============================================
// КОНФИГУРАЦИЯ РЕЖИМОВ ГЕНЕРАЦИИ
// ===============================================

interface ModeConfig {
  name: string;
  description: string;
  // Настройки алкоголя
  alcoholRatio: [number, number];         // Мин-макс доля алкоголя в рецепте
  allowedAbvRange: [number, number];      // Допустимый диапазон крепости в рецепте
  // Количество ингредиентов
  ingredientCount: [number, number];
  // Обязательные и предпочитаемые категории
  requiredCategories: string[];           // ОБЯЗАТЕЛЬНЫЕ категории
  preferredCategories: string[];          // Предпочитаемые категории
  // Запрещённые категории/подкатегории для режима
  forbiddenCategories: string[];
  forbiddenSubtypes: string[];
  // Допустимые подкатегории алкоголя для режима
  allowedAlcoholSubtypes: string[];
  // Вкусовой баланс
  tasteBalance: { sweet: number; sour: number; bitter: number; alcohol: number };
  // Допустимые стаканы
  glassTypes: string[];
  // Строгость режима (насколько строго соблюдать правила)
  strictness: 'strict' | 'moderate' | 'loose';
}

const GENERATION_MODES: Record<string, ModeConfig> = {
  classic: {
    name: 'Классический',
    description: 'Проверенные временем рецепты с гармоничным сочетанием вкусов',
    alcoholRatio: [0.35, 0.6],
    allowedAbvRange: [15, 35],
    ingredientCount: [3, 5],
    requiredCategories: ['alcohol'],
    preferredCategories: ['alcohol', 'juice', 'syrup', 'bitter'],
    forbiddenCategories: ['energy_drink'],
    forbiddenSubtypes: ['Пиво', 'Вино красное', 'Вино белое', 'Вино розовое', 'Вино игристое'],
    allowedAlcoholSubtypes: [
      'Водка', 'Виски', 'Бурбон', 'Джин', 'Ром', 'Текила', 'Коньяк', 'Бренди',
      'Ликёр', 'Вермут', 'Настойка', 'Абсент', 'Кальвадос', 'Граппа'
    ],
    tasteBalance: { sweet: 5, sour: 4, bitter: 3, alcohol: 6 },
    glassTypes: ['old-fashioned', 'martini', 'highball', 'coupe', 'sour'],
    strictness: 'moderate'
  },
  
  crazy: {
    name: 'Сумасшедший',
    description: 'Экспериментальный коктейль для любителей необычных сочетаний',
    alcoholRatio: [0.25, 0.75],
    allowedAbvRange: [10, 45],
    ingredientCount: [4, 7],
    requiredCategories: ['alcohol'],
    preferredCategories: ['alcohol', 'juice', 'syrup', 'bitter', 'mixer', 'energy_drink', 'soda'],
    forbiddenCategories: [],
    forbiddenSubtypes: [],
    allowedAlcoholSubtypes: ALCOHOL_SUBTYPES, // Все подкатегории разрешены
    tasteBalance: { sweet: 6, sour: 6, bitter: 5, alcohol: 7 },
    glassTypes: ['highball', 'hurricane', 'margarita', 'tumbler'],
    strictness: 'loose'
  },
  
  summer: {
    name: 'Летний',
    description: 'Освежающий напиток, идеальный для жаркого дня',
    alcoholRatio: [0.15, 0.4],
    allowedAbvRange: [5, 20],
    ingredientCount: [3, 6],
    requiredCategories: ['juice'],
    preferredCategories: ['alcohol', 'juice', 'fruit', 'soda', 'mixer'],
    forbiddenCategories: ['bitter', 'energy_drink'],
    forbiddenSubtypes: ['Виски', 'Бурбон', 'Коньяк', 'Бренди', 'Абсент', 'Настойка'],
    allowedAlcoholSubtypes: [
      'Водка', 'Джин', 'Ром', 'Текила', 'Ликёр', 'Вермут',
      'Вино белое', 'Вино розовое', 'Вино игристое', 'Шампанское'
    ],
    tasteBalance: { sweet: 7, sour: 6, bitter: 1, alcohol: 3 },
    glassTypes: ['highball', 'hurricane', 'wine', 'champagne-flute', 'tumbler'],
    strictness: 'moderate'
  },
  
  nonalcoholic: {
    name: 'Безалкогольный',
    description: 'Безалкогольный напиток, полный вкуса и аромата',
    alcoholRatio: [0, 0],
    allowedAbvRange: [0, 0.5], // Почти 0 алкоголя
    ingredientCount: [3, 6],  // Минимум 3 ингредиента
    requiredCategories: ['juice', 'fruit'],  // Обязательно сок И фрукты
    preferredCategories: ['juice', 'syrup', 'fruit', 'soda', 'mixer'],
    forbiddenCategories: ['alcohol', 'bitter'],
    forbiddenSubtypes: ALCOHOL_SUBTYPES, // ВСЕ алкогольные подкатегории запрещены
    allowedAlcoholSubtypes: [],
    tasteBalance: { sweet: 6, sour: 5, bitter: 1, alcohol: 0 },
    glassTypes: ['highball', 'tumbler', 'hurricane', 'old-fashioned'],
    strictness: 'strict'
  },
  
  shot: {
    name: 'Шот',
    description: 'Крепкий шот для настоящих ценителей',
    alcoholRatio: [0.7, 1.0],
    allowedAbvRange: [25, 50],
    ingredientCount: [2, 3],
    requiredCategories: ['alcohol'],
    preferredCategories: ['alcohol', 'syrup', 'bitter'],
    forbiddenCategories: ['juice', 'soda', 'fruit', 'energy_drink', 'mixer'],
    forbiddenSubtypes: ['Пиво', 'Вино красное', 'Вино белое', 'Вино розовое', 'Вино игристое'],
    allowedAlcoholSubtypes: [
      'Водка', 'Виски', 'Бурбон', 'Джин', 'Ром', 'Текила', 'Коньяк', 'Бренди',
      'Ликёр', 'Абсент', 'Настойка'
    ],
    tasteBalance: { sweet: 3, sour: 2, bitter: 4, alcohol: 9 },
    glassTypes: ['shot'],
    strictness: 'strict'
  },
  
  // Новые режимы
  wine_cocktail: {
    name: 'Винный коктейль',
    description: 'Коктейли на основе вина',
    alcoholRatio: [0.4, 0.7],
    allowedAbvRange: [8, 18],
    ingredientCount: [2, 4],
    requiredCategories: ['alcohol'],
    preferredCategories: ['alcohol', 'juice', 'fruit', 'syrup'],
    forbiddenCategories: ['energy_drink', 'bitter'],
    forbiddenSubtypes: [
      'Водка', 'Виски', 'Бурбон', 'Джин', 'Ром', 'Текила', 'Коньяк', 'Бренди',
      'Абсент', 'Настойка', 'Пиво'
    ],
    allowedAlcoholSubtypes: [
      'Вино красное', 'Вино белое', 'Вино розовое', 
      'Вино игристое', 'Шампанское', 'Ликёр', 'Вермут'
    ],
    tasteBalance: { sweet: 5, sour: 4, bitter: 2, alcohol: 4 },
    glassTypes: ['wine', 'champagne-flute', 'highball', 'tumbler'],
    strictness: 'moderate'
  },
  
  beer_cocktail: {
    name: 'Пивной коктейль',
    description: 'Коктейли на основе пива',
    alcoholRatio: [0.5, 0.9],
    allowedAbvRange: [3, 12],
    ingredientCount: [2, 4],
    requiredCategories: ['alcohol'],
    preferredCategories: ['alcohol', 'juice', 'soda'],
    forbiddenCategories: ['syrup', 'bitter', 'energy_drink'],
    forbiddenSubtypes: [
      'Водка', 'Виски', 'Бурбон', 'Коньяк', 'Бренди', 'Абсент', 
      'Вино красное', 'Вино белое', 'Вино розовое', 'Вино игристое'
    ],
    allowedAlcoholSubtypes: ['Пиво', 'Ликёр'],
    tasteBalance: { sweet: 3, sour: 3, bitter: 5, alcohol: 4 },
    glassTypes: ['beer-mug', 'highball', 'tumbler'],
    strictness: 'moderate'
  },
  
  energy: {
    name: 'Энергетический',
    description: 'Коктейли с энергетическими напитками',
    alcoholRatio: [0.2, 0.5],
    allowedAbvRange: [10, 25],
    ingredientCount: [2, 4],
    requiredCategories: ['energy_drink'],
    preferredCategories: ['alcohol', 'energy_drink', 'juice'],
    forbiddenCategories: ['bitter', 'fruit'],
    forbiddenSubtypes: ['Коньяк', 'Бренди', 'Вино красное', 'Вино белое', 'Вино розовое', 'Пиво'],
    allowedAlcoholSubtypes: ['Водка', 'Джин', 'Ром', 'Текила', 'Ликёр'],
    tasteBalance: { sweet: 6, sour: 4, bitter: 2, alcohol: 5 },
    glassTypes: ['highball', 'tumbler', 'hurricane'],
    strictness: 'moderate'
  }
};

// ===============================================
// ПРАВИЛА СОВМЕСТИМОСТИ ИНГРЕДИЕНТОВ
// ===============================================

// Какие категории хорошо сочетаются с каждой подкатегорией алкоголя
const ALCOHOL_COMPATIBILITY: Record<string, string[]> = {
  // Крепкий алкоголь
  'Водка': ['juice', 'soda', 'syrup', 'mixer', 'energy_drink', 'fruit'],
  'Джин': ['mixer', 'juice', 'bitter', 'fruit', 'soda'],
  'Ром': ['juice', 'fruit', 'syrup', 'soda', 'mixer'],
  'Текила': ['juice', 'fruit', 'syrup', 'soda'],
  'Виски': ['bitter', 'syrup', 'soda', 'mixer'],
  'Бурбон': ['bitter', 'syrup', 'soda', 'mixer'],
  'Коньяк': ['bitter', 'syrup', 'juice'],
  'Бренди': ['juice', 'syrup', 'bitter'],
  'Абсент': ['syrup', 'juice'],
  'Кальвадос': ['juice', 'syrup', 'bitter'],
  'Граппа': ['juice', 'syrup'],
  'Настойка': ['juice', 'syrup', 'bitter', 'soda'],
  
  // Ликёры и вермуты
  'Ликёр': ['juice', 'soda', 'mixer', 'fruit', 'syrup'],
  'Вермут': ['juice', 'soda', 'bitter', 'fruit'],
  
  // Вино
  'Вино красное': ['juice', 'fruit', 'syrup'],
  'Вино белое': ['juice', 'fruit', 'syrup', 'soda'],
  'Вино розовое': ['juice', 'fruit', 'syrup', 'soda'],
  'Вино игристое': ['juice', 'fruit', 'syrup'],
  'Шампанское': ['juice', 'fruit', 'syrup'],
  
  // Пиво
  'Пиво': ['juice', 'soda']
};

// Несовместимые комбинации (что НЕ стоит смешивать)
const INCOMPATIBLE_COMBINATIONS: Array<[string[], string[]]> = [
  // Пиво не сочетается с крепким алкоголем
  [['Пиво'], ['Водка', 'Виски', 'Бурбон', 'Джин', 'Ром', 'Текила', 'Коньяк', 'Бренди', 'Абсент']],
  // Вино не сочетается с крепким алкоголем (кроме ликёров)
  [['Вино красное', 'Вино белое', 'Вино розовое'], ['Водка', 'Виски', 'Бурбон', 'Текила', 'Коньяк', 'Бренди']],
  // Энергетики не сочетаются с вином и пивом
  [['energy_drink'], ['Вино красное', 'Вино белое', 'Вино розовое', 'Вино игристое', 'Пиво']],
  // Биттеры не сочетаются с молочными и сладкими ликёрами
  [['bitter'], ['Вино красное', 'Вино белое', 'Вино розовое', 'Пиво']],
];

// ===============================================
// КЛАСС ГЕНЕРАТОРА КОКТЕЙЛЕЙ
// ===============================================

export class EnhancedCocktailGenerator {
  private ingredients: Ingredient[];
  private glassTypes: GlassType[];

  constructor(ingredients: Ingredient[], glassTypes: GlassType[]) {
    this.ingredients = ingredients;
    this.glassTypes = glassTypes;
  }

  /**
   * Главный метод генерации коктейля
   */
  generateCocktail(filters: GenerationFilters): GeneratedRecipe {
    const mode = GENERATION_MODES[filters.mode] || GENERATION_MODES.classic;
    
    // Шаг 1: Фильтруем ингредиенты по правилам режима и пользовательским фильтрам
    const availableIngredients = this.filterIngredientsByMode(filters, mode);
    
    if (availableIngredients.length < 2) {
      throw new Error('Недостаточно ингредиентов для создания коктейля с заданными фильтрами');
    }

    // Шаг 2: Выбираем стакан
    const glass = this.selectGlass(filters, mode);
    
    // Шаг 3: Генерируем несколько кандидатов и выбираем лучшего
    const candidates: GeneratedRecipe[] = [];
    const maxAttempts = 15;
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const recipe = this.generateSingleRecipe(availableIngredients, glass, mode, filters);
        
        // Валидируем рецепт на соответствие режиму
        if (this.validateRecipeForMode(recipe, mode, filters)) {
          candidates.push(recipe);
        }
      } catch (error) {
        // Пропускаем неудачные попытки
        continue;
      }
    }

    if (candidates.length === 0) {
      throw new Error('Не удалось сгенерировать подходящий рецепт. Попробуйте изменить фильтры.');
    }

    // Сортируем по соответствию и возвращаем лучший
    candidates.sort((a, b) => b.matchScore - a.matchScore);
    return candidates[0];
  }

  /**
   * Фильтрует ингредиенты по правилам режима
   */
  private filterIngredientsByMode(filters: GenerationFilters, mode: ModeConfig): Ingredient[] {
    return this.ingredients.filter(ingredient => {
      // 1. Проверяем запрещённые категории режима
      if (mode.forbiddenCategories.includes(ingredient.category)) {
        return false;
      }
      
      // 2. Проверяем запрещённые подкатегории режима
      if (ingredient.subtype && mode.forbiddenSubtypes.includes(ingredient.subtype)) {
        return false;
      }
      
      // 3. Для алкоголя проверяем допустимые подкатегории
      if (ingredient.category === 'alcohol') {
        // Если режим nonalcoholic - запрещаем весь алкоголь
        if (mode.allowedAlcoholSubtypes.length === 0) {
          return false;
        }
        
        // Проверяем подкатегорию алкоголя
        if (ingredient.subtype && !mode.allowedAlcoholSubtypes.includes(ingredient.subtype)) {
          // Проверяем по имени если subtype не задан
          const matchesByName = mode.allowedAlcoholSubtypes.some(subtype => 
            ingredient.name.toLowerCase().includes(subtype.toLowerCase())
          );
          if (!matchesByName) {
            return false;
          }
        }
      }
      
      // 4. Пользовательские исключения
      if (filters.excludedIngredients?.includes(ingredient.id)) {
        return false;
      }
      
      if (filters.excludedCategories?.includes(ingredient.category)) {
        return false;
      }
      
      if (ingredient.subtype && filters.excludedSubtypes?.includes(ingredient.subtype)) {
        return false;
      }
      
      // 5. Проверяем крепость для алкоголя
      if (ingredient.category === 'alcohol') {
        const abv = parseFloat(ingredient.abv?.toString() || '0');
        if (filters.maxAlcoholContent && abv > filters.maxAlcoholContent) {
          // Не исключаем полностью, но понижаем приоритет
        }
      }
      
      return true;
    });
  }

  /**
   * Выбирает подходящий стакан
   */
  private selectGlass(filters: GenerationFilters, mode: ModeConfig): GlassType {
    // Если указан конкретный стакан
    if (filters.glassType && filters.glassType !== 'any') {
      const preferred = this.glassTypes.find(g => g.shape === filters.glassType);
      if (preferred) return preferred;
    }

    // Фильтруем по режиму
    const modeGlasses = this.glassTypes.filter(g => mode.glassTypes.includes(g.shape));
    
    if (modeGlasses.length > 0) {
      return modeGlasses[Math.floor(Math.random() * modeGlasses.length)];
    }

    // Fallback
    return this.glassTypes[Math.floor(Math.random() * this.glassTypes.length)];
  }

  /**
   * Генерирует один рецепт
   */
  private generateSingleRecipe(
    availableIngredients: Ingredient[], 
    glass: GlassType, 
    mode: ModeConfig, 
    filters: GenerationFilters
  ): GeneratedRecipe {
    const targetVolume = glass.capacity;
    
    // Определяем количество ингредиентов на основе сложности и режима
    let ingredientCount: number;
    switch (filters.complexity) {
      case 'simple':
        ingredientCount = mode.ingredientCount[0];
        break;
      case 'complex':
        ingredientCount = mode.ingredientCount[1];
        break;
      default:
        ingredientCount = Math.floor(
          mode.ingredientCount[0] + 
          Math.random() * (mode.ingredientCount[1] - mode.ingredientCount[0] + 1)
        );
    }

    // Выбираем ингредиенты с учётом всех правил
    const selectedIngredients = this.selectIngredientsForMode(
      availableIngredients, 
      ingredientCount, 
      mode, 
      filters
    );

    if (selectedIngredients.length < 2) {
      throw new Error('Недостаточно совместимых ингредиентов');
    }

    // Рассчитываем пропорции
    const recipeIngredients = this.calculateProportions(selectedIngredients, targetVolume, mode);

    // Рассчитываем характеристики
    const totalVolume = recipeIngredients
      .filter(item => item.unit !== 'piece')
      .reduce((sum, item) => sum + item.amount, 0);
      
    const totalAlcohol = recipeIngredients.reduce((sum, item) => {
      if (item.unit === 'piece') return sum;
      const abv = parseFloat(item.ingredient.abv?.toString() || '0');
      return sum + (item.amount * (abv / 100));
    }, 0);
    
    const totalAbv = totalVolume > 0 ? (totalAlcohol / totalVolume) * 100 : 0;
    
    const totalCost = recipeIngredients.reduce((sum, item) => {
      const pricePerLiter = parseFloat(item.ingredient.pricePerLiter?.toString() || '0');
      if (item.unit === 'piece') return sum + pricePerLiter / 10; // Условная цена за штуку
      
      // Для фруктов/гарниров: pricePerLiter хранится в копейках за кг, amount в граммах
      // Для жидкостей: pricePerLiter в рублях за литр, amount в мл
      const isFruitOrGarnish = item.ingredient.category === 'fruit' || item.ingredient.category === 'garnish';
      const isGramBased = item.unit === 'g' || item.unit === 'kg';
      
      if (isFruitOrGarnish || isGramBased) {
        // pricePerLiter - копейки за кг, конвертируем в рубли/кг делением на 100
        // amount в граммах, конвертируем в кг делением на 1000
        const pricePerKgInRubles = pricePerLiter / 100;
        const amountInKg = item.unit === 'kg' ? item.amount : item.amount / 1000;
        return sum + amountInKg * pricePerKgInRubles;
      }
      
      // Для жидкостей: amount в мл, pricePerLiter в рублях/литр
      return sum + (item.amount / 1000) * pricePerLiter;
    }, 0);

    // Рассчитываем вкусовой баланс
    const tasteBalance = this.calculateTasteBalance(recipeIngredients, totalVolume);

    // Оценка соответствия фильтрам
    const matchScore = this.calculateMatchScore(
      { totalAbv, totalCost, tasteBalance, ingredients: recipeIngredients },
      mode,
      filters
    );

    return {
      name: this.generateName(selectedIngredients, mode),
      description: this.generateDescription(selectedIngredients, mode),
      glass,
      ingredients: recipeIngredients,
      totalVolume,
      totalAbv,
      totalCost,
      category: filters.mode,
      difficulty: this.calculateDifficulty(recipeIngredients.length),
      tasteBalance,
      matchScore
    };
  }

  /**
   * Выбирает ингредиенты для режима с учётом совместимости
   */
  private selectIngredientsForMode(
    available: Ingredient[], 
    count: number, 
    mode: ModeConfig, 
    filters: GenerationFilters
  ): Ingredient[] {
    const selected: Ingredient[] = [];
    
    // Группируем по категориям
    const byCategory = available.reduce((acc, ing) => {
      if (!acc[ing.category]) acc[ing.category] = [];
      acc[ing.category].push(ing);
      return acc;
    }, {} as Record<string, Ingredient[]>);

    // Специальная логика для безалкогольных коктейлей - гарантируем разнообразие
    if (mode.name === 'Безалкогольный') {
      const minCategories = 3; // Минимум 3 разных категории
      const targetCategories = ['juice', 'fruit', 'syrup', 'soda', 'mixer'];
      const usedCategories: Set<string> = new Set();
      
      // Перемешиваем целевые категории для разнообразия
      const shuffledCategories = [...targetCategories].sort(() => Math.random() - 0.5);
      
      // Сначала добавляем по одному ингредиенту из каждой категории
      for (const cat of shuffledCategories) {
        if (selected.length >= count) break;
        
        const categoryItems = (byCategory[cat] || []).filter(ing => !selected.includes(ing));
        if (categoryItems.length > 0) {
          const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
          selected.push(randomItem);
          usedCategories.add(cat);
        }
        
        // Остановимся, когда набрали минимум категорий
        if (usedCategories.size >= minCategories && selected.length >= 3) break;
      }
      
      // Дополняем до нужного количества
      while (selected.length < count) {
        const randomCat = shuffledCategories[Math.floor(Math.random() * shuffledCategories.length)];
        const categoryItems = (byCategory[randomCat] || []).filter(ing => !selected.includes(ing));
        if (categoryItems.length > 0) {
          const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
          selected.push(randomItem);
        } else {
          break; // Нет больше ингредиентов
        }
      }
      
      return selected;
    }

    // 1. Добавляем обязательные категории режима
    for (const reqCat of mode.requiredCategories) {
      const categoryItems = byCategory[reqCat] || [];
      if (categoryItems.length > 0) {
        const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
        if (!selected.includes(randomItem)) {
          selected.push(randomItem);
        }
      }
    }

    // 2. Добавляем обязательные ингредиенты из фильтров
    if (filters.requiredIngredients) {
      for (const reqId of filters.requiredIngredients) {
        const ing = available.find(i => i.id === reqId);
        if (ing && !selected.includes(ing)) {
          selected.push(ing);
        }
      }
    }

    // 3. Добавляем обязательные категории из фильтров
    if (filters.requiredCategories) {
      for (const reqCat of filters.requiredCategories) {
        if (!selected.some(s => s.category === reqCat)) {
          const categoryItems = byCategory[reqCat] || [];
          if (categoryItems.length > 0) {
            const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
            if (!selected.includes(randomItem)) {
              selected.push(randomItem);
            }
          }
        }
      }
    }

    // 4. Заполняем оставшиеся слоты предпочитаемыми категориями
    const preferredCats = filters.preferredCategories?.length 
      ? filters.preferredCategories 
      : mode.preferredCategories;

    for (const prefCat of preferredCats) {
      if (selected.length >= count) break;
      
      const categoryItems = (byCategory[prefCat] || [])
        .filter(ing => !selected.includes(ing));
      
      if (categoryItems.length > 0) {
        // Проверяем совместимость с уже выбранными
        const compatibleItems = categoryItems.filter(ing => 
          this.isCompatibleWithSelected(ing, selected)
        );
        
        if (compatibleItems.length > 0) {
          const randomItem = compatibleItems[Math.floor(Math.random() * compatibleItems.length)];
          selected.push(randomItem);
        }
      }
    }

    // 5. Дополняем случайными совместимыми ингредиентами
    const remainingItems = available.filter(ing => 
      !selected.includes(ing) && this.isCompatibleWithSelected(ing, selected)
    );

    while (selected.length < count && remainingItems.length > 0) {
      const idx = Math.floor(Math.random() * remainingItems.length);
      selected.push(remainingItems[idx]);
      remainingItems.splice(idx, 1);
    }

    return selected;
  }

  /**
   * Проверяет совместимость ингредиента с уже выбранными
   */
  private isCompatibleWithSelected(ingredient: Ingredient, selected: Ingredient[]): boolean {
    // Проверяем несовместимые комбинации
    for (const [group1, group2] of INCOMPATIBLE_COMBINATIONS) {
      const ingInGroup1 = group1.includes(ingredient.subtype || '') || group1.includes(ingredient.category);
      
      for (const sel of selected) {
        const selInGroup2 = group2.includes(sel.subtype || '') || group2.includes(sel.category);
        const selInGroup1 = group1.includes(sel.subtype || '') || group1.includes(sel.category);
        const ingInGroup2 = group2.includes(ingredient.subtype || '') || group2.includes(ingredient.category);
        
        if ((ingInGroup1 && selInGroup2) || (ingInGroup2 && selInGroup1)) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Валидирует рецепт на соответствие режиму
   */
  private validateRecipeForMode(recipe: GeneratedRecipe, mode: ModeConfig, filters: GenerationFilters): boolean {
    // Проверяем крепость
    if (recipe.totalAbv < mode.allowedAbvRange[0] || recipe.totalAbv > mode.allowedAbvRange[1]) {
      // Для строгих режимов это критично
      if (mode.strictness === 'strict') {
        return false;
      }
    }

    // Проверяем пользовательские ограничения
    if (filters.maxAlcoholContent && recipe.totalAbv > filters.maxAlcoholContent) {
      return false;
    }
    if (filters.minAlcoholContent && recipe.totalAbv < filters.minAlcoholContent) {
      return false;
    }
    if (filters.maxPrice && recipe.totalCost > filters.maxPrice) {
      return false;
    }

    // Проверяем наличие обязательных категорий
    for (const reqCat of mode.requiredCategories) {
      if (!recipe.ingredients.some(item => item.ingredient.category === reqCat)) {
        return false;
      }
    }

    // Проверяем пользовательские обязательные категории
    if (filters.requiredCategories) {
      for (const reqCat of filters.requiredCategories) {
        if (!recipe.ingredients.some(item => item.ingredient.category === reqCat)) {
          return false;
        }
      }
    }

    // Проверяем пользовательские обязательные ингредиенты
    if (filters.requiredIngredients) {
      for (const reqId of filters.requiredIngredients) {
        if (!recipe.ingredients.some(item => item.ingredient.id === reqId)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Рассчитывает пропорции ингредиентов
   */
  private calculateProportions(ingredients: Ingredient[], targetVolume: number, mode: ModeConfig) {
    const roundTo5 = (value: number, min: number = 5): number => {
      return Math.max(min, Math.round(value / 5) * 5);
    };

    // Определяем базовые пропорции по категориям
    const recipeIngredients = ingredients.map((ingredient, index) => {
      let baseAmount: number;
      const [minAlcRatio, maxAlcRatio] = mode.alcoholRatio;
      const avgAlcRatio = (minAlcRatio + maxAlcRatio) / 2;
      
      switch (ingredient.category) {
        case 'alcohol':
          // Для безалкогольного режима
          if (mode.allowedAlcoholSubtypes.length === 0) {
            baseAmount = 0;
          } else {
            baseAmount = targetVolume * avgAlcRatio;
          }
          break;
        case 'juice':
          baseAmount = targetVolume * (1 - avgAlcRatio) * 0.6;
          break;
        case 'syrup':
          baseAmount = targetVolume * 0.08; // 8% для сиропов
          break;
        case 'soda':
        case 'mixer':
          baseAmount = targetVolume * 0.25;
          break;
        case 'energy_drink':
          baseAmount = targetVolume * 0.3;
          break;
        case 'bitter':
          baseAmount = 5; // Фиксированно
          break;
        case 'fruit':
          baseAmount = 30; // 30 грамм
          break;
        case 'garnish':
          baseAmount = 1; // 1 штука
          break;
        default:
          baseAmount = targetVolume * 0.15;
      }

      // Добавляем вариацию ±20%
      const variation = 0.8 + Math.random() * 0.4;
      const amount = baseAmount * variation;

      return {
        ingredient,
        amount: ingredient.unit === 'piece' ? 1 : amount,
        unit: ingredient.category === 'fruit' ? 'g' : ingredient.unit,
        order: index + 1
      };
    });

    // Округляем и нормализуем
    recipeIngredients.forEach(item => {
      if (item.unit !== 'piece') {
        const minVal = item.ingredient.category === 'fruit' ? 20 : 5;
        item.amount = roundTo5(item.amount, minVal);
      }
    });

    // Нормализуем к целевому объёму
    const currentVolume = recipeIngredients
      .filter(item => item.unit !== 'piece')
      .reduce((sum, item) => sum + item.amount, 0);
    
    if (currentVolume > 0 && currentVolume !== targetVolume) {
      const scale = targetVolume / currentVolume;
      recipeIngredients.forEach(item => {
        if (item.unit !== 'piece') {
          const minVal = item.ingredient.category === 'fruit' ? 20 : 5;
          item.amount = roundTo5(item.amount * scale, minVal);
        }
      });
    }

    return recipeIngredients;
  }

  /**
   * Рассчитывает вкусовой баланс
   */
  private calculateTasteBalance(ingredients: any[], totalVolume: number) {
    if (totalVolume === 0) {
      return { sweet: 5, sour: 5, bitter: 5, alcohol: 0 };
    }

    let sweet = 0, sour = 0, bitter = 0, alcohol = 0;

    ingredients.forEach(item => {
      if (item.unit === 'piece') return;
      
      const ratio = item.amount / totalVolume;
      const profile = item.ingredient.tasteProfile || { sweet: 0, sour: 0, bitter: 0, alcohol: 0 };
      
      sweet += (profile.sweet || 0) * ratio;
      sour += (profile.sour || 0) * ratio;
      bitter += (profile.bitter || 0) * ratio;
      alcohol += (profile.alcohol || 0) * ratio;
    });

    return {
      sweet: Math.min(10, Math.round(sweet)),
      sour: Math.min(10, Math.round(sour)),
      bitter: Math.min(10, Math.round(bitter)),
      alcohol: Math.min(10, Math.round(alcohol))
    };
  }

  /**
   * Рассчитывает соответствие фильтрам
   */
  private calculateMatchScore(
    recipe: any, 
    mode: ModeConfig, 
    filters: GenerationFilters
  ): number {
    let score = 50;

    // Соответствие крепости режиму (+20)
    const [minAbv, maxAbv] = mode.allowedAbvRange;
    if (recipe.totalAbv >= minAbv && recipe.totalAbv <= maxAbv) {
      score += 20;
    } else {
      const deviation = Math.min(
        Math.abs(recipe.totalAbv - minAbv),
        Math.abs(recipe.totalAbv - maxAbv)
      );
      score -= Math.min(20, deviation);
    }

    // Соответствие вкусовым предпочтениям (+20)
    if (filters.tastePreferences) {
      const prefs = filters.tastePreferences;
      ['sweet', 'sour', 'bitter', 'alcohol'].forEach(taste => {
        const pref = prefs[taste as keyof typeof prefs];
        if (pref !== undefined) {
          const diff = Math.abs(recipe.tasteBalance[taste] - pref);
          score += Math.max(0, 5 - diff);
        }
      });
    }

    // Соответствие цене (+10)
    if (filters.maxPrice) {
      if (recipe.totalCost <= filters.maxPrice * 0.7) {
        score += 10;
      } else if (recipe.totalCost <= filters.maxPrice) {
        score += 5;
      }
    }

    // Наличие всех обязательных ингредиентов (+10)
    if (filters.requiredIngredients) {
      const hasAll = filters.requiredIngredients.every(reqId =>
        recipe.ingredients.some((item: any) => item.ingredient.id === reqId)
      );
      if (hasAll) score += 10;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Генерирует название коктейля
   */
  private generateName(ingredients: Ingredient[], mode: ModeConfig): string {
    const adjectives = {
      classic: ['Золотой', 'Рубиновый', 'Изумрудный', 'Королевский', 'Бархатный'],
      crazy: ['Дикий', 'Яркий', 'Безумный', 'Огненный', 'Взрывной'],
      summer: ['Летний', 'Тропический', 'Солнечный', 'Свежий', 'Морской'],
      nonalcoholic: ['Сладкий', 'Фруктовый', 'Ягодный', 'Освежающий', 'Нежный'],
      shot: ['Крепкий', 'Жгучий', 'Острый', 'Пылающий', 'Резкий'],
      wine_cocktail: ['Виноградный', 'Бархатный', 'Розовый', 'Игристый', 'Элегантный'],
      beer_cocktail: ['Хмельной', 'Солодовый', 'Пенный', 'Янтарный', 'Светлый'],
      energy: ['Энергичный', 'Бодрящий', 'Заряжающий', 'Молниеносный', 'Пульсирующий']
    };

    const nouns = {
      classic: ['Закат', 'Вечер', 'Момент', 'Бриз', 'Сон'],
      crazy: ['Шторм', 'Взрыв', 'Вихрь', 'Хаос', 'Буря'],
      summer: ['Пляж', 'Бриз', 'Волна', 'Рассвет', 'Прибой'],
      nonalcoholic: ['Мечта', 'Радуга', 'Облако', 'Нектар', 'Роса'],
      shot: ['Удар', 'Выстрел', 'Вспышка', 'Молния', 'Гром'],
      wine_cocktail: ['Закат', 'Сад', 'Долина', 'Виноградник', 'Бокал'],
      beer_cocktail: ['Кружка', 'Пена', 'Вечер', 'Бочка', 'Погреб'],
      energy: ['Заряд', 'Импульс', 'Толчок', 'Старт', 'Рывок']
    };

    const modeKey = mode.name.toLowerCase().includes('безалкогольный') ? 'nonalcoholic' 
      : mode.name.toLowerCase().includes('летний') ? 'summer'
      : mode.name.toLowerCase().includes('сумасшедший') ? 'crazy'
      : mode.name.toLowerCase().includes('шот') ? 'shot'
      : mode.name.toLowerCase().includes('винный') ? 'wine_cocktail'
      : mode.name.toLowerCase().includes('пивной') ? 'beer_cocktail'
      : mode.name.toLowerCase().includes('энергетический') ? 'energy'
      : 'classic';

    const adj = adjectives[modeKey as keyof typeof adjectives] || adjectives.classic;
    const noun = nouns[modeKey as keyof typeof nouns] || nouns.classic;

    return `${adj[Math.floor(Math.random() * adj.length)]} ${noun[Math.floor(Math.random() * noun.length)]}`;
  }

  /**
   * Генерирует описание коктейля
   */
  private generateDescription(ingredients: Ingredient[], mode: ModeConfig): string {
    const mainIngredients = ingredients.slice(0, 3).map(ing => ing.name).join(', ');
    return `${mode.description}. Основные ингредиенты: ${mainIngredients}.`;
  }

  /**
   * Определяет сложность рецепта
   */
  private calculateDifficulty(ingredientCount: number): string {
    if (ingredientCount <= 3) return 'easy';
    if (ingredientCount <= 5) return 'medium';
    return 'hard';
  }
}

// ===============================================
// ЭКСПОРТ
// ===============================================

export function generateEnhancedRecipe(
  ingredients: Ingredient[], 
  glassTypes: GlassType[], 
  mode: string,
  filters?: Partial<GenerationFilters>
): GeneratedRecipe {
  const generator = new EnhancedCocktailGenerator(ingredients, glassTypes);
  
  const generationFilters: GenerationFilters = {
    mode,
    ...filters
  };

  return generator.generateCocktail(generationFilters);
}

// Экспорт конфигурации режимов для использования на фронтенде
export const AVAILABLE_MODES = Object.entries(GENERATION_MODES).map(([id, config]) => ({
  id,
  name: config.name,
  description: config.description,
  allowedAbvRange: config.allowedAbvRange
}));

export { GENERATION_MODES, ALCOHOL_SUBTYPES, ALL_CATEGORIES };
