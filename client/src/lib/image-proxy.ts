/**
 * Утилиты для получения изображений продуктов
 */

/**
 * Генерирует URL для получения Open Graph изображения через прокси
 * Использует сервис для извлечения og:image из страницы продукта
 */
export function getProductImageUrl(sourceUrl: string): string {
  // Для krasnoeibeloe.ru можно использовать паттерн URL изображений
  // или Open Graph image через API
  
  // Вариант 1: Использовать LinkPreview API
  // return `https://api.linkpreview.net/?q=${encodeURIComponent(sourceUrl)}`;
  
  // Вариант 2: Использовать микро-сервис для получения og:image
  // return `/api/og-image?url=${encodeURIComponent(sourceUrl)}`;
  
  // Вариант 3: Использовать паттерн URL для krasnoeibeloe.ru
  // Обычно изображения находятся по адресу похожему на:
  // https://krasnoeibeloe.ru/upload/iblock/xxx/yyy.jpg
  
  return sourceUrl; // Заглушка
}

/**
 * Генерирует красивый SVG placeholder для ингредиента
 * Используется когда реальное изображение недоступно
 */
export function generateIngredientPlaceholder(name: string, color: string): string {
  const svgContent = `<svg width="60" height="80" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${color}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.6" />
      </linearGradient>
    </defs>
    <rect width="60" height="80" fill="url(#grad-${color})"/>
    <circle cx="30" cy="30" r="12" fill="white" opacity="0.2"/>
    <text x="30" y="70" text-anchor="middle" fill="white" font-size="10" font-weight="bold" opacity="0.8">
      ${name.slice(0, 8)}
    </text>
  </svg>`;
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
}
