import * as cheerio from 'cheerio';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Типы для парсинга
interface ParsedIngredient {
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  volume: number; // в мл
  pricePerLiter: number;
  source: string;
  sourceIcon: string;
  abv?: number;
  color: string;
  tasteProfile: {
    sweet: number;
    sour: number;
    bitter: number;
    alcohol: number;
  };
  unit: string;
}

// Конфигурация сайтов для парсинга
const PARSING_SITES = {
  krasnoeibeloe: {
    name: 'Красное & Белое',
    icon: 'https://krasnoeibeloe.ru/favicon.ico',
    baseUrl: 'https://krasnoeibeloe.ru',
    categories: {
      vodka: '/catalog/vodka',
      whiskey: '/catalog/viski',
      gin: '/catalog/dzhin',
      rum: '/catalog/rom',
      tequila: '/catalog/tekila',
      brandy: '/catalog/konyak-brendi',
      liqueur: '/catalog/likery',
      vermouth: '/catalog/vermut',
      wine: '/catalog/vino',
      beer: '/catalog/pivo'
    }
  },
  lenta: {
    name: 'Лента',
    icon: 'https://lenta.com/favicon.ico',
    baseUrl: 'https://lenta.com',
    categories: {
      alcohol: '/catalog/alkogol-17036'
    }
  },
  alkoteka: {
    name: 'Алкотека',
    icon: 'https://alkoteka.com/favicon.ico',
    baseUrl: 'https://alkoteka.com',
    categories: {
      alcohol: '/catalog'
    }
  }
};

// Категории алкоголя с их характеристиками
const ALCOHOL_CATEGORIES = {
  vodka: {
    name: 'Водка',
    color: '#FFFFFF',
    abvRange: [38, 42],
    tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 }
  },
  whiskey: {
    name: 'Виски',
    color: '#D2691E',
    abvRange: [40, 50],
    tasteProfile: { sweet: 1, sour: 0, bitter: 4, alcohol: 9 }
  },
  gin: {
    name: 'Джин',
    color: '#F8F8FF',
    abvRange: [37, 47],
    tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 }
  },
  rum: {
    name: 'Ром',
    color: '#8B4513',
    abvRange: [35, 50],
    tasteProfile: { sweet: 3, sour: 0, bitter: 1, alcohol: 8 }
  },
  tequila: {
    name: 'Текила',
    color: '#F5F5DC',
    abvRange: [35, 40],
    tasteProfile: { sweet: 0, sour: 1, bitter: 2, alcohol: 8 }
  },
  brandy: {
    name: 'Бренди/Коньяк',
    color: '#8B4513',
    abvRange: [36, 45],
    tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 8 }
  },
  liqueur: {
    name: 'Ликёр',
    color: '#8B0000',
    abvRange: [15, 40],
    tasteProfile: { sweet: 8, sour: 1, bitter: 1, alcohol: 5 }
  },
  vermouth: {
    name: 'Вермут',
    color: '#8B4513',
    abvRange: [14, 22],
    tasteProfile: { sweet: 5, sour: 2, bitter: 4, alcohol: 4 }
  },
  wine_red: {
    name: 'Красное вино',
    color: '#722F37',
    abvRange: [11, 15],
    tasteProfile: { sweet: 2, sour: 3, bitter: 5, alcohol: 3 }
  },
  wine_white: {
    name: 'Белое вино',
    color: '#F7E7CE',
    abvRange: [10, 14],
    tasteProfile: { sweet: 3, sour: 4, bitter: 1, alcohol: 3 }
  },
  wine_rose: {
    name: 'Розовое вино',
    color: '#FFB6C1',
    abvRange: [10, 14],
    tasteProfile: { sweet: 4, sour: 3, bitter: 1, alcohol: 3 }
  },
  wine_sparkling: {
    name: 'Игристое вино',
    color: '#F7E7CE',
    abvRange: [10, 13],
    tasteProfile: { sweet: 4, sour: 5, bitter: 0, alcohol: 3 }
  },
  beer: {
    name: 'Пиво',
    color: '#FFD700',
    abvRange: [3, 12],
    tasteProfile: { sweet: 1, sour: 1, bitter: 6, alcohol: 2 }
  },
  absinthe: {
    name: 'Абсент',
    color: '#7CFC00',
    abvRange: [45, 75],
    tasteProfile: { sweet: 0, sour: 0, bitter: 8, alcohol: 10 }
  },
  calvados: {
    name: 'Кальвадос',
    color: '#D2691E',
    abvRange: [40, 45],
    tasteProfile: { sweet: 2, sour: 1, bitter: 2, alcohol: 8 }
  },
  grappa: {
    name: 'Граппа',
    color: '#FFFFFF',
    abvRange: [35, 60],
    tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 }
  }
};

// Утилиты для парсинга
class IngredientParser {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private extractPrice(priceText: string): number {
    const match = priceText.match(/(\d+(?:\s?\d+)*)/);
    return match ? parseInt(match[1].replace(/\s/g, '')) : 0;
  }

  private extractVolume(volumeText: string): number {
    const match = volumeText.match(/(\d+(?:\.\d+)?)\s*(мл|л|ml|l)/i);
    if (!match) return 500; // default 500ml
    
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    
    return unit === 'л' || unit === 'l' ? value * 1000 : value;
  }

  private categorizeIngredient(name: string): { category: string; subcategory?: string } {
    const lowerName = name.toLowerCase();
    
    // Определяем категорию по ключевым словам
    if (lowerName.includes('водка')) return { category: 'alcohol', subcategory: 'vodka' };
    if (lowerName.includes('виски') || lowerName.includes('whiskey')) return { category: 'alcohol', subcategory: 'whiskey' };
    if (lowerName.includes('джин') || lowerName.includes('gin')) return { category: 'alcohol', subcategory: 'gin' };
    if (lowerName.includes('ром') || lowerName.includes('rum')) return { category: 'alcohol', subcategory: 'rum' };
    if (lowerName.includes('текила') || lowerName.includes('tequila')) return { category: 'alcohol', subcategory: 'tequila' };
    if (lowerName.includes('коньяк') || lowerName.includes('бренди') || lowerName.includes('brandy')) return { category: 'alcohol', subcategory: 'brandy' };
    if (lowerName.includes('ликёр') || lowerName.includes('ликер') || lowerName.includes('liqueur')) return { category: 'alcohol', subcategory: 'liqueur' };
    if (lowerName.includes('вермут') || lowerName.includes('vermouth')) return { category: 'alcohol', subcategory: 'vermouth' };
    if (lowerName.includes('абсент')) return { category: 'alcohol', subcategory: 'absinthe' };
    if (lowerName.includes('кальвадос')) return { category: 'alcohol', subcategory: 'calvados' };
    if (lowerName.includes('граппа')) return { category: 'alcohol', subcategory: 'grappa' };
    if (lowerName.includes('пиво') || lowerName.includes('beer')) return { category: 'alcohol', subcategory: 'beer' };
    
    // Вино
    if (lowerName.includes('красное') && lowerName.includes('вино')) return { category: 'alcohol', subcategory: 'wine_red' };
    if (lowerName.includes('белое') && lowerName.includes('вино')) return { category: 'alcohol', subcategory: 'wine_white' };
    if (lowerName.includes('розовое') && lowerName.includes('вино')) return { category: 'alcohol', subcategory: 'wine_rose' };
    if (lowerName.includes('игристое') || lowerName.includes('шампанское')) return { category: 'alcohol', subcategory: 'wine_sparkling' };
    if (lowerName.includes('вино')) return { category: 'alcohol', subcategory: 'wine_red' }; // default wine
    
    return { category: 'alcohol', subcategory: 'vodka' }; // default
  }

  private getIngredientCharacteristics(subcategory: string): any {
    const categoryData = ALCOHOL_CATEGORIES[subcategory as keyof typeof ALCOHOL_CATEGORIES];
    if (!categoryData) return ALCOHOL_CATEGORIES.vodka;
    
    return {
      ...categoryData,
      abv: categoryData.abvRange[0] + Math.random() * (categoryData.abvRange[1] - categoryData.abvRange[0])
    };
  }

  async parseKrasnoeibeloe(category: string, limit: number = 50): Promise<ParsedIngredient[]> {
    const ingredients: ParsedIngredient[] = [];
    const site = PARSING_SITES.krasnoeibeloe;
    
    try {
      console.log(`Парсинг ${site.name} - категория: ${category}`);
      
      // Здесь был бы реальный парсинг, но для демонстрации создадим моковые данные
      // В реальном проекте здесь был бы код с cheerio для парсинга HTML
      
      const mockData = this.generateMockIngredients(site, category, limit);
      ingredients.push(...mockData);
      
      await this.delay(1000); // Задержка между запросами
      
    } catch (error) {
      console.error(`Ошибка парсинга ${site.name}:`, error);
    }
    
    return ingredients;
  }

  async parseLenta(limit: number = 50): Promise<ParsedIngredient[]> {
    const ingredients: ParsedIngredient[] = [];
    const site = PARSING_SITES.lenta;
    
    try {
      console.log(`Парсинг ${site.name}`);
      
      const mockData = this.generateMockIngredients(site, 'alcohol', limit);
      ingredients.push(...mockData);
      
      await this.delay(1000);
      
    } catch (error) {
      console.error(`Ошибка парсинга ${site.name}:`, error);
    }
    
    return ingredients;
  }

  async parseAlkoteka(limit: number = 50): Promise<ParsedIngredient[]> {
    const ingredients: ParsedIngredient[] = [];
    const site = PARSING_SITES.alkoteka;
    
    try {
      console.log(`Парсинг ${site.name}`);
      
      const mockData = this.generateMockIngredients(site, 'alcohol', limit);
      ingredients.push(...mockData);
      
      await this.delay(1000);
      
    } catch (error) {
      console.error(`Ошибка парсинга ${site.name}:`, error);
    }
    
    return ingredients;
  }

  // Генерация моковых данных для демонстрации
  private generateMockIngredients(site: any, category: string, limit: number): ParsedIngredient[] {
    const ingredients: ParsedIngredient[] = [];
    const subcategories = Object.keys(ALCOHOL_CATEGORIES);
    
    for (let i = 0; i < limit; i++) {
      const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
      const categoryData = ALCOHOL_CATEGORIES[subcategory as keyof typeof ALCOHOL_CATEGORIES];
      
      const volume = [500, 700, 750, 1000][Math.floor(Math.random() * 4)];
      const price = Math.floor(Math.random() * 3000) + 500;
      
      ingredients.push({
        name: `${categoryData.name} ${site.name} №${i + 1}`,
        category: 'alcohol',
        subcategory,
        price,
        volume,
        pricePerLiter: Math.round((price / volume) * 1000),
        source: site.name,
        sourceIcon: site.icon,
        abv: categoryData.abvRange[0] + Math.random() * (categoryData.abvRange[1] - categoryData.abvRange[0]),
        color: categoryData.color,
        tasteProfile: categoryData.tasteProfile,
        unit: 'ml'
      });
    }
    
    return ingredients;
  }

  async parseAllSites(): Promise<ParsedIngredient[]> {
    const allIngredients: ParsedIngredient[] = [];
    
    // Парсим каждый сайт
    const krasnoeibeloeIngredients = await this.parseKrasnoeibeloe('alcohol', 50);
    const lentaIngredients = await this.parseLenta(50);
    const alkotekaIngredients = await this.parseAlkoteka(50);
    
    allIngredients.push(...krasnoeibeloeIngredients);
    allIngredients.push(...lentaIngredients);
    allIngredients.push(...alkotekaIngredients);
    
    return allIngredients;
  }

  saveToFile(ingredients: ParsedIngredient[], filename: string): void {
    const outputPath = path.join(__dirname, '..', 'data', filename);
    
    // Создаем директорию если не существует
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(ingredients, null, 2));
    console.log(`Сохранено ${ingredients.length} ингредиентов в ${outputPath}`);
  }
}

// Основная функция
async function main() {
  const parser = new IngredientParser();
  
  console.log('🚀 Начинаем парсинг ингредиентов...');
  
  try {
    const ingredients = await parser.parseAllSites();
    
    console.log(`✅ Спарсено ${ingredients.length} ингредиентов`);
    
    // Сохраняем в файл
    parser.saveToFile(ingredients, 'parsed-ingredients.json');
    
    // Группируем по категориям для статистики
    const stats = ingredients.reduce((acc, ing) => {
      const key = ing.subcategory || ing.category;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📊 Статистика по категориям:');
    Object.entries(stats).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} шт.`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при парсинге:', error);
  }
}

// Запуск если файл выполняется напрямую
if (require.main === module) {
  main();
}

export { IngredientParser, ParsedIngredient, ALCOHOL_CATEGORIES };
