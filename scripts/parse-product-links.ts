/**
 * Парсинг ПРАВИЛЬНЫХ ссылок на товары с Alkoteka.com
 * Используем Puppeteer для работы с динамическим контентом
 */

import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

interface ProductLink {
  catalogUrl: string;
  productUrl: string;
  title: string;
}

const CATEGORIES = [
  'https://alkoteka.com/catalog/krepkiy-alkogol/', // Крепкий алкоголь
  'https://alkoteka.com/catalog/shampanskoe-i-igristoe/', // Шампанское и игристое
];

async function parseProductLinks() {
  console.log('🚀 Запуск браузера...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // Показываем браузер для отладки
    defaultViewport: { width: 1280, height: 800 }
  });

  const allLinks: ProductLink[] = [];

  try {
    for (const categoryUrl of CATEGORIES) {
      console.log(`\n📂 Парсинг категории: ${categoryUrl}`);
      
      const page = await browser.newPage();
      await page.goto(categoryUrl, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Ждем загрузки товаров
      await page.waitForSelector('.product-card, .product-item, [class*="product"]', { timeout: 10000 });
      
      console.log('⏳ Ждем загрузки товаров (3 сек)...');
      await page.waitForTimeout(3000);
      
      // Ищем все ссылки на товары
      const links = await page.evaluate(() => {
        const productLinks: { href: string; title: string }[] = [];
        
        // Пробуем разные селекторы
        const selectors = [
          'a[href*="/product/"]',
          '.product-card a',
          '.product-item a',
          '[class*="product"] a[href*="/"]'
        ];
        
        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            const link = el as HTMLAnchorElement;
            if (link.href && link.href.includes('/product/')) {
              const title = link.textContent?.trim() || link.title || '';
              productLinks.push({
                href: link.href,
                title: title
              });
            }
          });
          
          if (productLinks.length > 0) {
            console.log(`Найдено ${productLinks.length} ссылок по селектору: ${selector}`);
            break;
          }
        }
        
        return productLinks;
      });
      
      console.log(`✅ Найдено ${links.length} ссылок на товары`);
      
      links.forEach(link => {
        allLinks.push({
          catalogUrl: categoryUrl,
          productUrl: link.href,
          title: link.title
        });
      });
      
      if (links.length > 0) {
        console.log('\n📋 Примеры найденных ссылок:');
        links.slice(0, 3).forEach(link => {
          console.log(`  ${link.title}`);
          console.log(`  → ${link.href}\n`);
        });
      } else {
        console.log('⚠️  Не найдено ссылок формата /product/');
        console.log('💡  Попробуем найти любые ссылки на странице...\n');
        
        // Показываем все ссылки для анализа
        const allPageLinks = await page.evaluate(() => {
          const links: string[] = [];
          document.querySelectorAll('a[href]').forEach(el => {
            const href = (el as HTMLAnchorElement).href;
            if (!links.includes(href)) {
              links.push(href);
            }
          });
          return links.slice(0, 20); // Первые 20 ссылок
        });
        
        console.log('🔍 Первые 20 ссылок на странице:');
        allPageLinks.forEach(link => console.log(`  ${link}`));
      }
      
      await page.close();
    }
    
    console.log(`\n\n📊 ИТОГО найдено: ${allLinks.length} ссылок на товары`);
    
    if (allLinks.length > 0) {
      // Сохраняем в JSON
      const outputPath = path.join(process.cwd(), 'scripts', 'product-links.json');
      fs.writeFileSync(outputPath, JSON.stringify(allLinks, null, 2), 'utf-8');
      console.log(`💾 Сохранено в: ${outputPath}`);
    }
    
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ Браузер закрыт');
  }
}

parseProductLinks();
