import * as cheerio from 'cheerio';

/**
 * Анализ страницы товара для понимания структуры URL
 */

// Проверяем оба типа URL
const TEST_URLS = [
  'https://alkoteka.com/catalog/shampanskoe-i-igristoe/ruinart-blanc-de-blancs-750-ml/',
  'https://alkoteka.com/product/shampanskoe-1/ryuinar-roze_9995',
];

console.log('🔍 Анализ страниц товаров\n');

(async () => {
  for (const url of TEST_URLS) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 URL: ${url}\n`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      });

      if (!response.ok) {
        console.log(`❌ HTTP ${response.status}: ${response.statusText}\n`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      console.log(`✅ Статус: ${response.status} OK`);
      console.log(`📏 Размер HTML: ${html.length} символов\n`);

      // Проверяем наличие данных о товаре
      const h1 = $('h1').first().text().trim();
      const price = $('[class*="price"]').first().text().trim();
      
      console.log(`📦 Заголовок: ${h1 || 'НЕ НАЙДЕН'}`);
      console.log(`💰 Цена: ${price || 'НЕ НАЙДЕНА'}\n`);

      // Ищем канонический URL
      const canonical = $('link[rel="canonical"]').attr('href');
      if (canonical) {
        console.log(`🔗 Canonical URL: ${canonical}\n`);
      }

      // Ищем альтернативные ссылки на товар
      $('a[href*="product"]').slice(0, 3).each((i, elem) => {
        const href = $(elem).attr('href');
        console.log(`   Ссылка ${i + 1}: ${href}`);
      });

    } catch (error: any) {
      console.error(`❌ Ошибка: ${error.message}\n`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('\n💡 Вывод: Нужно проверить какой URL правильный\n');
  
  process.exit(0);
})();
