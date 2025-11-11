import * as cheerio from 'cheerio';
import { parseAlkotekaProduct, convertToIngredient, formatIngredientForCode } from './parse-alkoteka-product.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Парсер страниц каталога Alkoteka
 * Извлекает ссылки на товары из страниц категорий
 */

interface CatalogProduct {
  url: string;
  name: string;
  price: number;
}

/**
 * Парсит страницу каталога и извлекает ссылки на товары
 * @param catalogUrl URL страницы каталога (например: https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_viski)
 * @param limit Максимальное количество товаров для извлечения (по умолчанию 10)
 * @returns Массив URL товаров
 */
export async function parseCatalogPage(catalogUrl: string, limit: number = 10): Promise<CatalogProduct[]> {
  try {
    console.log(`\n🔍 Парсинг каталога: ${catalogUrl}`);
    console.log(`📊 Лимит товаров: ${limit}\n`);

    const response = await fetch(catalogUrl, {
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

    const products: CatalogProduct[] = [];

    // Попробуем разные селекторы для карточек товаров
    const possibleSelectors = [
      '.product-card',
      '.catalog-item',
      '.item',
      '[data-product]',
      'article.product',
      '.product',
      '.goods-tile'
    ];

    let productCards: cheerio.Cheerio<cheerio.Element> | null = null;

    for (const selector of possibleSelectors) {
      const cards = $(selector);
      if (cards.length > 0) {
        console.log(`✅ Найдены карточки товаров с селектором: ${selector} (${cards.length} шт.)`);
        productCards = cards;
        break;
      }
    }

    if (!productCards || productCards.length === 0) {
      // Попробуем найти все ссылки, которые ведут на /product/ или /catalog/.../ (товары)
      // Alkoteka может использовать разные форматы URL
      const allLinks = $('a[href]');
      console.log(`🔍 Всего ссылок на странице: ${allLinks.length}`);
      
      // Извлекаем уникальные URL товаров
      const uniqueUrls = new Set<string>();
      const urlPatterns = [
        /\/product\/[^\/]+\/[^\/]+_\d+/,  // /product/category/slug_id
        /\/catalog\/[^\/]+\/[^\/]+\/[^\/]+-\d+-ml\//,  // /catalog/.../name-volume-ml/
        /\/[^\/]+-\d+_\d+/  // другие форматы с ID
      ];
      
      allLinks.each((i, elem) => {
        if (uniqueUrls.size >= limit) return;
        
        let href = $(elem).attr('href');
        if (!href) return;
        
        // Делаем полный URL
        const fullUrl = href.startsWith('http') ? href : `https://alkoteka.com${href}`;
        
        // Проверяем все возможные паттерны
        for (const pattern of urlPatterns) {
          if (pattern.test(fullUrl)) {
            // Дополнительно проверяем, что это не категория
            if (!fullUrl.includes('/options-') && !fullUrl.endsWith('/catalog/')) {
              uniqueUrls.add(fullUrl);
              break;
            }
          }
        }
      });

      console.log(`✅ Найдено уникальных URL товаров: ${uniqueUrls.size}`);
      
      if (uniqueUrls.size === 0) {
        // Отладочная информация
        console.log('\n🔍 Отладка: Примеры ссылок на странице:');
        $('a[href]').slice(0, 10).each((i, elem) => {
          console.log(`  - ${$(elem).attr('href')}`);
        });
        throw new Error('Не удалось найти товары на странице. Возможно, структура сайта изменилась.');
      }

      uniqueUrls.forEach(url => {
        products.push({
          url,
          name: 'Будет получено при детальном парсинге',
          price: 0
        });
      });

    } else {
      // Извлекаем данные из карточек товаров
      productCards.each((i, card) => {
        if (products.length >= limit) return;

        const $card = $(card);
        
        // Ищем ссылку на товар
        let link = $card.find('a[href*="/product/"]').first().attr('href');
        
        if (!link) {
          link = $card.attr('href');
        }

        if (link) {
          const fullUrl = link.startsWith('http') ? link : `https://alkoteka.com${link}`;
          
          // Извлекаем название (опционально)
          const name = $card.find('.product-title, .product-name, h3, .title').first().text().trim() || 'Будет получено';
          
          // Извлекаем цену (опционально)
          const priceText = $card.find('.price, .product-price, [class*="price"]').first().text().trim();
          const priceMatch = priceText.match(/(\d+[\s,]?\d*)/);
          const price = priceMatch ? parseFloat(priceMatch[1].replace(/\s/g, '').replace(',', '.')) : 0;

          products.push({
            url: fullUrl,
            name,
            price
          });
        }
      });
    }

    console.log(`\n✅ Извлечено ${products.length} товаров из каталога`);
    
    if (products.length === 0) {
      throw new Error('Не удалось извлечь товары из каталога');
    }

    return products.slice(0, limit);

  } catch (error: any) {
    console.error('❌ Ошибка парсинга каталога:', error.message);
    throw error;
  }
}

/**
 * Парсит несколько каталогов и извлекает товары
 */
export async function parseMultipleCatalogs(
  catalogUrls: string[],
  itemsPerCatalog: number = 10
): Promise<Array<{ category: string; products: CatalogProduct[] }>> {
  const results: Array<{ category: string; products: CatalogProduct[] }> = [];

  console.log(`\n🚀 Начинаем парсинг ${catalogUrls.length} каталогов...\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (let i = 0; i < catalogUrls.length; i++) {
    const url = catalogUrls[i];
    
    // Извлекаем название категории из URL
    const categoryMatch = url.match(/categories_([^\/]+)/);
    const category = categoryMatch ? categoryMatch[1] : `category_${i + 1}`;

    console.log(`[${i + 1}/${catalogUrls.length}] Категория: ${category}`);

    try {
      // Задержка между запросами
      if (i > 0) {
        console.log('⏳ Ожидание 2 секунды...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const products = await parseCatalogPage(url, itemsPerCatalog);
      
      results.push({
        category,
        products
      });

      console.log(`✅ [${category}] Успешно извлечено ${products.length} товаров\n`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error: any) {
      console.error(`❌ [${category}] Ошибка: ${error.message}\n`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
  }

  return results;
}

/**
 * Парсит все товары из результатов каталогов
 */
export async function parseAllProducts(
  catalogResults: Array<{ category: string; products: CatalogProduct[] }>
): Promise<any[]> {
  const allIngredients: any[] = [];
  let successCount = 0;
  let failCount = 0;

  console.log('\n🍹 ПАРСИНГ ДЕТАЛЬНОЙ ИНФОРМАЦИИ О ТОВАРАХ\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (const catalogResult of catalogResults) {
    console.log(`\n📦 Категория: ${catalogResult.category} (${catalogResult.products.length} товаров)\n`);

    for (let i = 0; i < catalogResult.products.length; i++) {
      const product = catalogResult.products[i];
      
      console.log(`  [${i + 1}/${catalogResult.products.length}] ${product.url}`);

      try {
        // Задержка между запросами
        if (successCount > 0 || failCount > 0) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        const parsed = await parseAlkotekaProduct(product.url);
        const ingredient = convertToIngredient(parsed);
        
        allIngredients.push(ingredient);
        successCount++;
        
        console.log(`  ✅ ${parsed.name} (${parsed.abv}%, ${parsed.price}₽)\n`);

      } catch (error: any) {
        failCount++;
        console.log(`  ❌ Ошибка: ${error.message}\n`);
      }
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`📊 ИТОГО: Успешно ${successCount} | Ошибок ${failCount}\n`);

  return allIngredients;
}

/**
 * Сохраняет результаты в файл
 */
export function saveIngredientsToFile(ingredients: any[], filename: string = 'parsed-catalog-ingredients.ts') {
  const outputPath = path.join(process.cwd(), 'scripts', filename);
  
  let content = `import type { Ingredient } from '@shared/schema';\n\n`;
  content += `/**\n`;
  content += ` * Автоматически спарсенные ингредиенты из каталога Alkoteka\n`;
  content += ` * Дата: ${new Date().toLocaleString('ru-RU')}\n`;
  content += ` * Всего товаров: ${ingredients.length}\n`;
  content += ` */\n\n`;
  content += `export const PARSED_CATALOG_INGREDIENTS: Partial<Ingredient>[] = [\n`;
  
  ingredients.forEach((ingredient, index) => {
    content += formatIngredientForCode(ingredient);
    if (index < ingredients.length - 1) {
      content += ',\n';
    }
  });
  
  content += `\n];\n`;

  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`\n📝 Результаты сохранены в: ${outputPath}\n`);
}

// CLI
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;

if (isMainModule) {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   🍷 ПАРСЕР КАТАЛОГА ALKOTEKA');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Список каталогов для парсинга
  const CATALOG_URLS = [
    'https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_viski',
    'https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_vodka',
    'https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_dzhin',
    'https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_likery',
    'https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_nastoyki',
    'https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_rom',
    'https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_tekila',
    'https://alkoteka.com/catalog/shampanskoe-i-igristoe/options-categories_vino-igristoe',
    'https://alkoteka.com/catalog/shampanskoe-i-igristoe/options-categories_shampanskoe'
  ];

  const ITEMS_PER_CATALOG = 10;

  (async () => {
    try {
      // Шаг 1: Парсим каталоги и извлекаем ссылки
      const catalogResults = await parseMultipleCatalogs(CATALOG_URLS, ITEMS_PER_CATALOG);

      // Подсчет общего количества товаров
      const totalProducts = catalogResults.reduce((sum, r) => sum + r.products.length, 0);
      
      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log(`📊 Извлечено ${totalProducts} ссылок из ${catalogResults.length} категорий`);
      console.log('═══════════════════════════════════════════════════════════════\n');

      // Шаг 2: Парсим детальную информацию о каждом товаре
      const ingredients = await parseAllProducts(catalogResults);

      // Шаг 3: Сохраняем результаты
      if (ingredients.length > 0) {
        saveIngredientsToFile(ingredients);
        
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('✅ ПАРСИНГ ЗАВЕРШЕН УСПЕШНО!');
        console.log('═══════════════════════════════════════════════════════════════\n');
        console.log('📋 СЛЕДУЮЩИЕ ШАГИ:\n');
        console.log('1. Откройте: scripts/parsed-catalog-ingredients.ts');
        console.log('2. Скопируйте массив PARSED_CATALOG_INGREDIENTS');
        console.log('3. Вставьте в: client/src/lib/alkoteka-wines-data.ts');
        console.log('4. Перезапустите сервер: npm run dev\n');
        
        process.exit(0);
      } else {
        console.error('❌ Не удалось спарсить ни одного товара');
        process.exit(1);
      }

    } catch (error: any) {
      console.error('\n💥 Фатальная ошибка:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  })();
}

export { CatalogProduct };
