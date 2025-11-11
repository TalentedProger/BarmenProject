/**
 * Тест API - проверка загруженных данных
 */

async function testAPI() {
  try {
    console.log('🔍 Проверка данных с API...\n');
    
    const response = await fetch('http://localhost:3000/api/ingredients?category=alcohol');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ Получено ингредиентов: ${data.length}\n`);
    
    // Проверяем наличие подкатегорий в названиях
    const whiskyItems = data.filter((item: any) => item.name.includes('Виски'));
    const vodkaItems = data.filter((item: any) => item.name.includes('Водка'));
    const ginItems = data.filter((item: any) => item.name.includes('Джин'));
    const liqueurItems = data.filter((item: any) => item.name.includes('Ликёр'));
    const rumItems = data.filter((item: any) => item.name.includes('Ром'));
    const tequilaItems = data.filter((item: any) => item.name.includes('Текила'));
    const sparklingItems = data.filter((item: any) => item.name.includes('Игристое вино'));
    const champagneItems = data.filter((item: any) => item.name.includes('Шампанское'));
    
    console.log('📊 Количество товаров по категориям:\n');
    console.log(`  Виски: ${whiskyItems.length}`);
    console.log(`  Водка: ${vodkaItems.length}`);
    console.log(`  Джин: ${ginItems.length}`);
    console.log(`  Ликёр: ${liqueurItems.length}`);
    console.log(`  Ром: ${rumItems.length}`);
    console.log(`  Текила: ${tequilaItems.length}`);
    console.log(`  Игристое вино: ${sparklingItems.length}`);
    console.log(`  Шампанское: ${champagneItems.length}\n`);
    
    // Показываем примеры названий
    console.log('📝 Примеры названий:\n');
    if (whiskyItems.length > 0) {
      console.log(`  Виски: "${whiskyItems[0].name}"`);
    }
    if (vodkaItems.length > 0) {
      console.log(`  Водка: "${vodkaItems[0].name}"`);
    }
    if (ginItems.length > 0) {
      console.log(`  Джин: "${ginItems[0].name}"\n`);
    }
    
    // Проверяем ссылки
    console.log('🔗 Проверка ссылок:\n');
    const itemsWithLinks = data.filter((item: any) => item.sourceUrl);
    console.log(`  Товаров с ссылками: ${itemsWithLinks.length}/${data.length}`);
    
    if (itemsWithLinks.length > 0) {
      console.log(`\n  Примеры ссылок:`);
      itemsWithLinks.slice(0, 3).forEach((item: any) => {
        console.log(`    ${item.name}`);
        console.log(`    → ${item.sourceUrl}\n`);
      });
    }
    
    if (whiskyItems.length === 10 && vodkaItems.length === 10 && ginItems.length === 10) {
      console.log('✅ УСПЕХ: Все категории заполнены правильно!');
    } else {
      console.log('❌ ОШИБКА: Не все категории имеют по 10 товаров!');
      console.log('   Сервер возможно не перезапущен или использует старые данные.');
    }
    
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message);
    console.log('\n💡 Убедитесь что сервер запущен: npm run dev');
  }
}

testAPI();
