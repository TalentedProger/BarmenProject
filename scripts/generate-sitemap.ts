/**
 * Скрипт для генерации sitemap.xml на основе данных из базы
 * Следует лучшим практикам SEO и стандартам sitemap protocol
 */

import { storage } from '../server/storage';
import * as fs from 'fs';
import * as path from 'path';

// Конфигурация сайта
const SITE_URL = 'https://cocktailomaker.ru';
const SITEMAP_OUTPUT = path.join(process.cwd(), 'client/public/sitemap.xml');
const SITEMAP_INDEX_OUTPUT = path.join(process.cwd(), 'client/public/sitemap-index.xml');

// Статические страницы с приоритетами
const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/constructor', priority: '0.95', changefreq: 'weekly' },
  { url: '/generator', priority: '0.95', changefreq: 'weekly' },
  { url: '/catalog', priority: '0.9', changefreq: 'daily' },
  { url: '/courses', priority: '0.85', changefreq: 'weekly' },
  { url: '/course/mixology-basics', priority: '0.8', changefreq: 'monthly' },
  { url: '/favorites', priority: '0.7', changefreq: 'weekly' },
  { url: '/home', priority: '0.7', changefreq: 'daily' },
];

// Модули курса
const COURSE_MODULES = Array.from({ length: 12 }, (_, i) => ({
  url: `/course/mixology-basics/module/${i + 1}`,
  priority: '0.75',
  changefreq: 'monthly'
}));

// Исключенные URL (не для индексации)
const EXCLUDED_PATTERNS = [
  /^\/admin/,
  /^\/auth/,
  /^\/api\//,
  /^\/profile/,
  /^\/user-recipe\//,
  /\?.*/, // параметры запроса
  /#.*/, // якоря
];

/**
 * Проверяет, должен ли URL быть исключен из sitemap
 */
function shouldExcludeUrl(url: string): boolean {
  return EXCLUDED_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * Форматирует дату в ISO 8601 для lastmod
 */
function formatDate(date: Date | string | null): string {
  if (!date) {
    return new Date().toISOString().split('T')[0];
  }
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * Создает XML для одного URL
 */
function createUrlXml(
  loc: string, 
  lastmod?: string, 
  priority?: string, 
  changefreq?: string,
  image?: { loc: string; title?: string; caption?: string }
): string {
  let xml = '  <url>\n';
  xml += `    <loc>${SITE_URL}${loc}</loc>\n`;
  
  if (lastmod) {
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
  }
  
  if (priority) {
    xml += `    <priority>${priority}</priority>\n`;
  }
  
  if (changefreq) {
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
  }
  
  if (image) {
    xml += '    <image:image>\n';
    xml += `      <image:loc>${image.loc}</image:loc>\n`;
    if (image.title) {
      xml += `      <image:title>${escapeXml(image.title)}</image:title>\n`;
    }
    if (image.caption) {
      xml += `      <image:caption>${escapeXml(image.caption)}</image:caption>\n`;
    }
    xml += '    </image:image>\n';
  }
  
  xml += '  </url>\n';
  return xml;
}

/**
 * Экранирует специальные символы для XML
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Генерирует sitemap для статических страниц
 */
async function generateStaticSitemap(): Promise<string> {
  let xml = '';
  const today = formatDate(new Date());
  
  // Главная страница с изображением
  xml += createUrlXml(
    '/',
    today,
    '1.0',
    'daily',
    {
      loc: `${SITE_URL}/og-image.png`,
      title: 'Cocktailo Maker - конструктор коктейлей',
      caption: 'Бесплатный онлайн конструктор рецептов коктейлей'
    }
  );
  
  // Остальные статические страницы
  for (const page of STATIC_PAGES.slice(1)) {
    if (!shouldExcludeUrl(page.url)) {
      xml += createUrlXml(page.url, today, page.priority, page.changefreq);
    }
  }
  
  // Модули курса
  for (const module of COURSE_MODULES) {
    xml += createUrlXml(module.url, today, module.priority, module.changefreq);
  }
  
  return xml;
}

/**
 * Генерирует sitemap для рецептов
 */
async function generateRecipesSitemap(): Promise<string> {
  let xml = '';
  
  try {
    // Получаем все публичные рецепты
    const recipes = await storage.getRecipes(10000, 0);
    
    console.log(`✓ Найдено ${recipes.length} публичных рецептов`);
    
    for (const recipe of recipes) {
      if (!recipe.isPublic) continue;
      
      const recipeUrl = `/recipe/${recipe.id}`;
      
      // Пропускаем исключенные URL
      if (shouldExcludeUrl(recipeUrl)) continue;
      
      const lastmod = formatDate(recipe.updatedAt);
      
      xml += createUrlXml(
        recipeUrl,
        lastmod,
        '0.8',
        'weekly'
      );
    }
    
    console.log(`✓ Добавлено ${recipes.length} рецептов в sitemap`);
  } catch (error) {
    console.error('Ошибка при получении рецептов:', error);
  }
  
  return xml;
}

/**
 * Генерирует основной sitemap.xml
 */
async function generateMainSitemap() {
  console.log('🚀 Генерация sitemap.xml...\n');
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n';
  
  // Добавляем комментарий
  xml += '  <!-- Статические страницы -->\n';
  xml += await generateStaticSitemap();
  
  xml += '\n  <!-- Рецепты коктейлей -->\n';
  xml += await generateRecipesSitemap();
  
  xml += '</urlset>\n';
  
  // Записываем файл
  fs.writeFileSync(SITEMAP_OUTPUT, xml, 'utf-8');
  console.log(`\n✅ Sitemap успешно создан: ${SITEMAP_OUTPUT}`);
  
  // Проверяем размер файла
  const stats = fs.statSync(SITEMAP_OUTPUT);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`📊 Размер файла: ${sizeMB} MB`);
  
  // Подсчитываем количество URL
  const urlCount = (xml.match(/<url>/g) || []).length;
  console.log(`📝 Количество URL: ${urlCount}`);
  
  if (urlCount > 50000) {
    console.warn('⚠️  ВНИМАНИЕ: Количество URL превышает 50 000. Рекомендуется создать sitemap index.');
  }
  
  if (stats.size > 50 * 1024 * 1024) {
    console.warn('⚠️  ВНИМАНИЕ: Размер файла превышает 50 MB. Необходимо создать sitemap index.');
  }
  
  return { urlCount, sizeMB };
}

/**
 * Основная функция
 */
async function main() {
  try {
    await generateMainSitemap();
    
    console.log('\n📋 Следующие шаги:');
    console.log('1. Проверьте sitemap.xml на валидность');
    console.log('2. Убедитесь, что robots.txt содержит: Sitemap: https://cocktailomaker.ru/sitemap.xml');
    console.log('3. Отправьте sitemap в Google Search Console и Яндекс.Вебмастер');
    console.log('4. Настройте автоматическую генерацию при изменении контента\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при генерации sitemap:', error);
    process.exit(1);
  }
}

// Запускаем генерацию
main();
