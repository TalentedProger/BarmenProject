/**
 * Утилита для валидации Structured Data (Schema.org)
 * Проверяет наличие всех обязательных полей для Recipe
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: any;
}

/**
 * Обязательные поля для Schema.org Recipe по требованиям Google
 */
const REQUIRED_FIELDS = [
  'name',
  'image',
  'author',
  'datePublished',
  'description',
  'prepTime',
  'recipeIngredient',
  'recipeInstructions'
];

/**
 * Рекомендованные поля для Rich Results
 */
const RECOMMENDED_FIELDS = [
  'aggregateRating',
  'keywords',
  'nutrition',
  'recipeCategory',
  'recipeCuisine',
  'recipeYield',
  'cookTime',
  'totalTime'
];

/**
 * Валидирует structured data из JSON-LD на странице
 */
export function validateRecipeStructuredData(recipeId: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Находим script tag
  const scriptTag = document.getElementById(`recipe-structured-data-${recipeId}`);
  
  if (!scriptTag) {
    errors.push(`Script tag с ID "recipe-structured-data-${recipeId}" не найден`);
    return { isValid: false, errors, warnings };
  }
  
  // Парсим JSON
  let data;
  try {
    data = JSON.parse(scriptTag.textContent || '{}');
  } catch (e) {
    errors.push(`Невалидный JSON в structured data: ${e}`);
    return { isValid: false, errors, warnings };
  }
  
  // Проверяем @context и @type
  if (data['@context'] !== 'https://schema.org') {
    errors.push('Отсутствует или неверный @context');
  }
  
  if (data['@type'] !== 'Recipe') {
    errors.push('Отсутствует или неверный @type (должен быть Recipe)');
  }
  
  // Проверяем обязательные поля
  REQUIRED_FIELDS.forEach(field => {
    if (!data[field]) {
      errors.push(`Отсутствует обязательное поле: ${field}`);
    } else if (Array.isArray(data[field]) && data[field].length === 0) {
      errors.push(`Поле ${field} пустое (пустой массив)`);
    } else if (typeof data[field] === 'string' && data[field].trim() === '') {
      errors.push(`Поле ${field} пустое (пустая строка)`);
    }
  });
  
  // Проверяем image детально
  if (data.image) {
    if (!Array.isArray(data.image)) {
      warnings.push('Поле image должно быть массивом');
    } else if (data.image.length === 0) {
      errors.push('Массив image пустой');
    } else {
      // Проверяем, что все URL валидные и абсолютные
      data.image.forEach((url: string, index: number) => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          errors.push(`image[${index}] не является абсолютным URL: ${url}`);
        }
      });
    }
  }
  
  // Проверяем recipeIngredient
  if (data.recipeIngredient) {
    if (!Array.isArray(data.recipeIngredient)) {
      errors.push('recipeIngredient должен быть массивом');
    } else if (data.recipeIngredient.length === 0) {
      errors.push('recipeIngredient пустой');
    }
  }
  
  // Проверяем recipeInstructions
  if (data.recipeInstructions) {
    if (!Array.isArray(data.recipeInstructions)) {
      errors.push('recipeInstructions должен быть массивом');
    } else if (data.recipeInstructions.length === 0) {
      errors.push('recipeInstructions пустой');
    } else {
      // Проверяем каждый шаг
      data.recipeInstructions.forEach((step: any, index: number) => {
        if (!step['@type'] || step['@type'] !== 'HowToStep') {
          warnings.push(`recipeInstructions[${index}] должен иметь @type: "HowToStep"`);
        }
        if (!step.text) {
          errors.push(`recipeInstructions[${index}] не имеет поля text`);
        }
      });
    }
  }
  
  // Проверяем aggregateRating если есть
  if (data.aggregateRating) {
    if (!data.aggregateRating.ratingValue) {
      errors.push('aggregateRating должен иметь ratingValue');
    }
    if (!data.aggregateRating.ratingCount) {
      errors.push('aggregateRating должен иметь ratingCount');
    }
  }
  
  // Проверяем рекомендованные поля
  RECOMMENDED_FIELDS.forEach(field => {
    if (!data[field]) {
      warnings.push(`Рекомендуется добавить поле: ${field}`);
    }
  });
  
  // Проверяем prepTime формат
  if (data.prepTime && !data.prepTime.match(/^PT\d+[HMS]$/)) {
    warnings.push(`prepTime должен быть в формате ISO 8601 (например: PT5M): ${data.prepTime}`);
  }
  
  const isValid = errors.length === 0;
  
  return {
    isValid,
    errors,
    warnings,
    data
  };
}

/**
 * Выводит результаты валидации в консоль
 */
export function logValidationResults(recipeId: string) {
  console.group(`🔍 Валидация Structured Data для рецепта ${recipeId}`);
  
  const result = validateRecipeStructuredData(recipeId);
  
  if (result.isValid) {
    console.log('✅ Все обязательные поля присутствуют');
  } else {
    console.error('❌ Найдены ошибки:');
    result.errors.forEach(error => console.error(`  - ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️  Предупреждения:');
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  console.log('📊 Данные:', result.data);
  console.groupEnd();
  
  return result;
}

/**
 * Автоматическая валидация для development окружения
 */
if (import.meta.env.DEV) {
  // В dev режиме автоматически валидируем при загрузке страницы рецепта
  window.addEventListener('load', () => {
    const recipeMatch = window.location.pathname.match(/\/recipe\/(\w+)/);
    if (recipeMatch) {
      const recipeId = recipeMatch[1];
      setTimeout(() => {
        logValidationResults(recipeId);
      }, 1000); // Даём время на рендер
    }
  });
}
