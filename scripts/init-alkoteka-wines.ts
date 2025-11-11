import { db } from '../server/db';
import { ingredients } from '@shared/schema';
import { ALKOTEKA_WINES, ALKOTEKA_STATS } from '../client/src/lib/alkoteka-wines-data';

/**
 * Скрипт для добавления реальных вин из Alkoteka в базу данных
 * Добавляет 20 позиций реальных вин с полными характеристиками
 */
async function initAlkotekaWines() {
  try {
    console.log('🍷 Начало инициализации вин из Alkoteka...');
    console.log(`📊 Статистика: ${ALKOTEKA_STATS.totalWines} позиций`);
    console.log(`   - Красные: ${ALKOTEKA_STATS.red}`);
    console.log(`   - Белые: ${ALKOTEKA_STATS.white}`);
    console.log(`   - Розовые: ${ALKOTEKA_STATS.rose}`);
    console.log(`   - Игристые: ${ALKOTEKA_STATS.sparkling}`);
    console.log(`   - Крепленые: ${ALKOTEKA_STATS.fortified}`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const wine of ALKOTEKA_WINES) {
      // Проверяем, существует ли уже такое вино
      const existing = await db.query.ingredients.findFirst({
        where: (ingredients, { eq }) => eq(ingredients.name, wine.name!),
      });

      if (existing) {
        console.log(`⏭️  Пропущено (уже существует): ${wine.name}`);
        skippedCount++;
        continue;
      }

      // Добавляем вино в базу
      await db.insert(ingredients).values({
        name: wine.name!,
        category: wine.category!,
        color: wine.color!,
        abv: String(wine.abv || 0),
        pricePerLiter: String(wine.pricePerLiter || 0),
        tasteProfile: wine.tasteProfile!,
        unit: wine.unit!,
        sourceUrl: wine.sourceUrl || null,
        sourceName: wine.sourceName || null,
        sourceIcon: wine.sourceIcon || null,
        volume: wine.volume || null,
      });

      console.log(`✅ Добавлено: ${wine.name} (${wine.abv}%, ${wine.pricePerLiter}₽/л, ${wine.volume}мл)`);
      addedCount++;
    }

    console.log('\n✨ Инициализация завершена!');
    console.log(`📈 Добавлено: ${addedCount} новых вин`);
    console.log(`⏭️  Пропущено: ${skippedCount} существующих`);
    console.log(`🔗 Все вина имеют ссылки на Alkoteka`);
    
  } catch (error) {
    console.error('❌ Ошибка при инициализации вин:', error);
    throw error;
  }
}

// Запуск скрипта
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;

if (isMainModule) {
  initAlkotekaWines()
    .then(() => {
      console.log('🎉 Скрипт успешно выполнен');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Скрипт завершился с ошибкой:', error);
      process.exit(1);
    });
}

export { initAlkotekaWines };
