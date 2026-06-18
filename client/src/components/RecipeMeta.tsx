/**
 * Компонент для динамических мета-тегов страниц рецептов
 * Обновляет title, description и Open Graph теги для каждого рецепта
 */

import { useEffect } from 'react';

interface RecipeMetaProps {
  recipe: {
    id: string;
    name: string;
    description?: string;
    image: string;
    tags: string[];
    abv: number;
    volume: number;
    ingredients: Array<{
      name: string;
      amount: string;
    }>;
  };
  rating?: {
    average: number;
    count: number;
  };
}

export default function RecipeMeta({ recipe, rating }: RecipeMetaProps) {
  
  useEffect(() => {
    const baseUrl = 'https://cocktailomaker.ru';
    const recipeUrl = `${baseUrl}/recipe/${recipe.id}`;
    const imageUrl = recipe.image.startsWith('http') 
      ? recipe.image 
      : `${baseUrl}${recipe.image}`;
    
    // Генерируем описание
    const ingredientsList = recipe.ingredients
      .slice(0, 5)
      .map(ing => ing.name)
      .join(', ');
    
    const description = recipe.description || 
      `Рецепт коктейля ${recipe.name} с пошаговыми инструкциями. Состав: ${ingredientsList}. ${recipe.tags.join(', ')}. Крепость ${recipe.abv}%, объём ${recipe.volume} мл. Cocktailo Maker.`;
    
    // Генерируем заголовок
    const titleSuffix = rating && rating.count > 0 
      ? ` ⭐ ${rating.average.toFixed(1)} (${rating.count} отзывов)` 
      : '';
    const title = `${recipe.name} — рецепт коктейля${titleSuffix} | Cocktailo Maker`;
    
    // Обновляем title
    document.title = title;
    
    // Функция для обновления или создания мета-тега
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };
    
    // Обновляем основные мета-теги
    updateMetaTag('description', description);
    updateMetaTag('keywords', `${recipe.name}, рецепт ${recipe.name}, коктейль ${recipe.name}, ${recipe.tags.join(', ')}, рецепты коктейлей, cocktailo maker, cocktail maker`);
    
    // Обновляем Open Graph
    updateMetaTag('og:type', 'article', true);
    updateMetaTag('og:url', recipeUrl, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', imageUrl, true);
    updateMetaTag('og:image:alt', `Фото коктейля ${recipe.name}`, true);
    updateMetaTag('og:site_name', 'Cocktailo Maker — Рецепты коктейлей', true);
    
    // Обновляем Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', recipeUrl);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', imageUrl);
    updateMetaTag('twitter:image:alt', `Фото коктейля ${recipe.name}`);
    
    // Обновляем canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', recipeUrl);
    
    // Cleanup - восстанавливаем оригинальные значения при размонтировании
    return () => {
      document.title = 'Cocktailo Maker — рецепты коктейлей 🍸 Конструктор алкогольных и безалкогольных коктейлей онлайн | Cocktail Maker';
      
      // Восстанавливаем canonical на главную
      const canonicalTag = document.querySelector('link[rel="canonical"]');
      if (canonicalTag) {
        canonicalTag.setAttribute('href', 'https://cocktailomaker.ru/');
      }
    };
  }, [recipe, rating]);
  
  return null; // Компонент не рендерит визуальный контент
}
