import type { Ingredient } from "@shared/schema";

/**
 * Энергетические напитки с 5ka.ru (Пятёрочка)
 * Данные собраны вручную (4 ноября 2025)
 * Всего товаров: 22
 * 
 * Распределение по брендам:
 * - Red Bull: 3 товара
 * - Adrenaline: 2 товара
 * - Flash Up: 3 товара
 * - Lit Energy: 5 товаров
 * - Gorilla: 2 товара
 * - Burn: 2 товара
 * - Tornado: 1 товар
 * - Volt Energy: 2 товара
 */

export const PYATEROCHKA_ENERGY_DRINKS: Partial<Ingredient>[] = [
  // === RED BULL ===
  {
    name: "Red Bull 0.473л",
    category: "energy_drink",
    color: "#FFD700",
    abv: 0,
    pricePerLiter: 666,
    volume: 473,
    tasteProfile: { sweet: 7, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-red-bull-0-473l--3173468/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1163118-main/320x320.jpeg?updated_at=2025-02-28T10:34:05.809Z"
  },
  {
    name: "Red Bull без сахара 0.25л",
    category: "energy_drink",
    color: "#87CEEB",
    abv: 0,
    pricePerLiter: 540,
    volume: 250,
    tasteProfile: { sweet: 3, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-red-bull-bez-sakhara-0-25l--2103012/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1160608-main/320x320.jpeg?updated_at=2025-02-28T10:34:05.826Z"
  },
  {
    name: "Red Bull 0.355л",
    category: "energy_drink",
    color: "#FFD700",
    abv: 0,
    pricePerLiter: 701,
    volume: 355,
    tasteProfile: { sweet: 7, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-red-bull-bez-sakhara-0-25l--2103012/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1160825-main/320x320.jpeg?updated_at=2025-02-28T10:34:05.901Z"
  },
  {
    name: "Red Bull The Summer Edition со вкусом белого персика 250мл",
    category: "energy_drink",
    color: "#FFDAB9",
    abv: 0,
    pricePerLiter: 556,
    volume: 250,
    tasteProfile: { sweet: 8, sour: 2, bitter: 0, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-red-bull-the-summer-editio--4400746/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/2025207-main/320x320.jpeg"
  },

  // === ADRENALINE ===
  {
    name: "Adrenaline Energy Power Game Fuel 0.449л",
    category: "energy_drink",
    color: "#FF6347",
    abv: 0,
    pricePerLiter: 290,
    volume: 449,
    tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-adrenaline-energy-power-ga--3931839/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1194826-main/800x800.jpeg?updated_at=2025-08-21T17:24:57.826Z"
  },
  {
    name: "Adrenaline Rush 0.449л",
    category: "energy_drink",
    color: "#FF4500",
    abv: 0,
    pricePerLiter: 287,
    volume: 449,
    tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-adrenaline-energy-power-ga--3931839/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1194826-main/320x320.jpeg?updated_at=2025-08-21T17:24:57.826Z"
  },
  {
    name: "Adrenaline Rush Red Ягодная энергия 0.449л",
    category: "energy_drink",
    color: "#DC143C",
    abv: 0,
    pricePerLiter: 221,
    volume: 449,
    tasteProfile: { sweet: 7, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-adrenaline-rush-red-yagodn--3931838/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1194825-main/320x320.jpeg?updated_at=2025-06-25T11:19:10.718Z"
  },

  // === FLASH UP ===
  {
    name: "Flash Up Max 1л",
    category: "energy_drink",
    color: "#1E90FF",
    abv: 0,
    pricePerLiter: 124,
    volume: 1000,
    tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-flash-up-max-1l--3963457/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1197010-main/320x320.jpeg?updated_at=2024-10-31T19:33:33.928Z"
  },
  {
    name: "Flash Up Energy Киви и Карамбола витаминизированный газированный 450мл",
    category: "energy_drink",
    color: "#32CD32",
    abv: 0,
    pricePerLiter: 198,
    volume: 450,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-flash-up-energy-kivi-i-kar--4346917/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1824831-main/320x320.jpeg"
  },
  {
    name: "Flash Up Energy с кофеином и таурином газированный 470мл",
    category: "energy_drink",
    color: "#4169E1",
    abv: 0,
    pricePerLiter: 168,
    volume: 470,
    tasteProfile: { sweet: 5, sour: 2, bitter: 2, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-flash-up-energy-s-kofeinom--4373462/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1848983-main/320x320.jpeg?updated_at=2025-09-24T17:45:12.247Z"
  },

  // === LIT ENERGY ===
  {
    name: "Lit Energy Classic газированный 0.45л",
    category: "energy_drink",
    color: "#9370DB",
    abv: 0,
    pricePerLiter: 242,
    volume: 450,
    tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-lit-energy-classic-gazirov--4315664/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1575087-main/800x800.jpeg?updated_at=2025-09-11T14:57:47.603Z"
  },
  {
    name: "Lit Energy Original газированный 0.45л",
    category: "energy_drink",
    color: "#8A2BE2",
    abv: 0,
    pricePerLiter: 242,
    volume: 450,
    tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-lit-energy-original-gaziro--4315665/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1575088-main/800x800.jpeg?updated_at=2025-02-28T10:33:57.318Z"
  },
  {
    name: "Lit Energy Blueberry газированный 450мл",
    category: "energy_drink",
    color: "#6A5ACD",
    abv: 0,
    pricePerLiter: 242,
    volume: 450,
    tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-lit-energy-blueberry-gazir--4318100/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1576938-main/320x320.jpeg?updated_at=2025-09-11T14:58:16.340Z"
  },
  {
    name: "Lit Energy Strawberry bubblegum тонизирующий газированный 450мл",
    category: "energy_drink",
    color: "#FF69B4",
    abv: 0,
    pricePerLiter: 220,
    volume: 450,
    tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-lit-energy-strawberry-bubb--4414653/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/2031661-main/320x320.jpeg?updated_at=2025-09-24T18:00:20.826Z"
  },
  {
    name: "Lit Energy Raspberry со вкусом малины газированный 450мл",
    category: "energy_drink",
    color: "#C71585",
    abv: 0,
    pricePerLiter: 244,
    volume: 450,
    tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-lit-energy-raspberry-so-vk--4426030/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/2047164-main/320x320.jpeg?updated_at=2025-09-24T18:01:32.782Z"
  },

  // === GORILLA ===
  {
    name: "Gorilla 0.45л",
    category: "energy_drink",
    color: "#696969",
    abv: 0,
    pricePerLiter: 198,
    volume: 450,
    tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-gorilla-0-45l--3680076/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1190244-main/320x320.jpeg?updated_at=2025-02-28T10:34:04.827Z"
  },
  {
    name: "Gorilla Mango Coconut газированный 0.45л",
    category: "energy_drink",
    color: "#FFA500",
    abv: 0,
    pricePerLiter: 198,
    volume: 450,
    tasteProfile: { sweet: 8, sour: 1, bitter: 0, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-gorilla-mango-coconut-toniziruyushchiy-gaz--4306615/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1518541-main/320x320.jpeg?updated_at=2025-02-28T10:34:00.503Z"
  },

  // === BURN ===
  {
    name: "Burn Сочная Энергия газированный 330мл",
    category: "energy_drink",
    color: "#DC143C",
    abv: 0,
    pricePerLiter: 270,
    volume: 330,
    tasteProfile: { sweet: 7, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-burn-sochnaya-energiya-gaz--4315390/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1614936-main/320x320.jpeg?updated_at=2025-05-23T08:51:12.534Z"
  },
  {
    name: "Burn Оригинальный 330мл",
    category: "energy_drink",
    color: "#FF8C00",
    abv: 0,
    pricePerLiter: 270,
    volume: 330,
    tasteProfile: { sweet: 6, sour: 2, bitter: 1, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-burn-originalnyy-330ml--4315389/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1578004-main/320x320.jpeg?updated_at=2025-02-28T13:21:53.127Z"
  },

  // === TORNADO ===
  {
    name: "Tornado Max Energy Black 450мл",
    category: "energy_drink",
    color: "#000000",
    abv: 0,
    pricePerLiter: 176,
    volume: 450,
    tasteProfile: { sweet: 5, sour: 2, bitter: 2, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-tornado-max-energy-black-4--4391720/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1853394-main/320x320.jpeg?updated_at=2025-09-24T17:52:17.328Z"
  },

  // === VOLT ENERGY ===
  {
    name: "Volt Energy со вкусом киви и фейхоа пастеризованный газированный 450мл",
    category: "energy_drink",
    color: "#ADFF2F",
    abv: 0,
    pricePerLiter: 198,
    volume: 450,
    tasteProfile: { sweet: 7, sour: 3, bitter: 0, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-energeticheskiy-volt-energy-so-vkusom-kivi--4411409/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/2025377-main/320x320.jpeg?updated_at=2025-09-24T17:59:45.364Z"
  },
  {
    name: "Volt Energy Виноград и гуава 450мл",
    category: "energy_drink",
    color: "#9370DB",
    abv: 0,
    pricePerLiter: 198,
    volume: 450,
    tasteProfile: { sweet: 7, sour: 2, bitter: 0, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-toniziruyushchiy-volt-energy-vinograd-i-gu--4392143/",
    sourceName: "Пятёрочка",
    sourceIcon: "https://5ka.ru/favicon.ico",
    imageUrl: "https://catalog-images.x5static.net/product/1855133-main/320x320.jpeg?updated_at=2025-09-24T17:52:18.785Z"
  }
];
