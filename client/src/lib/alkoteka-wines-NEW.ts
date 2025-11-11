import type { Ingredient } from "@shared/schema";

/**
 * ВАЖНО: Для добавления реальных товаров с Alkoteka:
 * 
 * 1. Используйте правильный формат URL:
 *    https://alkoteka.com/product/{category}/{slug}_{id}
 *    Пример: https://alkoteka.com/product/vino-igristoe/inkerman-muskat_15530
 * 
 * 2. Данные должны быть 1 в 1 с сайта:
 *    - Название товара точно как на сайте
 *    - Реальная цена товара (затем пересчитать в pricePerLiter)
 *    - Реальный объем с сайта (обычно 750мл)
 *    - Реальная крепость ABV
 * 
 * 3. Для парсинга используйте скрипт или добавляйте вручную
 */

// Реальные напитки из Alkoteka
// ⚠️ ВАЖНО: Добавляйте сюда ТОЛЬКО реальные товары, спарсенные с сайта!
// 
// Используйте команду: npm run parse:catalog
// Результат будет в: scripts/parsed-catalog-ingredients.ts
// 
export const ALKOTEKA_WINES: Partial<Ingredient>[] = [
  // Вставьте сюда результаты парсинга из scripts/parsed-catalog-ingredients.ts
];

// Статистика
export const ALKOTEKA_STATS = {
  totalWines: ALKOTEKA_WINES.length,
  red: 0,
  white: 0,
  rose: 0,
  sparkling: 0,
  fortified: 0,
};
