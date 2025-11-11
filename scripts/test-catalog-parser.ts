import { parseCatalogPage } from './parse-alkoteka-catalog.js';
import { parseAlkotekaProduct, convertToIngredient, formatIngredientForCode } from './parse-alkoteka-product.js';

/**
 * Тестовый скрипт для проверки парсера каталога
 * Парсит только одну категорию для быстрой проверки
 */

const TEST_CATALOG_URL = 'https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_viski';
const TEST_LIMIT = 3; // Парсим только 3 товара для теста

console.log('🧪 ТЕСТ ПАРСЕРА КАТАЛОГА\n');
console.log('═══════════════════════════════════════════════════════════════\n');

(async () => {
  try {
    // Шаг 1: Парсим каталог
    console.log('📋 Шаг 1: Извлечение ссылок из каталога...\n');
    const products = await parseCatalogPage(TEST_CATALOG_URL, TEST_LIMIT);
    
    console.log(`\n✅ Найдено ${products.length} товаров\n`);
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   URL: ${p.url}\n`);
    });

    // Шаг 2: Парсим первый товар детально
    if (products.length > 0) {
      console.log('═══════════════════════════════════════════════════════════════\n');
      console.log('📋 Шаг 2: Детальный парсинг первого товара...\n');
      
      const firstProduct = products[0];
      const parsed = await parseAlkotekaProduct(firstProduct.url);
      const ingredient = convertToIngredient(parsed);
      
      console.log('\n✅ РЕЗУЛЬТАТ:\n');
      console.log(formatIngredientForCode(ingredient));
      
      console.log('\n═══════════════════════════════════════════════════════════════\n');
      console.log('✅ ТЕСТ ПРОЙДЕН УСПЕШНО!');
      console.log('═══════════════════════════════════════════════════════════════\n');
      console.log('Парсер работает корректно. Можно запускать полный парсинг:');
      console.log('  npm run parse:catalog\n');
    }

    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ ОШИБКА:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();
