import type { Ingredient } from "@shared/schema";

/**
 * Биттеры и тоники из магазина Пятёрочка
 * Данные собраны с сайта 5ka.ru (10 ноября 2025)
 */

const PYATEROCHKA_ICON = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/X5_Retail_Group_logo.svg/1200px-X5_Retail_Group_logo.svg.png";

export const PYATEROCHKA_BITTERS: Partial<Ingredient>[] = [
  {
    name: "Тоник Rich Bitter лимон 1л",
    category: "bitter",
    color: "#FFFF00",
    abv: 0,
    pricePerLiter: 129,
    volume: 1000,
    tasteProfile: { sweet: 4, sour: 6, bitter: 7, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/tonik-rich-bitter-limon-1l--4396782/",
    sourceName: "Пятёрочка",
    sourceIcon: PYATEROCHKA_ICON,
    imageUrl: "https://catalog-images.x5static.net/product/2007176-main/800x800.jpeg?updated_at=2025-07-02T08:07:13.888Z"
  },
  {
    name: "Напиток Rich Cocktail Спритц Красный апельсин газированный 1л",
    category: "bitter",
    color: "#FF4500",
    abv: 0,
    pricePerLiter: 129,
    volume: 1000,
    tasteProfile: { sweet: 5, sour: 4, bitter: 5, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-rich-cocktail-spritts-krasnyy-apelsin-gazi--4401860/",
    sourceName: "Пятёрочка",
    sourceIcon: PYATEROCHKA_ICON,
    imageUrl: "https://catalog-images.x5static.net/product/2010194-main/800x800.jpeg?updated_at=2025-09-24T17:56:06.910Z"
  },
  {
    name: "Напиток Rich Tonic Индиан газированный 1л",
    category: "bitter",
    color: "#E0E0E0",
    abv: 0,
    pricePerLiter: 129,
    volume: 1000,
    tasteProfile: { sweet: 3, sour: 2, bitter: 8, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-rich-tonic-indian-gazirovannyy-1l--4396783/",
    sourceName: "Пятёрочка",
    sourceIcon: PYATEROCHKA_ICON,
    imageUrl: "https://catalog-images.x5static.net/product/2010197-main/800x800.jpeg"
  },
  {
    name: "Напиток Evervess Тоник Вкус Биттер Лемон газированный 1л",
    category: "bitter",
    color: "#FFF44F",
    abv: 0,
    pricePerLiter: 109,
    volume: 1000,
    tasteProfile: { sweet: 4, sour: 5, bitter: 7, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://5ka.ru/product/napitok-evervess-tonik-vkus-bitter-lemon-gazirovan--4415410/",
    sourceName: "Пятёрочка",
    sourceIcon: PYATEROCHKA_ICON,
    imageUrl: "https://catalog-images.x5static.net/product/2064142-main/800x800.jpeg?updated_at=2025-10-22T07:14:15.314Z"
  }
];
