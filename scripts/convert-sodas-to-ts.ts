/**
 * Конвертация собранных данных о газировках в TypeScript
 * 
 * Использование:
 * 1. Вручную соберите данные в scripts/sodas-data.json
 * 2. Запустите: npx tsx scripts/convert-sodas-to-ts.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawSoda {
  name: string;
  country: string;
  volume: string; // "0.3 л" или "300 мл"
  url: string;
  price: number;
}

interface ProcessedSoda {
  name: string;
  category: string;
  color: string;
  abv: number;
  pricePerLiter: number;
  volume: number;
  tasteProfile: {
    sweet: number;
    sour: number;
    bitter: number;
    alcohol: number;
  };
  unit: string;
  sourceUrl: string;
  sourceName: string;
  sourceIcon: string;
}

function parseVolume(volumeText: string): number {
  const match = volumeText.match(/(\d+(?:\.\d+)?)\s*(л|мл)/i);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  
  return unit === 'л' ? value * 1000 : value;
}

function detectSodaType(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('кола') || nameLower.includes('cola')) return 'Кола';
  if (nameLower.includes('лимон') && nameLower.includes('лайм')) return 'Лимон-Лайм';
  if (nameLower.includes('апельсин') || nameLower.includes('orange')) return 'Апельсиновая';
  if (nameLower.includes('лимонад')) return 'Лимонад';
  if (nameLower.includes('цитрус')) return 'Цитрус';
  if (nameLower.includes('милкис')) return 'Фруктовая';
  if (nameLower.includes('banana') || nameLower.includes('банан')) return 'Фруктовая';
  
  return 'Фруктовая';
}

function getTasteProfile(type: string): { sweet: number; sour: number; bitter: number; alcohol: number } {
  const profiles: Record<string, any> = {
    'Кола': { sweet: 6, sour: 1, bitter: 0, alcohol: 0 },
    'Лимонад': { sweet: 5, sour: 4, bitter: 0, alcohol: 0 },
    'Апельсиновая': { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
    'Лимон-Лайм': { sweet: 4, sour: 5, bitter: 0, alcohol: 0 },
    'Цитрус': { sweet: 5, sour: 5, bitter: 0, alcohol: 0 },
    'Фруктовая': { sweet: 6, sour: 3, bitter: 0, alcohol: 0 }
  };
  
  return profiles[type] || { sweet: 5, sour: 3, bitter: 0, alcohol: 0 };
}

function cleanProductName(name: string, type: string, volumeMl: number): string {
  // Удаляем лишние слова
  let cleaned = name
    .replace(/Газ\.вода|Газированный напиток|Напиток|напиток|б\/а|б\.а\.|ст|пэт|ж\/б/gi, '')
    .trim();
  
  // Извлекаем бренд
  const brandMatch = cleaned.match(/(Добрый|Экспорт.*?Стаил|Fresh\s*Bar|Любимая|Милкис)/i);
  const brand = brandMatch ? brandMatch[1].trim() : cleaned.split(' ')[0];
  
  // Формат: ТИП БРЕНД ОБЪЕМл
  const volumeText = volumeMl >= 1000 ? `${volumeMl / 1000}л` : `${volumeMl}мл`;
  return `${type} ${brand} ${volumeText}`;
}

async function convertSodas() {
  console.log('🔄 Конвертация данных о газировках...\n');
  
  const inputPath = path.join(process.cwd(), 'scripts', 'sodas-data.json');
  
  if (!fs.existsSync(inputPath)) {
    console.error('❌ Файл не найден: scripts/sodas-data.json');
    console.log('\n💡 Создайте файл с данными в формате:');
    console.log(`
[
  {
    "name": "Газ.вода Добрый кола пэт",
    "country": "Россия",
    "volume": "0.3 л",
    "url": "https://krasnoeibeloe.ru/...",
    "price": 45
  }
]
`);
    return;
  }
  
  const rawData: RawSoda[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  console.log(`📊 Загружено товаров: ${rawData.length}\n`);
  
  const processed: ProcessedSoda[] = rawData.map(item => {
    const volumeMl = parseVolume(item.volume);
    const type = detectSodaType(item.name);
    const cleanName = cleanProductName(item.name, type, volumeMl);
    const pricePerLiter = volumeMl > 0 ? Math.round((item.price / volumeMl) * 1000) : 0;
    
    console.log(`✅ ${item.name}`);
    console.log(`   → ${cleanName}`);
    console.log(`   Тип: ${type}, Объем: ${volumeMl}мл, Цена/л: ${pricePerLiter}₽\n`);
    
    return {
      name: cleanName,
      category: 'soda',
      color: '#00BFFF',
      abv: 0,
      pricePerLiter,
      volume: volumeMl,
      tasteProfile: getTasteProfile(type),
      unit: 'ml',
      sourceUrl: item.url,
      sourceName: 'Красное&Белое',
      sourceIcon: 'https://krasnoeibeloe.ru/favicon.ico'
    };
  });
  
  // Генерируем TypeScript файл
  const tsCode = `import type { Ingredient } from "@shared/schema";

/**
 * Газированные напитки с krasnoeibeloe.ru
 * Данные собраны вручную (${new Date().toLocaleDateString('ru-RU')})
 * Всего товаров: ${processed.length}
 */

export const KRASNOEIBELOE_SODAS: Partial<Ingredient>[] = [
${processed.map(item => `  {
    name: "${item.name}",
    category: "soda",
    color: "${item.color}",
    abv: ${item.abv},
    pricePerLiter: ${item.pricePerLiter},
    volume: ${item.volume},
    tasteProfile: ${JSON.stringify(item.tasteProfile)},
    unit: "${item.unit}",
    sourceUrl: "${item.sourceUrl}",
    sourceName: "${item.sourceName}",
    sourceIcon: "${item.sourceIcon}"
  }`).join(',\n')}
];
`;
  
  const outputPath = path.join(process.cwd(), 'client', 'src', 'lib', 'krasnoeibeloe-sodas.ts');
  fs.writeFileSync(outputPath, tsCode, 'utf-8');
  
  console.log(`\n✅ TypeScript файл создан: ${outputPath}`);
  console.log(`\n📊 СТАТИСТИКА:`);
  console.log(`   Всего товаров: ${processed.length}`);
  console.log(`   Средняя цена/л: ${Math.round(processed.reduce((s, p) => s + p.pricePerLiter, 0) / processed.length)}₽`);
  
  const typeGroups = processed.reduce((acc, p) => {
    const type = detectSodaType(p.name);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log(`\n   По типам:`);
  Object.entries(typeGroups).forEach(([type, count]) => {
    console.log(`     ${type}: ${count}`);
  });
  
  console.log(`\n✅ Готово! Теперь добавьте импорт в ingredients-data.ts:`);
  console.log(`\n   import { KRASNOEIBELOE_SODAS } from "./krasnoeibeloe-sodas";`);
  console.log(`   ...KRASNOEIBELOE_SODAS,\n`);
}

convertSodas();
