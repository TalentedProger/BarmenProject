import * as cheerio from 'cheerio';
import * as fs from 'fs';

/**
 * Отладочный скрипт для анализа HTML структуры страницы
 */

const TEST_URL = 'https://alkoteka.com/catalog/krepkiy-alkogol/dzhek-daniels-700-ml/';

console.log('🔍 АНАЛИЗ HTML СТРАНИЦЫ\n');
console.log(`URL: ${TEST_URL}\n`);

(async () => {
  try {
    const response = await fetch(TEST_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    console.log('✅ HTML загружен\n');
    console.log('═══════════════════════════════════════════\n');

    // Сохраняем HTML для ручного анализа
    fs.writeFileSync('debug-page.html', html, 'utf-8');
    console.log('📄 HTML сохранен в: debug-page.html\n');

    // Ищем заголовки
    console.log('🔍 Поиск заголовков (H1):');
    $('h1').each((i, elem) => {
      const text = $(elem).text().trim();
      const classes = $(elem).attr('class') || '';
      console.log(`  [${i + 1}] "${text}" (class: ${classes})`);
    });

    console.log('\n🔍 Поиск элементов с "title", "name", "product":');
    $('[class*="title"], [class*="name"], [class*="product"]').slice(0, 10).each((i, elem) => {
      const text = $(elem).text().trim().substring(0, 50);
      const classes = $(elem).attr('class') || '';
      const tag = elem.tagName;
      console.log(`  [${i + 1}] <${tag} class="${classes}"> "${text}..."`);
    });

    console.log('\n🔍 Поиск элементов с "price":');
    $('[class*="price"]').slice(0, 10).each((i, elem) => {
      const text = $(elem).text().trim();
      const classes = $(elem).attr('class') || '';
      console.log(`  [${i + 1}] "${text}" (class: ${classes})`);
    });

    console.log('\n🔍 Метатеги:');
    $('meta[property^="og:"]').each((i, elem) => {
      const property = $(elem).attr('property');
      const content = $(elem).attr('content');
      console.log(`  ${property}: ${content}`);
    });

    console.log('\n🔍 JSON-LD данные:');
    $('script[type="application/ld+json"]').each((i, elem) => {
      const content = $(elem).html();
      if (content) {
        try {
          const data = JSON.parse(content);
          console.log(`  Найден JSON-LD (${data['@type']})`);
          if (data['@type'] === 'Product') {
            console.log(`    Название: ${data.name}`);
            console.log(`    Цена: ${data.offers?.price}`);
          }
        } catch (e) {
          console.log(`  Ошибка парсинга JSON-LD`);
        }
      }
    });

    console.log('\n═══════════════════════════════════════════');
    console.log('\n💡 Проверьте файл debug-page.html для детального анализа');
    
    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ Ошибка:', error.message);
    process.exit(1);
  }
})();
