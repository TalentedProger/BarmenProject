import type { Ingredient } from "@shared/schema";

// This would typically come from the API, but here's some starter data
export const SAMPLE_INGREDIENTS: Partial<Ingredient>[] = [
  // Alcohol
  {
    name: "Водка",
    category: "alcohol",
    color: "#FFFFFF",
    abv: 40,
    pricePerLiter: 1200,
    tasteProfile: { sweet: 0, sour: 0, bitter: 0, alcohol: 9 },
    unit: "ml"
  },
  {
    name: "Белый ром",
    category: "alcohol",
    color: "#FFFACD",
    abv: 40,
    pricePerLiter: 1500,
    tasteProfile: { sweet: 2, sour: 0, bitter: 0, alcohol: 8 },
    unit: "ml"
  },
  {
    name: "Джин",
    category: "alcohol",
    color: "#F8F8FF",
    abv: 42,
    pricePerLiter: 1800,
    tasteProfile: { sweet: 0, sour: 0, bitter: 3, alcohol: 9 },
    unit: "ml"
  },
  {
    name: "Виски",
    category: "alcohol",
    color: "#D2691E",
    abv: 40,
    pricePerLiter: 2500,
    tasteProfile: { sweet: 1, sour: 0, bitter: 4, alcohol: 9 },
    unit: "ml"
  },
  {
    name: "Текила",
    category: "alcohol",
    color: "#F5F5DC",
    abv: 38,
    pricePerLiter: 2000,
    tasteProfile: { sweet: 0, sour: 1, bitter: 2, alcohol: 8 },
    unit: "ml"
  },
  
  // Juices
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
  
  // Syrups
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
  
  // Fruits and garnishes
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

export const GLASS_TYPES = [
  { name: "Old-fashioned", capacity: 300, shape: "old-fashioned" },
  { name: "Highball", capacity: 350, shape: "highball" },
  { name: "Martini", capacity: 150, shape: "martini" },
  { name: "Shot", capacity: 50, shape: "shot" },
  { name: "Rocks", capacity: 250, shape: "rocks" },
  { name: "Coupe", capacity: 180, shape: "coupe" }
];
