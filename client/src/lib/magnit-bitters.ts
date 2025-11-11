import type { Ingredient } from "@shared/schema";

/**
 * Биттеры и тоники из магазина Магнит
 * Данные собраны с сайта magnit.ru (10 ноября 2025)
 */

const MAGNIT_ICON = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/New-logo-magnit.jpg/960px-New-logo-magnit.jpg";

export const MAGNIT_BITTERS: Partial<Ingredient>[] = [
  {
    name: "Напиток Chillout Bitter Raspberry 900мл",
    category: "bitter",
    color: "#E30B5C",
    abv: 0,
    pricePerLiter: 100,
    volume: 900,
    tasteProfile: { sweet: 5, sour: 3, bitter: 6, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://magnit.ru/product/1000564010-chillout_bitter_raspberry_napitok_b_a_sil_gaz_0_9l_pl_but?shopCode=992301&shopType=6",
    sourceName: "Магнит",
    sourceIcon: MAGNIT_ICON,
    imageUrl: "https://images-foodtech.magnit.ru/fRXO43IG1fHjprgMnRhTZHm7saIvn3tnN9gr-leyHwQ/rs:fit:1600:1600/plain/s3://img-dostavka/uf/5d7/5d7d645e1a4c69d15307f9f959ffa97b/dda8259f267f74e588b57f0c0539492b.jpeg@webp"
  },
  {
    name: "Напиток Bitter Star Bar грейпфрут 1л",
    category: "bitter",
    color: "#FF69B4",
    abv: 0,
    pricePerLiter: 83,
    volume: 1000,
    tasteProfile: { sweet: 3, sour: 6, bitter: 7, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://magnit.ru/product/1000380593-star_bar_napitok_grapefruit_1l_plastikovaya_butylka_ooo_fkpchf_bobimeks_tm_6?shopCode=992301&shopType=6",
    sourceName: "Магнит",
    sourceIcon: MAGNIT_ICON,
    imageUrl: "https://images-foodtech.magnit.ru/fLdMRXBod874ABS3U4TjpUQaJKq5PICff5IjXUBu8lY/rs:fit:1600:1600/plain/s3://img-dostavka/uf/a51/a51bdc702ffc7f0542edf77f3dea7051/9f01db040cda3546fb5d7ff8fcc20e82.jpeg@webp"
  },
  {
    name: "Тоник с мандариновым вкусом Rich 1л",
    category: "bitter",
    color: "#FF8C00",
    abv: 0,
    pricePerLiter: 129,
    volume: 1000,
    tasteProfile: { sweet: 5, sour: 4, bitter: 6, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://magnit.ru/product/1000457198-rich_napitok_b_a_sil_gaz_mandarin_1l_pl_but?shopCode=992301&shopType=6",
    sourceName: "Магнит",
    sourceIcon: MAGNIT_ICON,
    imageUrl: "https://images-foodtech.magnit.ru/QRBKT321mWFGlImS15pFZCwlMkFR8uwUQa9OiS3XtyI/rs:fit:1600:1600/plain/s3://img-dostavka/uf/1b0/1b0335c10fbab6465578be6e9a99f6fa/1eec72438aacbde7a6954c3fa593e1a8.jpeg@webp"
  },
  {
    name: "Тоник Evervess апероль 1л",
    category: "bitter",
    color: "#FF4500",
    abv: 0,
    pricePerLiter: 115,
    volume: 1000,
    tasteProfile: { sweet: 4, sour: 3, bitter: 7, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://magnit.ru/product/1000447102-evervess_nap_ital_apero_b_a_sil_gaz_p_b_1l?shopCode=992301&shopType=6",
    sourceName: "Магнит",
    sourceIcon: MAGNIT_ICON,
    imageUrl: "https://images-foodtech.magnit.ru/7QwczMSzh7i_MSCh-iL8TRxMyZ-SUbt02MJ8kasPA0M/rs:fit:1600:1600/plain/s3://img-dostavka/uf/554/554e0a83b9d8f0d7e31e56a4b40ad88e/7748372b20de935b43eed00a32d43e89.jpeg@webp"
  },
  {
    name: "Тоник с гранатовым вкусом Rich 1л",
    category: "bitter",
    color: "#8B0000",
    abv: 0,
    pricePerLiter: 129,
    volume: 1000,
    tasteProfile: { sweet: 5, sour: 3, bitter: 6, alcohol: 0 },
    unit: "ml",
    sourceUrl: "https://magnit.ru/product/1000457200-rich_napitok_b_a_sil_gaz_granat_1l_pl_but?shopCode=992301&shopType=6",
    sourceName: "Магнит",
    sourceIcon: MAGNIT_ICON,
    imageUrl: "https://images-foodtech.magnit.ru/PqfaViiCRhU9IAu90va8EW6LxY2ljJ0cLmV2pmRIjds/rs:fit:1600:1600/plain/s3://img-dostavka/uf/681/681466e04037d2c8eed994f5dad259eb/290fc88d01f2331acf47f0f422956eec.jpeg@webp"
  }
];
