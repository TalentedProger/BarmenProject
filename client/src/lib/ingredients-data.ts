import type { Ingredient } from "@shared/schema";
import { ALKOTEKA_REAL_PRODUCTS } from "./alkoteka-real-products";
import { KRASNOEIBELOE_SODAS } from "./krasnoeibeloe-sodas";
import { KRASNOEIBELOE_JUICES } from "./krasnoeibeloe-juices";
import { KRASNOEIBELOE_BEER } from "./krasnoeibeloe-beer";
import { KRASNOEIBELOE_COGNAC } from "./krasnoeibeloe-cognac";
import { KRASNOEIBELOE_LIQUEURS } from "./krasnoeibeloe-liqueurs";
import { KRASNOEIBELOE_RUM } from "./krasnoeibeloe-rum";
import { KRASNOEIBELOE_TEQUILA } from "./krasnoeibeloe-tequila";
import { KRASNOEIBELOE_COCKTAILS } from "./krasnoeibeloe-cocktails";
import { KRASNOEIBELOE_TINCTURES } from "./krasnoeibeloe-tinctures";
import { KRASNOEIBELOE_VODKA } from "./krasnoeibeloe-vodka";
import { KRASNOEIBELOE_WHISKEY } from "./krasnoeibeloe-whiskey";
import { KRASNOEIBELOE_SPARKLING_WINE } from "./krasnoeibeloe-sparkling-wine";
import { KRASNOEIBELOE_VERMOUTH } from "./krasnoeibeloe-vermouth";
import { PYATEROCHKA_ENERGY_DRINKS } from "./pyaterochka-energy-drinks";
import { PYATEROCHKA_FRUITS } from "./pyaterochka-fruits";
import { PYATEROCHKA_BITTERS } from "./pyaterochka-bitters";
import { WILDBERRIES_SYRUPS } from "./wildberries-syrups-new";
import { MAGNIT_BITTERS } from "./magnit-bitters";

// Список ингредиентов с реальными товарами
export const SAMPLE_INGREDIENTS: Partial<Ingredient>[] = [
  // === РЕАЛЬНЫЕ ТОВАРЫ ALKOTEKA (90 позиций) ===
  ...ALKOTEKA_REAL_PRODUCTS,

  // === ПИВО КРАСНОЕ&БЕЛОЕ (42 позиции) ===
  ...KRASNOEIBELOE_BEER,

  // === КОНЬЯК И БРЕНДИ КРАСНОЕ&БЕЛОЕ (58 позиций) ===
  ...KRASNOEIBELOE_COGNAC,

  // === ЛИКЁРЫ КРАСНОЕ&БЕЛОЕ (24 позиции) ===
  ...KRASNOEIBELOE_LIQUEURS,

  // === РОМ КРАСНОЕ&БЕЛОЕ (10 позиций) ===
  ...KRASNOEIBELOE_RUM,

  // === ТЕКИЛА КРАСНОЕ&БЕЛОЕ (8 позиций) ===
  ...KRASNOEIBELOE_TEQUILA,

  // === НАСТОЙКИ КРАСНОЕ&БЕЛОЕ (37 позиций) ===
  ...KRASNOEIBELOE_TINCTURES,

  // === ВОДКА КРАСНОЕ&БЕЛОЕ (24 позиции) ===
  ...KRASNOEIBELOE_VODKA,

  // === ВИСКИ/БУРБОН КРАСНОЕ&БЕЛОЕ (68 позиций) ===
  ...KRASNOEIBELOE_WHISKEY,

  // === ВИНО ИГРИСТОЕ КРАСНОЕ&БЕЛОЕ (16 pozicij) ===
  ...KRASNOEIBELOE_SPARKLING_WINE,

  // === ВЕРМУТ КРАСНОЕ&БЕЛОЕ (8 pozicij) ===
  ...KRASNOEIBELOE_VERMOUTH,

  // === ГАЗИРОВАННЫЕ НАПИТКИ КРАСНОЕ&БЕЛОЕ (57 позиций) ===
  ...KRASNOEIBELOE_SODAS,

  // === КОКТЕЙЛИ КРАСНОЕ&БЕЛОЕ (18 позиций) ===
  ...KRASNOEIBELOE_COCKTAILS,

  // === СОКИ И НЕКТАРЫ КРАСНОЕ&БЕЛОЕ (43 pozicii) ===
  ...KRASNOEIBELOE_JUICES,

  // === ЭНЕРГЕТИЧЕСКИЕ НАПИТКИ ПЯТЁРОЧКА (22 позиции) ===
  ...PYATEROCHKA_ENERGY_DRINKS,

  // === ФРУКТЫ И ЯГОДЫ ПЯТЁРОЧКА (46 позиций) ===
  ...PYATEROCHKA_FRUITS,

  // === СИРОПЫ WILDBERRIES (152 позиции) ===
  ...WILDBERRIES_SYRUPS,

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

  // === БИТТЕРЫ И ТОНИКИ ПЯТЁРОЧКА (4 позиции) ===
  ...PYATEROCHKA_BITTERS,

  // === БИТТЕРЫ И ТОНИКИ МАГНИТ (5 позиций) ===
  ...MAGNIT_BITTERS,
  
  // === СОКИ ===
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

  // === МИКСЕРЫ ===
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
  
  // === ДЕКОР ===
  {
    name: "Оливки",
    category: "garnish",
    color: "#808000",
    abv: 0,
    pricePerLiter: 800,
    tasteProfile: { sweet: 0, sour: 2, bitter: 3, alcohol: 0 },
    unit: "piece"
  },
  
  // Ice and others
  {
    name: "Лёд",
    category: "ice",
    color: "#E0E0E0",
    abv: 0,
    pricePerLiter: 50,
    tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 0 },
    unit: "g"
  }
];

// Обновленные категории с новыми типами алкоголя
export const GLASS_TYPES = [
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
  alcohol: SAMPLE_INGREDIENTS.filter(i => i.category === 'alcohol').length,
  juice: SAMPLE_INGREDIENTS.filter(i => i.category === 'juice').length,
  syrup: SAMPLE_INGREDIENTS.filter(i => i.category === 'syrup').length,
  mixer: SAMPLE_INGREDIENTS.filter(i => i.category === 'mixer').length,
  fruit: SAMPLE_INGREDIENTS.filter(i => i.category === 'fruit').length,
  garnish: SAMPLE_INGREDIENTS.filter(i => i.category === 'garnish').length,
  bitter: SAMPLE_INGREDIENTS.filter(i => i.category === 'bitter').length,
  ice: SAMPLE_INGREDIENTS.filter(i => i.category === 'ice').length,
  energy_drink: SAMPLE_INGREDIENTS.filter(i => i.category === 'energy_drink').length,
  total: SAMPLE_INGREDIENTS.length
};
