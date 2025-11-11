import type { Ingredient } from "@shared/schema";
import { KRASNOEIBELOE_JUICES_PART1 } from "./krasnoeibeloe-juices-part1";
import { KRASNOEIBELOE_JUICES_PART2 } from "./krasnoeibeloe-juices-part2";

/**
 * Соки и нектары с krasnoeibeloe.ru
 * Данные собраны вручную (1 ноября 2025)
 * Всего товаров: 43
 * 
 * Названия ограничены до 36 символов
 * Добавлены изображения товаров (placeholder)
 */

export const KRASNOEIBELOE_JUICES: Partial<Ingredient>[] = [
  ...KRASNOEIBELOE_JUICES_PART1,
  ...KRASNOEIBELOE_JUICES_PART2
];
