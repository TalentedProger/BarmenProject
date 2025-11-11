import type { Ingredient } from "@shared/schema";

/**
 * Фрукты и ягоды с 5ka.ru (Пятёрочка)
 * Данные собраны вручную (4 ноября 2025)
 * Всего товаров: 46
 * 
 * Распределение по типам:
 * - Яблоки: 12 позиций
 * - Виноград: 4 позиции
 * - Груши: 3 позиции
 * - Цитрусовые: 9 позиций
 * - Ягоды: 4 позиции
 * - Экзотические: 14 позиций
 */

export const PYATEROCHKA_FRUITS: Partial<Ingredient>[] = [
  // === ВИНОГРАД ===
  {
    name: "Виноград Шайн Мускат нефритовый",
    category: "fruit",
    color: "#9ACD32",
    abv: 0,
    pricePerLiter: 39900,
    tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Виноград Киш-Миш черный",
    category: "fruit",
    color: "#2F4F4F",
    abv: 0,
    pricePerLiter: 17900,
    tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Виноград черный",
    category: "fruit",
    color: "#2F4F4F",
    abv: 0,
    pricePerLiter: 16900,
    tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Виноград Тайфи",
    category: "fruit",
    color: "#9370DB",
    abv: 0,
    pricePerLiter: 14900,
    tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Виноград Ред Глоб",
    category: "fruit",
    color: "#8B0000",
    abv: 0,
    pricePerLiter: 21900,
    tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },

  // === ЦИТРУСОВЫЕ ===
  {
    name: "Помело розовое",
    category: "fruit",
    color: "#FFB6C1",
    abv: 0,
    pricePerLiter: 17900,
    tasteProfile: { sweet: 5, sour: 4, bitter: 2, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Помело Global Village",
    category: "fruit",
    color: "#FFFACD",
    abv: 0,
    pricePerLiter: 16900,
    tasteProfile: { sweet: 5, sour: 4, bitter: 2, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Лимоны",
    category: "fruit",
    color: "#FFFF00",
    abv: 0,
    pricePerLiter: 24900,
    tasteProfile: { sweet: 1, sour: 9, bitter: 1, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Лайм в упаковке 3шт",
    category: "fruit",
    color: "#32CD32",
    abv: 0,
    pricePerLiter: 64900,
    tasteProfile: { sweet: 1, sour: 8, bitter: 1, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Апельсины фасованные",
    category: "fruit",
    color: "#FFA500",
    abv: 0,
    pricePerLiter: 19500,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Апельсины Global Village отборные",
    category: "fruit",
    color: "#FFA500",
    abv: 0,
    pricePerLiter: 19900,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Апельсины",
    category: "fruit",
    color: "#FFA500",
    abv: 0,
    pricePerLiter: 18900,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Грейпфрут красный",
    category: "fruit",
    color: "#FF6347",
    abv: 0,
    pricePerLiter: 16900,
    tasteProfile: { sweet: 4, sour: 6, bitter: 3, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Свити",
    category: "fruit",
    color: "#90EE90",
    abv: 0,
    pricePerLiter: 24900,
    tasteProfile: { sweet: 6, sour: 3, bitter: 1, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Мандарины мини",
    category: "fruit",
    color: "#FF8C00",
    abv: 0,
    pricePerLiter: 24900,
    tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Мандарины Global Village отборные",
    category: "fruit",
    color: "#FF8C00",
    abv: 0,
    pricePerLiter: 22900,
    tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },

  // === ЯГОДЫ ===
  {
    name: "Ежевика 125г",
    category: "fruit",
    color: "#2F4F4F",
    abv: 0,
    pricePerLiter: 39900,
    tasteProfile: { sweet: 6, sour: 3, bitter: 1, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Клубника 250г",
    category: "fruit",
    color: "#DC143C",
    abv: 0,
    pricePerLiter: 39900,
    tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Голубика 125г",
    category: "fruit",
    color: "#4169E1",
    abv: 0,
    pricePerLiter: 159200,
    tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Голубика Global Village Selection отборная 200г",
    category: "fruit",
    color: "#4169E1",
    abv: 0,
    pricePerLiter: 199500,
    tasteProfile: { sweet: 6, sour: 3, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Малина 150г",
    category: "fruit",
    color: "#E30B5C",
    abv: 0,
    pricePerLiter: 266000,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },

  // === ЯБЛОКИ ===
  {
    name: "Яблоко Global Village красное",
    category: "fruit",
    color: "#DC143C",
    abv: 0,
    pricePerLiter: 14900,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Яблоки Голден (Сладкие)",
    category: "fruit",
    color: "#FFD700",
    abv: 0,
    pricePerLiter: 16900,
    tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Яблоки Гренни Смит (С кислинкой)",
    category: "fruit",
    color: "#9ACD32",
    abv: 0,
    pricePerLiter: 16900,
    tasteProfile: { sweet: 4, sour: 7, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Яблоки Ред Делишес",
    category: "fruit",
    color: "#8B0000",
    abv: 0,
    pricePerLiter: 16900,
    tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Яблоки Роял Гала 4шт",
    category: "fruit",
    color: "#FF6347",
    abv: 0,
    pricePerLiter: 47900,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Яблоки Global Village Роял Гала",
    category: "fruit",
    color: "#FF6347",
    abv: 0,
    pricePerLiter: 12900,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Яблоки Global Village Голден фасованные",
    category: "fruit",
    color: "#FFD700",
    abv: 0,
    pricePerLiter: 13900,
    tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Яблоки Джерамин 4шт",
    category: "fruit",
    color: "#FF4500",
    abv: 0,
    pricePerLiter: 46900,
    tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Яблоки Симиренко фасованные",
    category: "fruit",
    color: "#7FFF00",
    abv: 0,
    pricePerLiter: 14900,
    tasteProfile: { sweet: 5, sour: 5, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Яблоки Синап",
    category: "fruit",
    color: "#ADFF2F",
    abv: 0,
    pricePerLiter: 16900,
    tasteProfile: { sweet: 6, sour: 4, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },

  // === ГРУШИ ===
  {
    name: "Груши Пакхам",
    category: "fruit",
    color: "#9ACD32",
    abv: 0,
    pricePerLiter: 19900,
    tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Груши Китайские",
    category: "fruit",
    color: "#F0E68C",
    abv: 0,
    pricePerLiter: 17900,
    tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Груши Конференция",
    category: "fruit",
    color: "#8B7355",
    abv: 0,
    pricePerLiter: 27900,
    tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },

  // === ЭКЗОТИЧЕСКИЕ ФРУКТЫ ===
  {
    name: "Бананы Global Village",
    category: "fruit",
    color: "#FFE135",
    abv: 0,
    pricePerLiter: 13500,
    tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Питахайя",
    category: "fruit",
    color: "#FF69B4",
    abv: 0,
    pricePerLiter: 36900,
    tasteProfile: { sweet: 6, sour: 2, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Гранат",
    category: "fruit",
    color: "#DC143C",
    abv: 0,
    pricePerLiter: 17900,
    tasteProfile: { sweet: 6, sour: 4, bitter: 1, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Гранат Азербайджан",
    category: "fruit",
    color: "#8B0000",
    abv: 0,
    pricePerLiter: 16900,
    tasteProfile: { sweet: 6, sour: 4, bitter: 1, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Хурма плоская",
    category: "fruit",
    color: "#FF6347",
    abv: 0,
    pricePerLiter: 17900,
    tasteProfile: { sweet: 9, sour: 0, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Хурма Шиши Бурун",
    category: "fruit",
    color: "#FF8C00",
    abv: 0,
    pricePerLiter: 17900,
    tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Киви",
    category: "fruit",
    color: "#9ACD32",
    abv: 0,
    pricePerLiter: 19900,
    tasteProfile: { sweet: 6, sour: 5, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Манго спелое Египет",
    category: "fruit",
    color: "#FFD700",
    abv: 0,
    pricePerLiter: 31900,
    tasteProfile: { sweet: 9, sour: 1, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Айва",
    category: "fruit",
    color: "#F0E68C",
    abv: 0,
    pricePerLiter: 23900,
    tasteProfile: { sweet: 5, sour: 3, bitter: 2, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Слива сезонная",
    category: "fruit",
    color: "#8B008B",
    abv: 0,
    pricePerLiter: 13900,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  },
  {
    name: "Слива Президент 500г",
    category: "fruit",
    color: "#4B0082",
    abv: 0,
    pricePerLiter: 39900,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "kg",
    sourceUrl: "https://5ka.ru/catalog/frukty-yagody--251C13101/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico"
  }
];
