import type { Ingredient } from "@shared/schema";
import { KRASNOEIBELOE_SODAS_PART1 } from "./krasnoeibeloe-sodas-part1";
import { KRASNOEIBELOE_SODAS_PART2 } from "./krasnoeibeloe-sodas-part2";

/**
 * Газированные напитки с krasnoeibeloe.ru
 * Данные собраны вручную со всех 3 страниц каталога (1 ноября 2025)
 * Всего товаров: 57
 * 
 * Распределение по типам:
 * - Кола: 15 товаров
 * - Фруктовая: 22 товара  
 * - Лимонад: 11 товаров
 * - Апельсиновая: 3 товара
 * - Лимон-Лайм: 3 товара
 * - Цитрус: 3 товара
 */

export const KRASNOEIBELOE_SODAS: Partial<Ingredient>[] = [
  ...KRASNOEIBELOE_SODAS_PART1,
  ...KRASNOEIBELOE_SODAS_PART2
];
