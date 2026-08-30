/**
 * Универсальный компонент для управления мета-тегами страниц
 * Устанавливает canonical URL, title, description для всех публичных страниц
 * 
 * ВАЖНО: Используйте этот компонент на КАЖДОЙ публичной странице для правильной индексации
 */

import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface PageMetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  noindex?: boolean; // Для страниц, которые НЕ должны индексироваться (/home, /profile)
}

export default function PageMeta({
  title,
  description,
  keywords,
  ogImage,
  noindex = false
}: PageMetaProps) {
  const [location] = useLocation();

  useEffect(() => {
    const baseUrl = 'https://cocktailomaker.ru';
    // Убираем query parameters для canonical URL
    const cleanPath = location.split('?')[0];
    const canonicalUrl = `${baseUrl}${cleanPath}`;
    
    // Дефолтные значения
    const defaultTitle = 'Cocktailo Maker — рецепты коктейлей 🍸 Конструктор алкогольных и безалкогольных коктейлей онлайн | Cocktail Maker';
    const defaultDescription = 'Cocktailo Maker (Cocktail Maker) — бесплатный онлайн конструктор коктейлей с 800+ ингредиентами. Рецепты алкогольных и безалкогольных коктейлей дома: Мохито, Маргарита, Космополитен, Негрони, Пина Колада, Aperol Spritz, Moscow Mule. Генератор напитков с расчётом крепости, курсы миксологии и барменского дела.';
    const defaultKeywords = 'рецепты коктейлей, алкогольные коктейли, безалкогольные коктейли, конструктор коктейлей, генератор коктейлей, cocktail maker, миксология, барменское дело';
    const defaultOgImage = `${baseUrl}/og-image.png`;
    
    // Устанавливаем title
    document.title = title || defaultTitle;
    
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
    
    // Обновляем robots meta tag
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }
    
    // Обновляем основные мета-теги
    if (description) {
      updateMetaTag('description', description);
    }
    
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    
    // Обновляем Open Graph
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:title', title || defaultTitle, true);
    updateMetaTag('og:description', description || defaultDescription, true);
    updateMetaTag('og:image', ogImage || defaultOgImage, true);
    
    // Обновляем Twitter Card
    updateMetaTag('twitter:url', canonicalUrl);
    updateMetaTag('twitter:title', title || defaultTitle);
    updateMetaTag('twitter:description', description || defaultDescription);
    updateMetaTag('twitter:image', ogImage || defaultOgImage);
    
    // Обновляем canonical URL (КРИТИЧНО для правильной индексации!)
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
    
    // Cleanup при размонтировании - восстанавливаем дефолты
    return () => {
      document.title = defaultTitle;
      
      const canonicalTag = document.querySelector('link[rel="canonical"]');
      if (canonicalTag) {
        canonicalTag.setAttribute('href', `${baseUrl}/`);
      }
      
      // Восстанавливаем robots
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    };
  }, [location, title, description, keywords, ogImage, noindex]);
  
  return null; // Компонент не рендерит визуальный контент
}
