import { parseAlkotekaProduct, convertToIngredient, formatIngredientForCode } from './parse-alkoteka-product.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Скрипт для пакетного парсинга множества товаров Alkoteka
 * 
 * Использование:
 * 1. Создайте файл urls.txt со списком URL (по одному на строку)
 * 2. Запустите: npm run parse:batch
 * 
 * Результат будет сохранен в parsed-ingredients.ts
 */

interface BatchResult {
  success: Array<{
    url: string;
    ingredient: any;
    code: string;
  }>;
  failed: Array<{
    url: string;
    error: string;
  }>;
}

/**
 * Парсит массив URL
 */
async function parseBatch(urls: string[]): Promise<BatchResult> {
  const result: BatchResult = {
    success: [],
    failed: []
  };

  console.log(`\n🚀 Начинаем парсинг ${urls.length} товаров...\n`);

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i].trim();
    
    if (!url || url.startsWith('#') || url.startsWith('//')) {
      continue; // Пропускаем комментарии и пустые строки
    }

    console.log(`\n[${ i + 1}/${urls.length}] 🔍 Парсинг: ${url}`);

    try {
      // Добавляем задержку между запросами (чтобы не нагружать сервер)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const parsed = await parseAlkotekaProduct(url);
      const ingredient = convertToIngredient(parsed);
      const code = formatIngredientForCode(ingredient);

      result.success.push({ url, ingredient, code });

      console.log(`✅ Успешно: ${parsed.name}`);
      
    } catch (error: any) {
      console.error(`❌ Ошибка: ${error.message}`);
      result.failed.push({ url, error: error.message });
    }
  }

  return result;
}

/**
 * Сохраняет результаты в файл
 */
function saveResults(result: BatchResult) {
  const outputPath = path.join(process.cwd(), 'scripts', 'parsed-ingredients.ts');
  
  let content = `import type { Ingredient } from '@shared/schema';\n\n`;
  content += `/**\n`;
  content += ` * Автоматически спарсенные ингредиенты из Alkoteka\n`;
  content += ` * Дата: ${new Date().toLocaleString('ru-RU')}\n`;
  content += ` * Успешно: ${result.success.length}\n`;
  content += ` * Ошибок: ${result.failed.length}\n`;
  content += ` */\n\n`;
  
  content += `export const PARSED_INGREDIENTS: Partial<Ingredient>[] = [\n`;
  
  result.success.forEach((item, index) => {
    content += item.code;
    if (index < result.success.length - 1) {
      content += ',\n';
    }
  });
  
  content += `\n];\n\n`;
  
  if (result.failed.length > 0) {
    content += `/**\n * ОШИБКИ ПАРСИНГА:\n`;
    result.failed.forEach(item => {
      content += ` * - ${item.url}\n`;
      content += ` *   ${item.error}\n`;
    });
    content += ` */\n`;
  }

  fs.writeFileSync(outputPath, content, 'utf-8');
  
  console.log(`\n📝 Результаты сохранены в: ${outputPath}`);
}

/**
 * Читает URL из файла или массива
 */
async function readUrls(): Promise<string[]> {
  const urlsFilePath = path.join(process.cwd(), 'scripts', 'urls.txt');
  
  // Если передан аргумент командной строки
  if (process.argv.length > 2) {
    const arg = process.argv[2];
    
    // Если это путь к файлу
    if (arg.endsWith('.txt')) {
      const filePath = path.isAbsolute(arg) ? arg : path.join(process.cwd(), arg);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return content.split('\n').map(line => line.trim()).filter(Boolean);
      }
    }
    
    // Иначе это одиночный URL
    return [arg];
  }
  
  // По умолчанию читаем из urls.txt
  if (fs.existsSync(urlsFilePath)) {
    const content = fs.readFileSync(urlsFilePath, 'utf-8');
    return content.split('\n').map(line => line.trim()).filter(Boolean);
  }
  
  throw new Error(`Файл ${urlsFilePath} не найден. Создайте его или передайте URL как аргумент.`);
}

/**
 * Создает шаблон файла urls.txt
 */
function createTemplateFile() {
  const templatePath = path.join(process.cwd(), 'scripts', 'urls.txt');
  
  if (!fs.existsSync(templatePath)) {
    const template = `# Список URL товаров Alkoteka для парсинга
# Добавьте по одному URL на строку
# Строки начинающиеся с # игнорируются

# Примеры:
# https://alkoteka.com/product/vino-igristoe/inkerman-muskat_15530
# https://alkoteka.com/product/vino-tikhoe/inkerman-vaynmeyker-s-selekshn-pino-nuar_51813

`;
    
    fs.writeFileSync(templatePath, template, 'utf-8');
    console.log(`📄 Создан шаблон: ${templatePath}`);
  }
}

// CLI
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;

if (isMainModule) {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   🍷 Пакетный парсер товаров Alkoteka');
  console.log('═══════════════════════════════════════════════════════\n');

  // Создаем шаблон если нужно
  createTemplateFile();

  readUrls()
    .then(async urls => {
      if (urls.length === 0) {
        console.error('❌ Не найдено URL для парсинга');
        console.log('\nИспользование:');
        console.log('  1. Добавьте URL в scripts/urls.txt (по одному на строку)');
        console.log('  2. Запустите: npm run parse:batch');
        console.log('\nИли передайте URL напрямую:');
        console.log('  npm run parse:batch "https://alkoteka.com/product/..."');
        process.exit(1);
      }

      const result = await parseBatch(urls);

      console.log('\n═══════════════════════════════════════════════════════');
      console.log('📊 РЕЗУЛЬТАТЫ:');
      console.log('═══════════════════════════════════════════════════════\n');
      console.log(`✅ Успешно спарсено: ${result.success.length}`);
      console.log(`❌ Ошибок: ${result.failed.length}`);
      
      if (result.failed.length > 0) {
        console.log('\n⚠️  Товары с ошибками:');
        result.failed.forEach(item => {
          console.log(`   - ${item.url}`);
          console.log(`     ${item.error}`);
        });
      }

      if (result.success.length > 0) {
        saveResults(result);
        
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('📋 СЛЕДУЮЩИЕ ШАГИ:');
        console.log('═══════════════════════════════════════════════════════\n');
        console.log('1. Откройте: scripts/parsed-ingredients.ts');
        console.log('2. Скопируйте содержимое массива PARSED_INGREDIENTS');
        console.log('3. Вставьте в: client/src/lib/alkoteka-wines-data.ts');
        console.log('4. Перезапустите сервер: npm run dev');
        console.log('');
      }

      process.exit(result.failed.length > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('\n💥 Фатальная ошибка:', error.message);
      process.exit(1);
    });
}

export { parseBatch, saveResults };
