import * as cheerio from 'cheerio';
import type { Ingredient } from '@shared/schema';

/**
 * Универсальный скрипт для парсинга товаров с alkoteka.com
 * 
 * Использование:
 * npm run parse:alkoteka "https://alkoteka.com/product/vino-igristoe/inkerman-muskat_15530"
 * 
 * Или из кода:
 * import { parseAlkotekaProduct } from './scripts/parse-alkoteka-product';
 * const ingredient = await parseAlkotekaProduct(url);
 */

interface ParsedProduct {
  name: string;
  price: number;
  volume: number;
  abv: number;
  url: string;
  category: string;
}

/**
 * Парсит страницу товара на alkoteka.com
 * @param url URL страницы товара
 * @returns Распарсенные данные товара
 */
export async function parseAlkotekaProduct(url: string): Promise<ParsedProduct> {
  try {
    console.log(`🔍 Парсинг: ${url}`);

    // Получаем HTML страницы
    const response = await fetch(url, {
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

    // Извлекаем категорию из URL
    const urlParts = url.split('/');
    const category = urlParts[urlParts.length - 2]; // например: "vino-igristoe"

    // Парсим название товара
    // Селекторы могут отличаться - нужно проверить на реальной странице
    let name = $('h1.product-title').text().trim() ||
                $('h1[itemprop="name"]').text().trim() ||
                $('.product-name').text().trim() ||
                $('h1').first().text().trim();

    if (!name) {
      throw new Error('Не удалось найти название товара');
    }

    // Парсим цену
    let priceText = $('.product-price').text().trim() ||
                    $('[itemprop="price"]').attr('content') ||
                    $('.price').text().trim();
    
    if (!priceText) {
      throw new Error('Не удалось найти цену товара');
    }

    // Извлекаем число из строки цены (например: "600 ₽" -> 600)
    const priceMatch = priceText.match(/(\d+[\s,]?\d*)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(/\s/g, '').replace(',', '.')) : 0;

    if (!price) {
      throw new Error(`Не удалось распарсить цену: ${priceText}`);
    }

    // Парсим объем
    let volumeText = $('.product-volume').text() ||
                     $('[itemprop="volume"]').text() ||
                     $('.volume').text() ||
                     name; // Иногда объем указан в названии

    // Извлекаем объем в мл (например: "750 мл" или "0.75 л")
    let volume = 750; // По умолчанию
    const volumeMlMatch = volumeText.match(/(\d+[\s,]?\d*)\s*мл/i);
    const volumeLMatch = volumeText.match(/(\d+[.,]?\d*)\s*л/i);

    if (volumeMlMatch) {
      volume = parseFloat(volumeMlMatch[1].replace(/\s/g, '').replace(',', '.'));
    } else if (volumeLMatch) {
      volume = parseFloat(volumeLMatch[1].replace(',', '.')) * 1000;
    }

    // Парсим крепость (ABV)
    let abvText = $('.product-abv').text() ||
                  $('[itemprop="alcoholByVolume"]').text() ||
                  $('.alcohol').text() ||
                  name + ' ' + $('.product-info').text(); // Крепость может быть в разных местах

    // Извлекаем крепость (например: "13%" или "13 %")
    const abvMatch = abvText.match(/(\d+[.,]?\d*)\s*%/);
    const abv = abvMatch ? parseFloat(abvMatch[1].replace(',', '.')) : 0;

    console.log(`✅ Название: ${name}`);
    console.log(`💰 Цена: ${price}₽`);
    console.log(`📏 Объем: ${volume}мл`);
    console.log(`🍷 Крепость: ${abv}%`);

    return {
      name,
      price,
      volume,
      abv,
      url,
      category
    };

  } catch (error) {
    console.error('❌ Ошибка парсинга:', error);
    throw error;
  }
}

/**
 * Преобразует распарсенные данные в формат Ingredient
 * @param parsed Распарсенные данные
 * @returns Объект ингредиента
 */
export function convertToIngredient(parsed: ParsedProduct): Partial<Ingredient> {
  // Рассчитываем цену за литр
  const pricePerLiter = Math.round((parsed.price / (parsed.volume / 1000)) * 100) / 100;

  // Определяем цвет в зависимости от категории и названия
  let color = "#F7E7CE"; // По умолчанию светлый
  const nameLower = parsed.name.toLowerCase();
  
  if (nameLower.includes('красн') || nameLower.includes('каберне') || nameLower.includes('мерло')) {
    color = "#722F37"; // Красное вино
  } else if (nameLower.includes('бел') || nameLower.includes('шардоне') || nameLower.includes('совиньон')) {
    color = "#F7E7CE"; // Белое вино
  } else if (nameLower.includes('роз')) {
    color = "#FFB6C1"; // Розовое
  } else if (nameLower.includes('портвейн') || nameLower.includes('херес') || nameLower.includes('мадер')) {
    color = "#8B4513"; // Крепленое
  }

  // Определяем вкусовой профиль (примерный, на основе типа)
  let tasteProfile = { sweet: 2, sour: 3, bitter: 1, alcohol: 3 };
  
  if (parsed.abv >= 16) {
    tasteProfile.alcohol = 5;
    tasteProfile.sweet = 7;
  } else if (nameLower.includes('брют') || nameLower.includes('сухое')) {
    tasteProfile.sweet = 1;
    tasteProfile.sour = 5;
  } else if (nameLower.includes('полусладкое') || nameLower.includes('десертн')) {
    tasteProfile.sweet = 7;
  }

  return {
    name: parsed.name,
    category: "alcohol",
    color,
    abv: parsed.abv,
    pricePerLiter,
    volume: parsed.volume,
    tasteProfile,
    unit: "ml",
    sourceUrl: parsed.url,
    sourceName: "Alkoteka",
    sourceIcon: "https://alkoteka.com/app/images/common/favicon.ico"
  };
}

/**
 * Форматирует ингредиент для вывода в консоль в формате TypeScript
 */
export function formatIngredientForCode(ingredient: Partial<Ingredient>): string {
  return `  {
    name: "${ingredient.name}",
    category: "${ingredient.category}",
    color: "${ingredient.color}",
    abv: ${ingredient.abv},
    pricePerLiter: ${ingredient.pricePerLiter}, // ${Math.round((ingredient.pricePerLiter! * (ingredient.volume! / 1000)) * 100) / 100}₽ за ${ingredient.volume}мл
    volume: ${ingredient.volume},
    tasteProfile: { sweet: ${ingredient.tasteProfile?.sweet}, sour: ${ingredient.tasteProfile?.sour}, bitter: ${ingredient.tasteProfile?.bitter}, alcohol: ${ingredient.tasteProfile?.alcohol} },
    unit: "${ingredient.unit}",
    sourceUrl: "${ingredient.sourceUrl}",
    sourceName: "${ingredient.sourceName}",
    sourceIcon: "${ingredient.sourceIcon}"
  }`;
}

// CLI интерфейс
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;

if (isMainModule) {
  const url = process.argv[2];

  if (!url) {
    console.error('❌ Ошибка: URL не указан');
    console.log('');
    console.log('Использование:');
    console.log('  npm run parse:alkoteka "https://alkoteka.com/product/..."');
    console.log('');
    console.log('Пример:');
    console.log('  npm run parse:alkoteka "https://alkoteka.com/product/vino-igristoe/inkerman-muskat_15530"');
    process.exit(1);
  }

  if (!url.includes('alkoteka.com/product/')) {
    console.error('❌ Ошибка: Неверный формат URL');
    console.log('URL должен быть в формате: https://alkoteka.com/product/{category}/{slug}_{id}');
    process.exit(1);
  }

  console.log('🚀 Запуск парсера Alkoteka...\n');

  parseAlkotekaProduct(url)
    .then(parsed => {
      const ingredient = convertToIngredient(parsed);
      
      console.log('\n📋 Результат парсинга:\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Скопируйте этот код в alkoteka-wines-data.ts:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log(formatIngredientForCode(ingredient));
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      console.log('✅ Парсинг завершен успешно!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Ошибка:', error.message);
      process.exit(1);
    });
}

export { ParsedProduct };
