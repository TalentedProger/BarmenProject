import * as cheerio from 'cheerio';

/**
 * Проверка структуры ссылок на товары Alkoteka
 */

const TEST_CATALOG_URL = 'https://alkoteka.com/catalog/shampanskoe-i-igristoe/';

console.log('🔍 Анализ структуры ссылок на товары\n');

(async () => {
  try {
    const response = await fetch(TEST_CATALOG_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    console.log('✅ Страница загружена\n');
    
    // Ищем ссылки на товары
    console.log('🔗 Поиск ссылок на товары:\n');
    
    // Вариант 1: Ссылки на изображения товаров
    $('a[href*="/product/"]').slice(0, 5).each((i, elem) => {
      const href = $(elem).attr('href');
      const fullUrl = href?.startsWith('http') ? href : `https://alkoteka.com${href}`;
      const img = $(elem).find('img').attr('alt') || 'No alt';
      console.log(`[${i + 1}] ${fullUrl}`);
      console.log(`    Изображение: ${img}\n`);
    });
    
    // Вариант 2: Все ссылки с "product"
    console.log('\n📦 Все ссылки содержащие "product":\n');
    const productLinks = new Set<string>();
    $('a').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && href.includes('/product/')) {
        const fullUrl = href.startsWith('http') ? href : `https://alkoteka.com${href}`;
        productLinks.add(fullUrl);
      }
    });
    
    productLinks.forEach((link, i) => {
      if (i < 10) {
        console.log(`  ${link}`);
      }
    });
    
    console.log(`\n✅ Найдено уникальных ссылок на товары: ${productLinks.size}`);
    
    // Вариант 3: Ссылки в карточках товаров
    console.log('\n🎴 Ссылки в карточках товаров:\n');
    $('.product-card, .item, [class*="product"]').slice(0, 5).each((i, elem) => {
      const link = $(elem).find('a[href*="/product/"]').first();
      const href = link.attr('href');
      const title = link.attr('title') || $(elem).find('img').attr('alt') || 'No title';
      if (href) {
        const fullUrl = href.startsWith('http') ? href : `https://alkoteka.com${href}`;
        console.log(`[${i + 1}] ${title}`);
        console.log(`    ${fullUrl}\n`);
      }
    });

    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ Ошибка:', error.message);
    process.exit(1);
  }
})();
