/**
 * Парсинг газированных напитков с krasnoeibeloe.ru
 */

import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

interface SodaProduct {
  name: string;
  country: string;
  volume: number; // в мл
  volumeText: string; // оригинальный текст
  price: number;
  pricePerLiter: number;
  url: string;
  category: string;
}

const CATALOG_URL = 'https://krasnoeibeloe.ru/catalog/soki-i-nektary/?form_id=catalog_filter_form&cat_subsect%5B0%5D=714&arrFilter_100_MIN=0.2&arrFilter_100_MAX=2&filter_search=&set_filter=Y&';
const SITE_ICON = 'https://krasnoeibeloe.ru/favicon.ico';

async function parseSodas() {
  console.log('🚀 Запуск парсера газированных напитков...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const products: SodaProduct[] = [];

  try {
    const page = await browser.newPage();
    
    console.log('📂 Открываем каталог...');
    await page.goto(CATALOG_URL, { 
      waitUntil: 'networkidle0', 
      timeout: 60000 
    });
    
    // Ждем загрузки товаров
    console.log('⏳ Ждем загрузки товаров...');
    await page.waitForSelector('a[href*="/gazirovannaya-voda/"]', { timeout: 15000 });
    await page.waitForTimeout(3000);
    
    console.log('✅ Товары загружены\n');
    
    // Извлекаем данные о товарах
    const productData = await page.evaluate(() => {
      const items: any[] = [];
      
      // Ищем все ссылки на газированные напитки
      const productLinks = document.querySelectorAll('a[href*="/gazirovannaya-voda/"]');
      
      productLinks.forEach(link => {
        const anchor = link as HTMLAnchorElement;
        const href = anchor.href;
        
        // Пропускаем дубликаты
        if (items.some(item => item.url === href)) {
          return;
        }
        
        // Получаем название товара
        const name = anchor.textContent?.trim() || '';
        
        // Ищем информацию о стране и объеме (обычно в следующем элементе)
        let country = 'Россия';
        let volumeText = '';
        
        const parent = anchor.closest('.catalog-item, .product-item, [class*="item"]');
        if (parent) {
          const infoText = parent.textContent || '';
          
          // Извлекаем страну и объем
          const countryMatch = infoText.match(/(Россия|Корея|США|Германия|Франция|Италия)/);
          if (countryMatch) {
            country = countryMatch[1];
          }
          
          const volumeMatch = infoText.match(/(\d+(?:\.\d+)?)\s*(л|мл)/i);
          if (volumeMatch) {
            volumeText = volumeMatch[0];
          }
          
          // Ищем цену
          const priceElement = parent.querySelector('[class*="price"]');
          const priceText = priceElement?.textContent || '';
          
          items.push({
            name,
            country,
            volumeText,
            url: href,
            priceText
          });
        }
      });
      
      return items;
    });
    
    console.log(`📊 Найдено товаров: ${productData.length}\n`);
    
    // Обрабатываем каждый товар
    for (let i = 0; i < productData.length; i++) {
      const item = productData[i];
      
      console.log(`${i + 1}. ${item.name}`);
      console.log(`   Страна: ${item.country}`);
      console.log(`   Объем: ${item.volumeText}`);
      console.log(`   URL: ${item.url}`);
      
      // Переходим на страницу товара для получения точной цены
      try {
        await page.goto(item.url, { waitUntil: 'networkidle0', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        // Извлекаем детальную информацию
        const details = await page.evaluate(() => {
          // Ищем цену
          let price = 0;
          const priceSelectors = [
            '[class*="price"]',
            '[itemprop="price"]',
            '.product-price',
            '[data-price]'
          ];
          
          for (const selector of priceSelectors) {
            const priceElement = document.querySelector(selector);
            if (priceElement) {
              const priceText = priceElement.textContent || priceElement.getAttribute('content') || '';
              const priceMatch = priceText.match(/(\d+(?:\.\d+)?)/);
              if (priceMatch) {
                price = parseFloat(priceMatch[1]);
                break;
              }
            }
          }
          
          // Ищем точный объем
          let volume = '';
          const volumeElement = document.querySelector('[itemprop="volume"], [class*="volume"]');
          if (volumeElement) {
            volume = volumeElement.textContent || '';
          } else {
            // Ищем в описании
            const description = document.body.textContent || '';
            const volumeMatch = description.match(/(\d+(?:\.\d+)?)\s*(л|мл)/i);
            if (volumeMatch) {
              volume = volumeMatch[0];
            }
          }
          
          return { price, volume };
        });
        
        // Парсим объем
        let volumeMl = 0;
        let finalVolumeText = details.volume || item.volumeText;
        
        const volumeMatch = finalVolumeText.match(/(\d+(?:\.\d+)?)\s*(л|мл)/i);
        if (volumeMatch) {
          const value = parseFloat(volumeMatch[1]);
          const unit = volumeMatch[2].toLowerCase();
          volumeMl = unit === 'л' ? value * 1000 : value;
        }
        
        // Рассчитываем цену за литр
        const pricePerLiter = volumeMl > 0 ? Math.round((details.price / volumeMl) * 1000) : 0;
        
        console.log(`   Цена: ${details.price} ₽`);
        console.log(`   Цена/л: ${pricePerLiter} ₽/л\n`);
        
        products.push({
          name: item.name,
          country: item.country,
          volume: volumeMl,
          volumeText: finalVolumeText,
          price: details.price,
          pricePerLiter,
          url: item.url,
          category: 'soda'
        });
        
      } catch (error: any) {
        console.error(`   ❌ Ошибка при парсинге: ${error.message}\n`);
      }
      
      // Небольшая задержка между запросами
      await page.waitForTimeout(1000);
    }
    
    console.log(`\n✅ Успешно спарсено: ${products.length} товаров\n`);
    
    // Сохраняем в JSON
    const outputPath = path.join(process.cwd(), 'scripts', 'krasnoeibeloe-sodas.json');
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`💾 Данные сохранены: ${outputPath}\n`);
    
    // Генерируем TypeScript код для копирования
    console.log('📝 Генерация TypeScript кода...\n');
    generateTypeScriptCode(products);
    
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await browser.close();
    console.log('✅ Парсинг завершен');
  }
}

function generateTypeScriptCode(products: SodaProduct[]) {
  const tsCode = `import type { Ingredient } from "@shared/schema";

/**
 * Газированные напитки с krasnoeibeloe.ru
 * Данные собраны автоматически (${new Date().toLocaleDateString('ru-RU')})
 */

export const KRASNOEIBELOE_SODAS: Partial<Ingredient>[] = [
${products.map(p => `  {
    name: "${p.name}",
    category: "soda",
    color: "#00BFFF", // DeepSkyBlue
    abv: 0, // безалкогольный
    pricePerLiter: ${p.pricePerLiter},
    volume: ${p.volume},
    tasteProfile: { sweet: 5, sour: 2, bitter: 0, alcohol: 0 },
    unit: "ml",
    sourceUrl: "${p.url}",
    sourceName: "Красное&Белое",
    sourceIcon: "${SITE_ICON}"
  }`).join(',\n')}
];
`;

  const outputPath = path.join(process.cwd(), 'client', 'src', 'lib', 'krasnoeibeloe-sodas.ts');
  fs.writeFileSync(outputPath, tsCode, 'utf-8');
  console.log(`✅ TypeScript файл создан: ${outputPath}\n`);
  
  // Показываем статистику
  console.log('📊 СТАТИСТИКА:\n');
  console.log(`Всего товаров: ${products.length}`);
  console.log(`Средняя цена: ${Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)} ₽`);
  console.log(`Средняя цена/л: ${Math.round(products.reduce((sum, p) => sum + p.pricePerLiter, 0) / products.length)} ₽/л`);
  
  const volumeGroups = products.reduce((acc, p) => {
    const key = p.volumeText;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\nОбъемы:');
  Object.entries(volumeGroups).forEach(([vol, count]) => {
    console.log(`  ${vol}: ${count} товаров`);
  });
}

parseSodas();
