import { EXTENDED_INGREDIENTS, EXTENDED_GLASS_TYPES } from '../client/src/lib/extended-ingredients-data';
import { storage } from '../server/storage';
import type { Ingredient, GlassType } from '@shared/schema';

/**
 * Скрипт для инициализации базы данных расширенным списком ингредиентов
 * Включает новые категории алкоголя: виски, джин, ром, ликёры, вермут, вино, пиво и др.
 * Использует EXTENDED_INGREDIENTS из extended-ingredients-data.ts (парсинг с внешних источников)
 */

async function initializeExtendedIngredients() {
  console.log('🚀 Инициализация расширенного списка ингредиентов...');
  console.log(`📦 Доступно ингредиентов в extended-ingredients-data.ts: ${EXTENDED_INGREDIENTS.length}`);
  
  try {
    // Получаем существующие ингредиенты
    const existingIngredients = await storage.getIngredients();
    console.log(`📊 Найдено существующих ингредиентов в БД: ${existingIngredients.length}`);
    
    // Создаем Map для быстрого поиска существующих ингредиентов по имени
    const existingNames = new Set(existingIngredients.map(ing => ing.name));
    
    // Фильтруем новые ингредиенты (только те, которых еще нет)
    const newIngredients = EXTENDED_INGREDIENTS.filter(ing => !existingNames.has(ing.name!));
    console.log(`✨ Новых ингредиентов для добавления: ${newIngredients.length}`);
    
    // Добавляем новые ингредиенты
    let addedCount = 0;
    for (const ingredientData of newIngredients) {
      try {
        const ingredient = await storage.createIngredient(ingredientData as Partial<Ingredient>);
        console.log(`✅ Добавлен: ${ingredient.name} (${ingredient.category})`);
        addedCount++;
      } catch (error) {
        console.error(`❌ Ошибка при добавлении ${ingredientData.name}:`, error);
      }
    }
    
    // Инициализируем типы стаканов
    console.log('\n🥃 Инициализация типов стаканов...');
    const existingGlasses = await storage.getGlassTypes();
    const existingGlassNames = new Set(existingGlasses.map(glass => glass.name));
    
    const newGlasses = EXTENDED_GLASS_TYPES.filter(glass => !existingGlassNames.has(glass.name));
    console.log(`✨ Новых типов стаканов для добавления: ${newGlasses.length}`);
    
    let addedGlassesCount = 0;
    for (const glassData of newGlasses) {
      try {
        const glass = await storage.createGlassType(glassData as Partial<GlassType>);
        console.log(`✅ Добавлен стакан: ${glass.name} (${glass.capacity}ml)`);
        addedGlassesCount++;
      } catch (error) {
        console.error(`❌ Ошибка при добавлении стакана ${glassData.name}:`, error);
      }
    }
    
    // Финальная статистика
    const finalIngredients = await storage.getIngredients();
    const finalGlasses = await storage.getGlassTypes();
    
    console.log('\n📈 Финальная статистика:');
    console.log(`🍹 Всего ингредиентов: ${finalIngredients.length}`);
    console.log(`🥃 Всего типов стаканов: ${finalGlasses.length}`);
    console.log(`➕ Добавлено ингредиентов: ${addedCount}`);
    console.log(`➕ Добавлено стаканов: ${addedGlassesCount}`);
    
    // Статистика по категориям
    const categoryStats = finalIngredients.reduce((acc, ing) => {
      acc[ing.category] = (acc[ing.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📊 Статистика по категориям:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      const emoji = getCategoryEmoji(category);
      console.log(`  ${emoji} ${category}: ${count} шт.`);
    });
    
    console.log('\n🎉 Инициализация завершена успешно!');
    
  } catch (error) {
    console.error('💥 Критическая ошибка при инициализации:', error);
    process.exit(1);
  }
}

function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'alcohol': '🍺',
    'juice': '🧃',
    'syrup': '🍯',
    'mixer': '🥤',
    'fruit': '🍋',
    'garnish': '🫒',
    'bitter': '🌿',
    'ice': '🧊'
  };
  return emojiMap[category] || '🔹';
}

// Запуск скрипта
if (require.main === module) {
  initializeExtendedIngredients()
    .then(() => {
      console.log('✨ Скрипт завершен');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Скрипт завершен с ошибкой:', error);
      process.exit(1);
    });
}

export { initializeExtendedIngredients };
