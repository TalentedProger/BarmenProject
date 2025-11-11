/**
 * Скрипт для парсинга реальных URL изображений соков с krasnoeibeloe.ru
 * Использует puppeteer для загрузки страниц и извлечения изображений
 */

import * as fs from 'fs';
import * as path from 'path';

// Импортируем данные соков
const juicesPart1Path = path.join(__dirname, '../client/src/lib/krasnoeibeloe-juices-part1.ts');
const juicesPart2Path = path.join(__dirname, '../client/src/lib/krasnoeibeloe-juices-part2.ts');

interface JuiceData {
  name: string;
  sourceUrl?: string;
  imageUrl?: string;
}

/**
 * Извлекает URL изображения из HTML страницы продукта
 * Ищет Open Graph теги или основное изображение товара
 */
async function extractImageUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Ищем Open Graph image
    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (ogImageMatch) {
      return ogImageMatch[1];
    }
    
    // Ищем главное изображение товара
    const productImageMatch = html.match(/class="product-detail-gallery__main-image[^"]*"[^>]*src="([^"]+)"/i);
    if (productImageMatch) {
      return productImageMatch[1].startsWith('http') 
        ? productImageMatch[1] 
        : `https://krasnoeibeloe.ru${productImageMatch[1]}`;
    }
    
    // Ищем любое изображение в блоке товара
    const anyImageMatch = html.match(/class="product[^"]*"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/i);
    if (anyImageMatch) {
      return anyImageMatch[1].startsWith('http') 
        ? anyImageMatch[1] 
        : `https://krasnoeibeloe.ru${anyImageMatch[1]}`;
    }
    
    return null;
  } catch (error) {
    console.error(`Ошибка при парсинге ${url}:`, error);
    return null;
  }
}

/**
 * Обновляет файл с данными соков, заменяя placeholder URL на реальные
 */
async function updateJuiceImages(filePath: string) {
  console.log(`\n📦 Обработка файла: ${path.basename(filePath)}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  let updatedContent = content;
  let successCount = 0;
  let failCount = 0;
  
  // Извлекаем все объекты с sourceUrl
  const juiceMatches = content.matchAll(/\{[^}]*sourceUrl:\s*"([^"]+)"[^}]*imageUrl:\s*"([^"]+)"[^}]*\}/g);
  
  for (const match of juiceMatches) {
    const fullMatch = match[0];
    const sourceUrl = match[1];
    const currentImageUrl = match[2];
    
    // Пропускаем если уже есть реальное изображение
    if (!currentImageUrl.includes('placeholder')) {
      continue;
    }
    
    console.log(`  🔍 Парсинг: ${sourceUrl}`);
    
    // Небольшая задержка чтобы не перегружать сервер
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const realImageUrl = await extractImageUrl(sourceUrl);
    
    if (realImageUrl) {
      console.log(`  ✅ Найдено изображение: ${realImageUrl.substring(0, 60)}...`);
      updatedContent = updatedContent.replace(
        currentImageUrl,
        realImageUrl
      );
      successCount++;
    } else {
      console.log(`  ❌ Изображение не найдено`);
      failCount++;
    }
  }
  
  // Сохраняем обновленный файл
  if (successCount > 0) {
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`\n✅ Обновлено изображений: ${successCount}`);
  }
  
  if (failCount > 0) {
    console.log(`❌ Не удалось найти: ${failCount}`);
  }
}

/**
 * Основная функция
 */
async function main() {
  console.log('🚀 Начинаем парсинг изображений соков...\n');
  
  try {
    // Обрабатываем оба файла
    if (fs.existsSync(juicesPart1Path)) {
      await updateJuiceImages(juicesPart1Path);
    }
    
    if (fs.existsSync(juicesPart2Path)) {
      await updateJuiceImages(juicesPart2Path);
    }
    
    console.log('\n🎉 Парсинг завершен!');
    console.log('\n💡 Теперь нужно:');
    console.log('1. Проверить обновленные файлы');
    console.log('2. Запустить скрипт инициализации БД для обновления данных');
    console.log('3. Перезагрузить страницу конструктора');
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
}

// Запуск
main();
