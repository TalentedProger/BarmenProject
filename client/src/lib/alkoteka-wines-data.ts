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
// ВАЖНО: Добавляйте сюда ТОЛЬКО реально спарсенные товары!
// Используйте команду: npm run parse:alkoteka "URL_ТОВАРА"
export const ALKOTEKA_WINES: Partial<Ingredient>[] = [
  // Вставляйте сюда результаты парсинга
  // Пример использования:
  // 1. Запустите: npm run parse:alkoteka "https://alkoteka.com/product/..."
  // 2. Скопируйте вывод скрипта
  // 3. Вставьте сюда
  
  // Пустой массив - заполните реальными данными через парсер
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
