/**
 * Компонент для добавления структурированных данных Schema.org
 * для рецептов коктейлей (Recipe markup)
 * Соответствует требованиям Google Rich Results
 */

import { useEffect } from 'react';

interface RecipeStructuredDataProps {
  recipe: {
    id: string;
    name: string;
    description?: string;
    image: string;
    ingredients: Array<{
      name: string;
      amount: string;
    }>;
    steps: Array<{
      step: number;
      text: string;
    }>;
    abv: number;
    calories: number;
    volume: number;
    price: number;
    taste: {
      sweetness: number;
      sourness: number;
      bitterness: number;
      strength: number;
      refreshing: number;
    };
    tags: string[];
    equipment: Array<{
      name: string;
    }>;
  };
  rating?: {
    average: number;
    count: number;
  };
  author?: string;
  prepTime?: string; // ISO 8601 duration, например "PT15M" (15 минут)
  totalTime?: string; // ISO 8601 duration
}

export default function RecipeStructuredData({ 
  recipe, 
  rating,
  author = "Cocktailo Maker",
  prepTime = "PT5M", // 5 минут по умолчанию
  totalTime = "PT10M" // 10 минут по умолчанию
}: RecipeStructuredDataProps) {
  
  useEffect(() => {
    // Формируем структурированные данные
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Recipe",
      "name": recipe.name,
      "description": recipe.description || `${recipe.name} - рецепт коктейля с пошаговыми инструкциями. ${recipe.tags.join(', ')}.`,
      "image": [
        `https://cocktailomaker.ru${recipe.image}`,
        // Можно добавить дополнительные размеры изображений
      ],
      "author": {
        "@type": "Organization",
        "name": author,
        "url": "https://cocktailomaker.ru"
      },
      "datePublished": new Date().toISOString().split('T')[0],
      "prepTime": prepTime,
      "cookTime": "PT0M", // Для коктейлей обычно нет времени готовки
      "totalTime": totalTime,
      "recipeYield": "1 порция",
      "recipeCategory": "Коктейль",
      "recipeCuisine": "Международная",
      "keywords": recipe.tags.join(', '),
      
      // Ингредиенты
      "recipeIngredient": recipe.ingredients.map(ing => 
        `${ing.amount} ${ing.name}`
      ),
      
      // Пошаговые инструкции
      "recipeInstructions": recipe.steps.map(step => ({
        "@type": "HowToStep",
        "position": step.step,
        "text": step.text,
        "name": `Шаг ${step.step}`
      })),
      
      // Оборудование
      "tool": recipe.equipment.map(eq => ({
        "@type": "HowToTool",
        "name": eq.name
      })),
      
      // Пищевая ценность
      "nutrition": {
        "@type": "NutritionInformation",
        "calories": `${recipe.calories} калорий`,
        "servingSize": `${recipe.volume} мл`,
        "alcoholContent": `${recipe.abv}%`
      },
      
      // Видео (если есть)
      // "video": {
      //   "@type": "VideoObject",
      //   "name": `Как приготовить ${recipe.name}`,
      //   "description": `Видео-инструкция по приготовлению коктейля ${recipe.name}`,
      //   "thumbnailUrl": `https://cocktailomaker.ru${recipe.image}`,
      //   "uploadDate": new Date().toISOString()
      // }
    };
    
    // Добавляем рейтинг, если есть
    if (rating && rating.count > 0) {
      structuredData["aggregateRating"] = {
        "@type": "AggregateRating",
        "ratingValue": rating.average.toFixed(1),
        "ratingCount": rating.count,
        "bestRating": "5",
        "worstRating": "1"
      };
    }
    
    // Создаем или обновляем script tag
    const scriptId = `recipe-structured-data-${recipe.id}`;
    let scriptTag = document.getElementById(scriptId);
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(structuredData);
    
    // Cleanup при размонтировании
    return () => {
      const tag = document.getElementById(scriptId);
      if (tag) {
        tag.remove();
      }
    };
  }, [recipe, rating, author, prepTime, totalTime]);
  
  return null; // Компонент не рендерит визуальный контент
}
