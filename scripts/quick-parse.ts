import { parseAlkotekaProduct, convertToIngredient, formatIngredientForCode } from './parse-alkoteka-product.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Быстрый парсинг первых 10 товаров для проверки
 */

const TEST_URLS = [
  'https://alkoteka.com/catalog/krepkiy-alkogol/dzhek-daniels-700-ml/',
  'https://alkoteka.com/catalog/krepkiy-alkogol/dzheymson-700-ml/',
  'https://alkoteka.com/catalog/krepkiy-alkogol/russkiy-standart-original-500-ml/',
];

console.log('🧪 БЫСТРЫЙ ТЕСТ ПАРСЕРА\n');
console.log('═══════════════════════════════════════════\n');

(async () => {
  const results: any[] = [];
  
  for (let i = 0; i < TEST_URLS.length; i++) {
    const url = TEST_URLS[i];
    console.log(`[${i + 1}/${TEST_URLS.length}] Парсинг: ${url}\n`);
    
    try {
      const parsed = await parseAlkotekaProduct(url);
      const ingredient = convertToIngredient(parsed);
      
      console.log(`✅ ${parsed.name}`);
      console.log(`   Цена: ${parsed.price}₽`);
      console.log(`   Объем: ${parsed.volume}мл`);
      console.log(`   ABV: ${parsed.abv}%`);
      console.log(`   Цена/л: ${ingredient.pricePerLiter}₽`);
      console.log(`   Иконка: ${ingredient.sourceIcon}\n`);
      
      results.push(ingredient);
      
      // Задержка
      if (i < TEST_URLS.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
      
    } catch (error: any) {
      console.error(`❌ Ошибка: ${error.message}\n`);
    }
  }
  
  if (results.length > 0) {
    console.log('\n═══════════════════════════════════════════');
    console.log(`✅ Успешно: ${results.length}/${TEST_URLS.length}\n`);
    console.log('📋 Пример данных:\n');
    console.log(formatIngredientForCode(results[0]));
    console.log('\n✅ Парсер работает! Можно запускать полный парсинг.');
  } else {
    console.log('\n❌ Ни один товар не спарсился. Проверьте селекторы.');
  }
  
  process.exit(0);
})();
