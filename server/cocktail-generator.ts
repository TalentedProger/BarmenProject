import type { Ingredient, GlassType } from '@shared/schema';

// Интерфейсы для генератора
export interface GenerationFilters {
  mode: string;
  requiredIngredients?: number[]; // ID ингредиентов, которые должны быть в рецепте
  requiredCategories?: string[]; // Категории, из которых должен быть хотя бы один ингредиент
  maxAlcoholContent?: number; // Максимальная крепость (%)
  minAlcoholContent?: number; // Минимальная крепость (%)
  maxPrice?: number; // Максимальная стоимость (руб)
  preferredCategories?: string[]; // Предпочитаемые категории ингредиентов
  glassType?: string; // Предпочитаемый тип стакана
  complexity?: 'simple' | 'medium' | 'complex'; // Сложность рецепта
  tastePreferences?: {
    sweet?: number; // 0-10
    sour?: number; // 0-10
    bitter?: number; // 0-10
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
  matchScore: number; // Насколько хорошо рецепт соответствует фильтрам (0-100)
}

// Конфигурация режимов генерации
const GENERATION_MODES = {
  classic: {
    name: 'Классический',
    alcoholRatio: [0.4, 0.7], // 40-70% алкоголя
    ingredientCount: [3, 5],
    preferredCategories: ['alcohol', 'juice', 'syrup'],
    tasteBalance: { sweet: 5, sour: 4, bitter: 3, alcohol: 6 },
    glassTypes: ['old-fashioned', 'martini', 'rocks', 'coupe']
  },
  crazy: {
    name: 'Сумасшедший',
    alcoholRatio: [0.3, 0.8],
    ingredientCount: [4, 7],
    preferredCategories: ['alcohol', 'juice', 'syrup', 'bitter', 'mixer'],
    tasteBalance: { sweet: 6, sour: 6, bitter: 5, alcohol: 7 },
    glassTypes: ['highball', 'hurricane', 'margarita']
  },
  summer: {
    name: 'Летний',
    alcoholRatio: [0.2, 0.5],
    ingredientCount: [3, 6],
    preferredCategories: ['alcohol', 'juice', 'fruit', 'mixer'],
    tasteBalance: { sweet: 7, sour: 6, bitter: 2, alcohol: 4 },
    glassTypes: ['highball', 'hurricane', 'wine', 'beer']
  },
  nonalcoholic: {
    name: 'Безалкогольный',
    alcoholRatio: [0, 0],
    ingredientCount: [2, 5],
    preferredCategories: ['juice', 'syrup', 'fruit', 'mixer'],
    tasteBalance: { sweet: 6, sour: 5, bitter: 1, alcohol: 0 },
    glassTypes: ['highball', 'wine', 'old-fashioned']
  },
  shot: {
    name: 'Шот',
    alcoholRatio: [0.7, 1.0],
    ingredientCount: [2, 3],
    preferredCategories: ['alcohol', 'syrup'],
    tasteBalance: { sweet: 4, sour: 2, bitter: 3, alcohol: 9 },
    glassTypes: ['shot']
  }
};

// Совместимость ингредиентов (упрощенная система)
const INGREDIENT_COMPATIBILITY = {
  // Водка хорошо сочетается с соками и сиропами
  vodka: ['juice', 'syrup', 'mixer'],
  // Виски - с биттерами и сиропами
  whiskey: ['bitter', 'syrup', 'fruit'],
  // Джин - с тоником и цитрусовыми
  gin: ['mixer', 'juice', 'bitter'],
  // Ром - с фруктами и соками
  rum: ['fruit', 'juice', 'syrup'],
  // Текила - с лаймом и солью
  tequila: ['fruit', 'juice', 'syrup'],
  // Ликёры - универсальны
  liqueur: ['juice', 'mixer', 'fruit'],
  // Вино - с фруктами
  wine: ['fruit', 'juice'],
  // Пиво - с лаймом
  beer: ['fruit', 'juice']
};

export class CocktailGenerator {
  private ingredients: Ingredient[];
  private glassTypes: GlassType[];

  constructor(ingredients: Ingredient[], glassTypes: GlassType[]) {
    this.ingredients = ingredients;
    this.glassTypes = glassTypes;
  }

  /**
   * Генерирует коктейль на основе фильтров
   */
  generateCocktail(filters: GenerationFilters): GeneratedRecipe {
    const mode = GENERATION_MODES[filters.mode as keyof typeof GENERATION_MODES] || GENERATION_MODES.classic;
    
    // Фильтруем доступные ингредиенты
    const availableIngredients = this.filterIngredients(filters);
    
    if (availableIngredients.length === 0) {
      throw new Error('Недостаточно ингредиентов для создания коктейля с заданными фильтрами');
    }

    // Выбираем стакан
    const glass = this.selectGlass(filters, mode);
    
    // Генерируем несколько вариантов и выбираем лучший
    const candidates: GeneratedRecipe[] = [];
    
    for (let i = 0; i < 10; i++) {
      try {
        const recipe = this.generateSingleRecipe(availableIngredients, glass, mode, filters);
        candidates.push(recipe);
      } catch (error) {
        // Пропускаем неудачные попытки
        continue;
      }
    }

    if (candidates.length === 0) {
      throw new Error('Не удалось сгенерировать подходящий рецепт');
    }

    // Сортируем по соответствию фильтрам и возвращаем лучший
    candidates.sort((a, b) => b.matchScore - a.matchScore);
    return candidates[0];
  }

  /**
   * Фильтрует ингредиенты по заданным критериям
   * requiredCategories и requiredIngredients НЕ ограничивают выбор,
   * а только гарантируют попадание в рецепт
   */
  private filterIngredients(filters: GenerationFilters): Ingredient[] {
    return this.ingredients.filter(ingredient => {
      // Проверяем предпочитаемые категории (если указаны)
      // Обязательные категории/ингредиенты не ограничивают выбор
      if (filters.preferredCategories && filters.preferredCategories.length > 0) {
        // Если ингредиент из requiredCategories или requiredIngredients, пропускаем
        if (filters.requiredCategories?.includes(ingredient.category) || 
            filters.requiredIngredients?.includes(ingredient.id)) {
          return true;
        }
        
        // Иначе проверяем предпочитаемые категории
        if (!filters.preferredCategories.includes(ingredient.category)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Выбирает подходящий стакан
   */
  private selectGlass(filters: GenerationFilters, mode: any): GlassType {
    let availableGlasses = this.glassTypes;

    // Фильтруем по предпочитаемому типу стакана (игнорируем 'any')
    if (filters.glassType && filters.glassType !== 'any') {
      const preferred = availableGlasses.find(g => g.shape === filters.glassType);
      if (preferred) return preferred;
    }

    // Фильтруем по режиму
    availableGlasses = availableGlasses.filter(g => 
      mode.glassTypes.includes(g.shape)
    );

    if (availableGlasses.length === 0) {
      availableGlasses = this.glassTypes;
    }

    return availableGlasses[Math.floor(Math.random() * availableGlasses.length)];
  }

  /**
   * Генерирует один рецепт
   */
  private generateSingleRecipe(
    availableIngredients: Ingredient[], 
    glass: GlassType, 
    mode: any, 
    filters: GenerationFilters
  ): GeneratedRecipe {
    const targetVolume = glass.capacity; // 100% от объема стакана
    const ingredientCount = mode.ingredientCount[0] + 
      Math.floor(Math.random() * (mode.ingredientCount[1] - mode.ingredientCount[0] + 1));

    // Обязательные ингредиенты
    const requiredIngredients = filters.requiredIngredients 
      ? availableIngredients.filter(ing => filters.requiredIngredients!.includes(ing.id))
      : [];

    // Добавляем по одному ингредиенту из каждой обязательной категории
    const requiredFromCategories: Ingredient[] = [];
    if (filters.requiredCategories && filters.requiredCategories.length > 0) {
      for (const category of filters.requiredCategories) {
        const categoryIngredients = availableIngredients.filter(ing => 
          ing.category === category && !requiredIngredients.includes(ing)
        );
        if (categoryIngredients.length > 0) {
          // Выбираем случайный ингредиент из категории
          const randomIng = categoryIngredients[Math.floor(Math.random() * categoryIngredients.length)];
          requiredFromCategories.push(randomIng);
        }
      }
    }

    // Объединяем обязательные ингредиенты
    const allRequired = [...requiredIngredients, ...requiredFromCategories];

    // Выбираем основные ингредиенты
    const selectedIngredients = this.selectIngredients(
      availableIngredients, 
      ingredientCount, 
      mode, 
      allRequired
    );

    // Рассчитываем пропорции
    const recipeIngredients = this.calculateProportions(selectedIngredients, targetVolume, mode);

    // Рассчитываем характеристики
    const totalVolume = recipeIngredients.reduce((sum, item) => sum + item.amount, 0);
    const totalAlcohol = recipeIngredients.reduce((sum, item) => {
      return sum + (item.amount * (parseFloat(item.ingredient.abv.toString()) / 100));
    }, 0);
    const totalAbv = totalVolume > 0 ? (totalAlcohol / totalVolume) * 100 : 0;
    const totalCost = recipeIngredients.reduce((sum, item) => {
      return sum + (item.amount / 1000) * parseFloat(item.ingredient.pricePerLiter.toString());
    }, 0);

    // Рассчитываем вкусовой баланс
    const tasteBalance = this.calculateTasteBalance(recipeIngredients);

    // Оценка соответствия фильтрам
    const matchScore = this.calculateMatchScore(
      { totalAbv, totalCost, tasteBalance, ingredients: recipeIngredients },
      filters
    );

    // Проверяем ограничения
    if (filters.maxAlcoholContent && totalAbv > filters.maxAlcoholContent) {
      throw new Error('Превышена максимальная крепость');
    }
    if (filters.minAlcoholContent && totalAbv < filters.minAlcoholContent) {
      throw new Error('Недостаточная крепость');
    }
    if (filters.maxPrice && totalCost > filters.maxPrice) {
      throw new Error('Превышена максимальная стоимость');
    }

    // Проверяем наличие всех обязательных категорий
    if (filters.requiredCategories && filters.requiredCategories.length > 0) {
      const hasAllCategories = filters.requiredCategories.every(reqCat =>
        recipeIngredients.some(item => item.ingredient.category === reqCat)
      );
      if (!hasAllCategories) {
        throw new Error('Не все обязательные категории представлены в рецепте');
      }
    }

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
   * Выбирает ингредиенты для рецепта с балансом категорий
   */
  private selectIngredients(
    available: Ingredient[], 
    count: number, 
    mode: any, 
    required: Ingredient[]
  ): Ingredient[] {
    // Обязательные ингредиенты всегда включаются
    const selected = [...required];
    const remaining = available.filter(ing => !selected.includes(ing));
    
    // Если обязательных ингредиентов больше или равно нужному количеству, возвращаем их
    if (selected.length >= count) {
      return selected;
    }
    
    // Считаем текущее количество ингредиентов по категориям
    const getCategoryCount = (category: string): number => {
      return selected.filter(ing => ing.category === category).length;
    };
    
    // Ограничение: максимум 2 ингредиента из одной категории (кроме базовых: alcohol, juice, mixer)
    const getMaxPerCategory = (category: string): number => {
      if (['alcohol', 'juice', 'mixer'].includes(category)) {
        return 2; // Для базовых категорий максимум 2
      }
      return 1; // Для остальных максимум 1
    };
    
    // Группируем оставшиеся по категориям
    const byCategory = remaining.reduce((acc, ing) => {
      if (!acc[ing.category]) acc[ing.category] = [];
      acc[ing.category].push(ing);
      return acc;
    }, {} as Record<string, Ingredient[]>);

    // Добавляем ингредиенты по приоритету категорий с учетом лимита
    for (const category of mode.preferredCategories) {
      if (selected.length >= count) break;
      
      const categoryCount = getCategoryCount(category);
      const maxForCategory = getMaxPerCategory(category);
      
      // Пропускаем категорию если достигнут лимит
      if (categoryCount >= maxForCategory) continue;
      
      const categoryIngredients = byCategory[category] || [];
      if (categoryIngredients.length > 0) {
        // Добавляем только если не превышен лимит
        const availableSlots = maxForCategory - categoryCount;
        for (let i = 0; i < availableSlots && selected.length < count; i++) {
          const randomIng = categoryIngredients[Math.floor(Math.random() * categoryIngredients.length)];
          if (!selected.includes(randomIng)) {
            selected.push(randomIng);
          }
        }
      }
    }

    // Дополняем случайными ингредиентами если нужно, соблюдая лимиты
    const maxAttempts = remaining.length * 3;
    let attempts = 0;
    while (selected.length < count && attempts < maxAttempts) {
      const randomIng = remaining[Math.floor(Math.random() * remaining.length)];
      
      // Проверяем лимит для категории этого ингредиента
      const categoryCount = getCategoryCount(randomIng.category);
      const maxForCategory = getMaxPerCategory(randomIng.category);
      
      if (!selected.includes(randomIng) && categoryCount < maxForCategory) {
        selected.push(randomIng);
      }
      attempts++;
    }

    return selected;
  }

  /**
   * Рассчитывает пропорции ингредиентов
   */
  private calculateProportions(ingredients: Ingredient[], targetVolume: number, mode: any) {
    // Функция округления до кратного 5
    const roundToMultipleOf5 = (value: number, minValue: number = 5): number => {
      return Math.max(minValue, Math.round(value / 5) * 5);
    };

    // Шаг 1: Определяем базовые пропорции
    const recipeIngredients = ingredients.map((ingredient, index) => {
      let baseAmount: number;
      
      // Определяем базовое количество в зависимости от категории
      switch (ingredient.category) {
        case 'alcohol':
          baseAmount = targetVolume * 0.3; // 30% от объема для алкоголя
          break;
        case 'juice':
          baseAmount = targetVolume * 0.4; // 40% для соков
          break;
        case 'syrup':
          baseAmount = targetVolume * 0.1; // 10% для сиропов
          break;
        case 'mixer':
          baseAmount = targetVolume * 0.3; // 30% для миксеров
          break;
        case 'bitter':
          baseAmount = 5; // Фиксированное количество для биттеров
          break;
        case 'fruit':
          baseAmount = 50; // 50 граммов для фруктов (минимум 20г)
          break;
        case 'garnish':
          baseAmount = 1; // 1 штука для декора
          break;
        default:
          baseAmount = targetVolume * 0.2;
      }

      // Добавляем случайность ±30%
      const variation = 0.7 + Math.random() * 0.6; // 0.7 - 1.3
      const amount = baseAmount * variation;

      return {
        ingredient,
        amount: ingredient.unit === 'piece' ? 1 : amount,
        unit: ingredient.unit,
        order: index + 1
      };
    });

    // Шаг 2: Округляем все объемы до кратных 5 (кроме штучных)
    recipeIngredients.forEach(item => {
      if (item.unit !== 'piece') {
        // Для фруктов минимум 20г
        const minValue = item.ingredient.category === 'fruit' ? 20 : 5;
        item.amount = roundToMultipleOf5(item.amount, minValue);
      }
    });

    // Шаг 3: Нормализуем к целевому объему
    const currentVolume = recipeIngredients
      .filter(item => item.unit !== 'piece')
      .reduce((sum, item) => sum + item.amount, 0);
    
    // Масштабируем пропорционально
    if (currentVolume !== targetVolume) {
      const scale = targetVolume / currentVolume;
      recipeIngredients.forEach(item => {
        if (item.unit !== 'piece') {
          const minValue = item.ingredient.category === 'fruit' ? 20 : 5;
          item.amount = roundToMultipleOf5(item.amount * scale, minValue);
        }
      });
    }

    // Шаг 4: Точная корректировка до целевого объема
    const finalVolume = recipeIngredients
      .filter(item => item.unit !== 'piece')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const difference = targetVolume - finalVolume;
    
    if (difference !== 0) {
      // Находим самый большой ингредиент для корректировки
      const liquidIngredients = recipeIngredients.filter(item => item.unit !== 'piece');
      if (liquidIngredients.length > 0) {
        liquidIngredients.sort((a, b) => b.amount - a.amount);
        const largestIngredient = liquidIngredients[0];
        
        // Корректируем с сохранением кратности 5
        const newAmount = largestIngredient.amount + difference;
        const minValue = largestIngredient.ingredient.category === 'fruit' ? 20 : 5;
        largestIngredient.amount = roundToMultipleOf5(newAmount, minValue);
        
        // Если после округления еще есть разница, добавляем/вычитаем кратно 5
        const finalCheck = recipeIngredients
          .filter(item => item.unit !== 'piece')
          .reduce((sum, item) => sum + item.amount, 0);
        
        if (finalCheck !== targetVolume) {
          const remainingDiff = targetVolume - finalCheck;
          const minValueFinal = largestIngredient.ingredient.category === 'fruit' ? 20 : 5;
          largestIngredient.amount = Math.max(minValueFinal, largestIngredient.amount + Math.round(remainingDiff / 5) * 5);
        }
      }
    }

    return recipeIngredients;
  }

  /**
   * Рассчитывает вкусовой баланс
   */
  private calculateTasteBalance(ingredients: any[]) {
    const totalVolume = ingredients
      .filter(item => item.unit !== 'piece')
      .reduce((sum, item) => sum + item.amount, 0);

    if (totalVolume === 0) {
      return { sweet: 5, sour: 5, bitter: 5, alcohol: 0 };
    }

    let sweet = 0, sour = 0, bitter = 0, alcohol = 0;

    ingredients.forEach(item => {
      if (item.unit === 'piece') return;
      
      const ratio = item.amount / totalVolume;
      const profile = item.ingredient.tasteProfile;
      
      sweet += profile.sweet * ratio;
      sour += profile.sour * ratio;
      bitter += profile.bitter * ratio;
      alcohol += profile.alcohol * ratio;
    });

    return {
      sweet: Math.round(sweet),
      sour: Math.round(sour),
      bitter: Math.round(bitter),
      alcohol: Math.round(alcohol)
    };
  }

  /**
   * Рассчитывает соответствие фильтрам (0-100)
   */
  private calculateMatchScore(recipe: any, filters: GenerationFilters): number {
    let score = 50; // Базовый балл

    // Проверяем вкусовые предпочтения
    if (filters.tastePreferences) {
      const prefs = filters.tastePreferences;
      const balance = recipe.tasteBalance;
      
      ['sweet', 'sour', 'bitter', 'alcohol'].forEach(taste => {
        if (prefs[taste as keyof typeof prefs] !== undefined) {
          const diff = Math.abs(balance[taste] - prefs[taste as keyof typeof prefs]!);
          score += Math.max(0, 10 - diff); // +0 до +10 баллов
        }
      });
    }

    // Проверяем ценовые ограничения
    if (filters.maxPrice) {
      const priceRatio = recipe.totalCost / filters.maxPrice;
      if (priceRatio <= 0.8) score += 10; // Значительно дешевле
      else if (priceRatio <= 1.0) score += 5; // В рамках бюджета
    }

    // Проверяем крепость
    if (filters.maxAlcoholContent) {
      const alcoholRatio = recipe.totalAbv / filters.maxAlcoholContent;
      if (alcoholRatio <= 0.8) score += 5;
      else if (alcoholRatio <= 1.0) score += 2;
    }

    // Проверяем обязательные ингредиенты
    if (filters.requiredIngredients && filters.requiredIngredients.length > 0) {
      const hasAllRequired = filters.requiredIngredients.every(reqId =>
        recipe.ingredients.some((item: any) => item.ingredient.id === reqId)
      );
      if (hasAllRequired) score += 20;
    }

    // Проверяем обязательные категории
    if (filters.requiredCategories && filters.requiredCategories.length > 0) {
      const hasAllRequiredCategories = filters.requiredCategories.every(reqCat =>
        recipe.ingredients.some((item: any) => item.ingredient.category === reqCat)
      );
      if (hasAllRequiredCategories) score += 20;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Генерирует название коктейля (максимум 2 слова с правильным склонением)
   */
  private generateName(ingredients: Ingredient[], mode: any): string {
    // Названия разбиты по родам для правильного склонения
    const masculineNames = [
      // Прилагательное (м.р.) + Существительное (м.р.)
      ['Рубиновый', 'Закат'], ['Золотой', 'Вихрь'], ['Небесный', 'Прилив'],
      ['Изумрудный', 'Туман'], ['Королевский', 'Бриз'], ['Бархатный', 'Огонь'],
      ['Тёмный', 'Рассвет'], ['Лунный', 'Шторм'], ['Морской', 'Прибой'],
      ['Дерзкий', 'Полёт'], ['Яркий', 'Взрыв'], ['Синий', 'Вечер'],
      ['Тропический', 'Пляж'], ['Дикий', 'Ветер'], ['Жгучий', 'Град'],
      ['Алый', 'Горизонт'], ['Медный', 'Поцелуй'], ['Пурпурный', 'Шёпот'],
      ['Серебряный', 'Поток'], ['Янтарный', 'Мир'], ['Хрустальный', 'Блеск'],
      ['Бирюзовый', 'Всплеск'], ['Коралловый', 'Риф'], ['Сапфировый', 'Вздох'],
      ['Нефритовый', 'Поток'], ['Опаловый', 'Свет'], ['Аметистовый', 'Путь'],
      ['Малиновый', 'Трепет'], ['Лиловый', 'Флёр'], ['Перламутровый', 'Шанс']
    ];

    const feminineNames = [
      // Прилагательное (ж.р.) + Существительное (ж.р.)
      ['Золотая', 'Мечта'], ['Летняя', 'Ночь'], ['Розовая', 'Дымка'],
      ['Белая', 'Волна'], ['Синяя', 'Лагуна'], ['Красная', 'Страсть'],
      ['Бархатная', 'Роза'], ['Изумрудная', 'Тайна'], ['Солнечная', 'Искра'],
      ['Небесная', 'Высота'], ['Тёмная', 'Магия'], ['Яркая', 'Звезда'],
      ['Дикая', 'Свобода'], ['Сладкая', 'Гроза'], ['Жгучая', 'Молния'],
      ['Алая', 'Заря'], ['Медная', 'Ласка'], ['Пурпурная', 'Вуаль'],
      ['Серебряная', 'Капля'], ['Янтарная', 'Нота'], ['Хрустальная', 'Тишь'],
      ['Бирюзовая', 'Рябь'], ['Коралловая', 'Пена'], ['Сапфировая', 'Грань'],
      ['Нефритовая', 'Слеза'], ['Опаловая', 'Тень'], ['Аметистовая', 'Грёза'],
      ['Малиновая', 'Дрожь'], ['Лиловая', 'Печаль'], ['Перламутровая', 'Греза']
    ];

    const neutralNames = [
      // Прилагательное (ср.р.) + Существительное (ср.р.)
      ['Золотое', 'Сияние'], ['Летнее', 'Блаженство'], ['Морское', 'Чудо'],
      ['Яркое', 'Утро'], ['Тёмное', 'Наслаждение'], ['Розовое', 'Облако'],
      ['Синее', 'Небо'], ['Изумрудное', 'Настроение'], ['Бархатное', 'Чувство'],
      ['Дикое', 'Сердце'], ['Тропическое', 'Солнце'], ['Огненное', 'Желание'],
      ['Алое', 'Зарево'], ['Медное', 'Дыхание'], ['Пурпурное', 'Эхо'],
      ['Серебряное', 'Кружево'], ['Янтарное', 'Мгновение'], ['Хрустальное', 'Прикосновение'],
      ['Бирюзовое', 'Созерцание'], ['Коралловое', 'Сплетение'], ['Сапфировое', 'Очарование'],
      ['Нефритовое', 'Дуновение'], ['Опаловое', 'Видение'], ['Аметистовое', 'Томление']
    ];

    // Объединяем все варианты
    const allNames = [...masculineNames, ...feminineNames, ...neutralNames];
    
    // Выбираем случайное название
    const randomName = allNames[Math.floor(Math.random() * allNames.length)];
    
    return `${randomName[0]} ${randomName[1]}`;
  }

  /**
   * Генерирует описание коктейля
   */
  private generateDescription(ingredients: Ingredient[], mode: any): string {
    const descriptions = {
      classic: 'Проверенный временем рецепт с гармоничным сочетанием вкусов',
      crazy: 'Экспериментальный коктейль для любителей необычных сочетаний',
      summer: 'Освежающий напиток, идеальный для жаркого дня',
      nonalcoholic: 'Безалкогольный напиток, полный вкуса и аромата',
      shot: 'Крепкий шот для настоящих ценителей'
    };

    const baseDescription = descriptions[mode.name.toLowerCase() as keyof typeof descriptions] || descriptions.classic;
    const mainIngredients = ingredients.slice(0, 3).map(ing => ing.name).join(', ');
    
    return `${baseDescription}. Основные ингредиенты: ${mainIngredients}.`;
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

// Экспорт функции для совместимости с существующим кодом
export function generateRandomRecipe(
  ingredients: Ingredient[], 
  glassTypes: GlassType[], 
  mode: string,
  filters?: Partial<GenerationFilters>
): GeneratedRecipe {
  const generator = new CocktailGenerator(ingredients, glassTypes);
  
  const generationFilters: GenerationFilters = {
    mode,
    ...filters
  };

  return generator.generateCocktail(generationFilters);
}
