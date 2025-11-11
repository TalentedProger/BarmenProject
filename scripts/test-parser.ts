import { parseAlkotekaProduct, convertToIngredient, formatIngredientForCode } from './parse-alkoteka-product.js';

/**
 * Тестовый скрипт для проверки парсера
 */

const testUrl = "https://alkoteka.com/product/vino-igristoe/inkerman-muskat_15530";

console.log('🚀 Тестирование парсера Alkoteka...\n');
console.log(`📌 URL: ${testUrl}\n`);

try {
  const parsed = await parseAlkotekaProduct(testUrl);
  const ingredient = convertToIngredient(parsed);
  
  console.log('\n📋 Результат:\n');
  console.log(formatIngredientForCode(ingredient));
  console.log('\n✅ Тест пройден!');
} catch (error) {
  console.error('❌ Ошибка:', error);
  process.exit(1);
}
