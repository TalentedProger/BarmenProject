import type { Ingredient } from "@shared/schema";
import { ALKOTEKA_WINES } from "./alkoteka-wines-data";

// Расширенный список ингредиентов с новыми категориями алкоголя
export const EXTENDED_INGREDIENTS: Partial<Ingredient>[] = [
  // === ВОДКА ===
  {
    name: "Водка Русский Стандарт",
    category: "alcohol",
    color: "#FFFFFF",
    abv: 40,
    pricePerLiter: 1200,
    tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 },
    unit: "ml"
  },
  {
    name: "Водка Белуга",
    category: "alcohol",
    color: "#FFFFFF",
    abv: 40,
    pricePerLiter: 2500,
    tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 },
    unit: "ml"
  },
  {
    name: "Водка Хортица",
    category: "alcohol",
    color: "#FFFFFF",
    abv: 40,
    pricePerLiter: 800,
    tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 },
    unit: "ml"
  },

  // === ВИСКИ ===
  {
    name: "Джек Дэниэлс",
    category: "alcohol",
    color: "#D2691E",
    abv: 40,
    pricePerLiter: 3500,
    tasteProfile: { sweet: 2, sour: 0, bitter: 4, alcohol: 9 },
    unit: "ml"
  },
  {
    name: "Джеймсон",
    category: "alcohol",
    color: "#DAA520",
    abv: 40,
    pricePerLiter: 2800,
    tasteProfile: { sweet: 1, sour: 0, bitter: 3, alcohol: 9 },
    unit: "ml"
  },
  {
    name: "Баллантайнс",
    category: "alcohol",
    color: "#CD853F",
    abv: 40,
    pricePerLiter: 2200,
    tasteProfile: { sweet: 1, sour: 0, bitter: 4, alcohol: 9 },
    unit: "ml"
  },
  {
    name: "Чивас Ригал",
    category: "alcohol",
    color: "#B8860B",
    abv: 40,
    pricePerLiter: 4500,
    tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 9 },
    unit: "ml"
  },

  // === ДЖИН ===
  {
    name: "Бомбей Сапфир",
    category: "alcohol",
    color: "#F0F8FF",
    abv: 47,
    pricePerLiter: 2800,
    tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 },
    unit: "ml"
  },
  {
    name: "Танкерей",
    category: "alcohol",
    color: "#F8F8FF",
    abv: 43,
    pricePerLiter: 2500,
    tasteProfile: { sweet: 0, sour: 0, bitter: 4, alcohol: 9 },
    unit: "ml"
  },
  {
    name: "Бифитер",
    category: "alcohol",
    color: "#F5F5F5",
    abv: 40,
    pricePerLiter: 1800,
    tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 },
    unit: "ml"
  },

  // === РОМ ===
  {
    name: "Бакарди Белый",
    category: "alcohol",
    color: "#FFFACD",
    abv: 40,
    pricePerLiter: 1800,
    tasteProfile: { sweet: 2, sour: 0, bitter: 0, alcohol: 8 },
    unit: "ml"
  },
  {
    name: "Капитан Морган",
    category: "alcohol",
    color: "#8B4513",
    abv: 35,
    pricePerLiter: 2200,
    tasteProfile: { sweet: 4, sour: 0, bitter: 1, alcohol: 7 },
    unit: "ml"
  },
  {
    name: "Хавана Клуб",
    category: "alcohol",
    color: "#D2691E",
    abv: 40,
    pricePerLiter: 2500,
    tasteProfile: { sweet: 3, sour: 0, bitter: 1, alcohol: 8 },
    unit: "ml"
  },

  // === ТЕКИЛА ===
  {
    name: "Хосе Куэрво",
    category: "alcohol",
    color: "#F5F5DC",
    abv: 38,
    pricePerLiter: 2000,
    tasteProfile: { sweet: 0, sour: 1, bitter: 2, alcohol: 8 },
    unit: "ml"
  },
  {
    name: "Сауза",
    category: "alcohol",
    color: "#F5DEB3",
    abv: 38,
    pricePerLiter: 1800,
    tasteProfile: { sweet: 0, sour: 1, bitter: 2, alcohol: 8 },
    unit: "ml"
  },
  {
    name: "Патрон",
    category: "alcohol",
    color: "#FFFAF0",
    abv: 40,
    pricePerLiter: 5500,
    tasteProfile: { sweet: 1, sour: 1, bitter: 1, alcohol: 8 },
    unit: "ml"
  },

  // === КОНЬЯК/БРЕНДИ ===
  {
    name: "Хеннесси VS",
    category: "alcohol",
    color: "#8B4513",
    abv: 40,
    pricePerLiter: 4500,
    tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 8 },
    unit: "ml"
  },
  {
    name: "Мартель VS",
    category: "alcohol",
    color: "#A0522D",
    abv: 40,
    pricePerLiter: 3800,
    tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 8 },
    unit: "ml"
  },
  {
    name: "Арарат 5 звезд",
    category: "alcohol",
    color: "#8B4513",
    abv: 40,
    pricePerLiter: 1800,
    tasteProfile: { sweet: 2, sour: 0, bitter: 3, alcohol: 8 },
    unit: "ml"
  },

  // === ЛИКЁРЫ ===
  {
    name: "Амаретто Дисаронно",
    category: "alcohol",
    color: "#8B4513",
    abv: 28,
    pricePerLiter: 2800,
    tasteProfile: { sweet: 8, sour: 0, bitter: 1, alcohol: 5 },
    unit: "ml"
  },
  {
    name: "Бейлис",
    category: "alcohol",
    color: "#D2B48C",
    abv: 17,
    pricePerLiter: 2200,
    tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 4 },
    unit: "ml"
  },
  {
    name: "Кампари",
    category: "alcohol",
    color: "#DC143C",
    abv: 25,
    pricePerLiter: 2500,
    tasteProfile: { sweet: 3, sour: 2, bitter: 8, alcohol: 5 },
    unit: "ml"
  },
  {
    name: "Куантро",
    category: "alcohol",
    color: "#FFA500",
    abv: 40,
    pricePerLiter: 3200,
    tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 7 },
    unit: "ml"
  },
  {
    name: "Калуа",
    category: "alcohol",
    color: "#2F1B14",
    abv: 20,
    pricePerLiter: 2000,
    tasteProfile: { sweet: 8, sour: 0, bitter: 3, alcohol: 4 },
    unit: "ml"
  },

  // === ВЕРМУТ ===
  {
    name: "Мартини Россо",
    category: "alcohol",
    color: "#8B0000",
    abv: 15,
    pricePerLiter: 1200,
    tasteProfile: { sweet: 6, sour: 1, bitter: 4, alcohol: 3 },
    unit: "ml"
  },
  {
    name: "Мартини Бьянко",
    category: "alcohol",
    color: "#F5F5DC",
    abv: 15,
    pricePerLiter: 1200,
    tasteProfile: { sweet: 5, sour: 2, bitter: 3, alcohol: 3 },
    unit: "ml"
  },
  {
    name: "Чинзано Россо",
    category: "alcohol",
    color: "#8B0000",
    abv: 15,
    pricePerLiter: 1000,
    tasteProfile: { sweet: 6, sour: 1, bitter: 4, alcohol: 3 },
    unit: "ml"
  },

  // === ВИНО ===
  {
    name: "Каберне Совиньон",
    category: "alcohol",
    color: "#722F37",
    abv: 13,
    pricePerLiter: 800,
    tasteProfile: { sweet: 1, sour: 3, bitter: 6, alcohol: 3 },
    unit: "ml"
  },
  {
    name: "Шардоне",
    category: "alcohol",
    color: "#F7E7CE",
    abv: 12,
    pricePerLiter: 900,
    tasteProfile: { sweet: 2, sour: 4, bitter: 1, alcohol: 3 },
    unit: "ml"
  },
  {
    name: "Пино Нуар",
    category: "alcohol",
    color: "#722F37",
    abv: 12,
    pricePerLiter: 1200,
    tasteProfile: { sweet: 2, sour: 3, bitter: 4, alcohol: 3 },
    unit: "ml"
  },
  {
    name: "Розе",
    category: "alcohol",
    color: "#FFB6C1",
    abv: 11,
    pricePerLiter: 700,
    tasteProfile: { sweet: 4, sour: 3, bitter: 1, alcohol: 3 },
    unit: "ml"
  },

  // === ИГРИСТОЕ ВИНО ===
  {
    name: "Шампанское Дом Периньон",
    category: "alcohol",
    color: "#F7E7CE",
    abv: 12,
    pricePerLiter: 15000,
    tasteProfile: { sweet: 3, sour: 5, bitter: 0, alcohol: 3 },
    unit: "ml"
  },
  {
    name: "Просекко",
    category: "alcohol",
    color: "#F7E7CE",
    abv: 11,
    pricePerLiter: 1500,
    tasteProfile: { sweet: 4, sour: 4, bitter: 0, alcohol: 3 },
    unit: "ml"
  },
  {
    name: "Кава",
    category: "alcohol",
    color: "#F7E7CE",
    abv: 11,
    pricePerLiter: 1200,
    tasteProfile: { sweet: 3, sour: 5, bitter: 0, alcohol: 3 },
    unit: "ml"
  },

  // === ПИВО ===
  {
    name: "Хайнекен",
    category: "alcohol",
    color: "#FFD700",
    abv: 5,
    pricePerLiter: 200,
    tasteProfile: { sweet: 1, sour: 1, bitter: 5, alcohol: 2 },
    unit: "ml"
  },
  {
    name: "Стелла Артуа",
    category: "alcohol",
    color: "#F0E68C",
    abv: 5,
    pricePerLiter: 180,
    tasteProfile: { sweet: 1, sour: 1, bitter: 4, alcohol: 2 },
    unit: "ml"
  },
  {
    name: "Гиннесс",
    category: "alcohol",
    color: "#2F1B14",
    abv: 4,
    pricePerLiter: 220,
    tasteProfile: { sweet: 2, sour: 0, bitter: 7, alcohol: 2 },
    unit: "ml"
  },
  {
    name: "Балтика 7",
    category: "alcohol",
    color: "#FFD700",
    abv: 5,
    pricePerLiter: 120,
    tasteProfile: { sweet: 1, sour: 1, bitter: 5, alcohol: 2 },
    unit: "ml"
  },

  // === АБСЕНТ ===
  {
    name: "Абсент Ксента",
    category: "alcohol",
    color: "#7CFC00",
    abv: 70,
    pricePerLiter: 2500,
    tasteProfile: { sweet: 0, sour: 0, bitter: 8, alcohol: 10 },
    unit: "ml"
  },
  {
    name: "Абсент Туннель",
    category: "alcohol",
    color: "#7CFC00",
    abv: 55,
    pricePerLiter: 1800,
    tasteProfile: { sweet: 0, sour: 0, bitter: 7, alcohol: 9 },
    unit: "ml"
  },

  // === СПЕЦИАЛЬНЫЕ НАПИТКИ ===
  {
    name: "Кальвадос",
    category: "alcohol",
    color: "#D2691E",
    abv: 40,
    pricePerLiter: 3500,
    tasteProfile: { sweet: 2, sour: 1, bitter: 2, alcohol: 8 },
    unit: "ml"
  },
  {
    name: "Граппа",
    category: "alcohol",
    color: "#FFFFFF",
    abv: 40,
    pricePerLiter: 2800,
    tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 },
    unit: "ml"
  },
  {
    name: "Марсала",
    category: "alcohol",
    color: "#8B4513",
    abv: 15,
    pricePerLiter: 1500,
    tasteProfile: { sweet: 7, sour: 1, bitter: 2, alcohol: 3 },
    unit: "ml"
  },

  // === БИТТЕРЫ ===
  {
    name: "Ангостура",
    category: "bitter",
    color: "#8B0000",
    abv: 45,
    pricePerLiter: 2000,
    tasteProfile: { sweet: 1, sour: 0, bitter: 9, alcohol: 8 },
    unit: "ml"
  },
  {
    name: "Пейшо биттер",
    category: "bitter",
    color: "#8B4513",
    abv: 35,
    pricePerLiter: 2500,
    tasteProfile: { sweet: 0, sour: 0, bitter: 8, alcohol: 6 },
    unit: "ml"
  },

  // === ОРИГИНАЛЬНЫЕ ИНГРЕДИЕНТЫ (сохраняем существующие) ===
  // Соки
  {
    name: "Апельсиновый сок",
    category: "juice",
    color: "#FFA500",
    abv: 0,
    pricePerLiter: 200,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Ананасовый сок",
    category: "juice",
    color: "#FFE135",
    abv: 0,
    pricePerLiter: 250,
    tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Клюквенный сок",
    category: "juice",
    color: "#DC143C",
    abv: 0,
    pricePerLiter: 300,
    tasteProfile: { sweet: 4, sour: 6, bitter: 1, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Лимонный сок",
    category: "juice",
    color: "#FFFF00",
    abv: 0,
    pricePerLiter: 400,
    tasteProfile: { sweet: 1, sour: 9, bitter: 0, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Лаймовый сок",
    category: "juice",
    color: "#32CD32",
    abv: 0,
    pricePerLiter: 450,
    tasteProfile: { sweet: 1, sour: 8, bitter: 0, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Грейпфрутовый сок",
    category: "juice",
    color: "#FF69B4",
    abv: 0,
    pricePerLiter: 350,
    tasteProfile: { sweet: 3, sour: 6, bitter: 2, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Томатный сок",
    category: "juice",
    color: "#FF6347",
    abv: 0,
    pricePerLiter: 180,
    tasteProfile: { sweet: 2, sour: 3, bitter: 1, alcohol: 0 },
    unit: "ml"
  },

  // Сиропы
  {
    name: "Простой сироп",
    category: "syrup",
    color: "#FFFFFF",
    abv: 0,
    pricePerLiter: 150,
    tasteProfile: { sweet: 10, sour: 0, bitter: 0, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Сироп граната",
    category: "syrup",
    color: "#B22222",
    abv: 0,
    pricePerLiter: 350,
    tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Кокосовый сироп",
    category: "syrup",
    color: "#FFFACD",
    abv: 0,
    pricePerLiter: 400,
    tasteProfile: { sweet: 8, sour: 0, bitter: 0, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Мятный сироп",
    category: "syrup",
    color: "#90EE90",
    abv: 0,
    pricePerLiter: 300,
    tasteProfile: { sweet: 7, sour: 0, bitter: 2, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Карамельный сироп",
    category: "syrup",
    color: "#D2691E",
    abv: 0,
    pricePerLiter: 320,
    tasteProfile: { sweet: 10, sour: 0, bitter: 1, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Ванильный сироп",
    category: "syrup",
    color: "#F5DEB3",
    abv: 0,
    pricePerLiter: 380,
    tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
    unit: "ml"
  },

  // Миксеры
  {
    name: "Тоник",
    category: "mixer",
    color: "#F0F8FF",
    abv: 0,
    pricePerLiter: 150,
    tasteProfile: { sweet: 2, sour: 1, bitter: 4, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Содовая",
    category: "mixer",
    color: "#F0F8FF",
    abv: 0,
    pricePerLiter: 80,
    tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Кока-кола",
    category: "mixer",
    color: "#2F1B14",
    abv: 0,
    pricePerLiter: 120,
    tasteProfile: { sweet: 8, sour: 1, bitter: 1, alcohol: 0 },
    unit: "ml"
  },
  {
    name: "Имбирное пиво",
    category: "mixer",
    color: "#DAA520",
    abv: 0,
    pricePerLiter: 200,
    tasteProfile: { sweet: 4, sour: 2, bitter: 3, alcohol: 0 },
    unit: "ml"
  },

  // Фрукты и декор
  {
    name: "Лайм",
    category: "fruit",
    color: "#32CD32",
    abv: 0,
    pricePerLiter: 500,
    tasteProfile: { sweet: 2, sour: 7, bitter: 0, alcohol: 0 },
    unit: "piece"
  },
  {
    name: "Лимон",
    category: "fruit",
    color: "#FFFF00",
    abv: 0,
    pricePerLiter: 400,
    tasteProfile: { sweet: 2, sour: 8, bitter: 0, alcohol: 0 },
    unit: "piece"
  },
  {
    name: "Мята",
    category: "fruit",
    color: "#00FF00",
    abv: 0,
    pricePerLiter: 800,
    tasteProfile: { sweet: 1, sour: 0, bitter: 3, alcohol: 0 },
    unit: "piece"
  },
  {
    name: "Вишня",
    category: "fruit",
    color: "#DC143C",
    abv: 0,
    pricePerLiter: 600,
    tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
    unit: "piece"
  },
  {
    name: "Апельсин",
    category: "fruit",
    color: "#FFA500",
    abv: 0,
    pricePerLiter: 350,
    tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 },
    unit: "piece"
  },
  {
    name: "Оливки",
    category: "garnish",
    color: "#808000",
    abv: 0,
    pricePerLiter: 800,
    tasteProfile: { sweet: 0, sour: 2, bitter: 3, alcohol: 0 },
    unit: "piece"
  },

  // Лёд
  {
    name: "Лёд",
    category: "ice",
    color: "#E0E0E0",
    abv: 0,
    pricePerLiter: 50,
    tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 },
    unit: "g"
  },

  // === ВИНА ИЗ ALKOTEKA (Реальные позиции) ===
  ...ALKOTEKA_WINES
];

// Обновленные категории с новыми типами алкоголя
export const EXTENDED_GLASS_TYPES = [
  { name: "Old-fashioned", capacity: 300, shape: "old-fashioned" },
  { name: "Highball", capacity: 350, shape: "highball" },
  { name: "Martini", capacity: 150, shape: "martini" },
  { name: "Shot", capacity: 50, shape: "shot" },
  { name: "Rocks", capacity: 250, shape: "rocks" },
  { name: "Coupe", capacity: 180, shape: "coupe" },
  { name: "Wine", capacity: 200, shape: "wine" },
  { name: "Champagne", capacity: 180, shape: "champagne" },
  { name: "Beer", capacity: 500, shape: "beer" },
  { name: "Snifter", capacity: 200, shape: "snifter" }
];

// Статистика по категориям
export const CATEGORY_STATS = {
  alcohol: EXTENDED_INGREDIENTS.filter(i => i.category === 'alcohol').length,
  juice: EXTENDED_INGREDIENTS.filter(i => i.category === 'juice').length,
  syrup: EXTENDED_INGREDIENTS.filter(i => i.category === 'syrup').length,
  mixer: EXTENDED_INGREDIENTS.filter(i => i.category === 'mixer').length,
  fruit: EXTENDED_INGREDIENTS.filter(i => i.category === 'fruit').length,
  garnish: EXTENDED_INGREDIENTS.filter(i => i.category === 'garnish').length,
  bitter: EXTENDED_INGREDIENTS.filter(i => i.category === 'bitter').length,
  ice: EXTENDED_INGREDIENTS.filter(i => i.category === 'ice').length,
  total: EXTENDED_INGREDIENTS.length
};
