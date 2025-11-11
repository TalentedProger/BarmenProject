import { SAMPLE_INGREDIENTS } from "../client/src/lib/ingredients-data";
import { ALKOTEKA_REAL_PRODUCTS } from "../client/src/lib/alkoteka-real-products";
import { KRASNOEIBELOE_SODAS } from "../client/src/lib/krasnoeibeloe-sodas";
import { KRASNOEIBELOE_JUICES } from "../client/src/lib/krasnoeibeloe-juices";
import { KRASNOEIBELOE_BEER } from "../client/src/lib/krasnoeibeloe-beer";
import { KRASNOEIBELOE_COGNAC } from "../client/src/lib/krasnoeibeloe-cognac";
import { KRASNOEIBELOE_LIQUEURS } from "../client/src/lib/krasnoeibeloe-liqueurs";
import { KRASNOEIBELOE_RUM } from "../client/src/lib/krasnoeibeloe-rum";
import { KRASNOEIBELOE_TEQUILA } from "../client/src/lib/krasnoeibeloe-tequila";
import { KRASNOEIBELOE_COCKTAILS } from "../client/src/lib/krasnoeibeloe-cocktails";
import { KRASNOEIBELOE_TINCTURES } from "../client/src/lib/krasnoeibeloe-tinctures";
import { KRASNOEIBELOE_VODKA } from "../client/src/lib/krasnoeibeloe-vodka";
import { KRASNOEIBELOE_WHISKEY } from "../client/src/lib/krasnoeibeloe-whiskey";
import { KRASNOEIBELOE_SPARKLING_WINE } from "../client/src/lib/krasnoeibeloe-sparkling-wine";
import { KRASNOEIBELOE_VERMOUTH } from "../client/src/lib/krasnoeibeloe-vermouth";

console.log("📊 Подсчет ингредиентов:");
console.log("=".repeat(50));
console.log(`ALKOTEKA_REAL_PRODUCTS: ${ALKOTEKA_REAL_PRODUCTS.length}`);
console.log(`KRASNOEIBELOE_BEER: ${KRASNOEIBELOE_BEER.length}`);
console.log(`KRASNOEIBELOE_COGNAC: ${KRASNOEIBELOE_COGNAC.length}`);
console.log(`KRASNOEIBELOE_LIQUEURS: ${KRASNOEIBELOE_LIQUEURS.length}`);
console.log(`KRASNOEIBELOE_RUM: ${KRASNOEIBELOE_RUM.length}`);
console.log(`KRASNOEIBELOE_TEQUILA: ${KRASNOEIBELOE_TEQUILA.length}`);
console.log(`KRASNOEIBELOE_TINCTURES: ${KRASNOEIBELOE_TINCTURES.length}`);
console.log(`KRASNOEIBELOE_VODKA: ${KRASNOEIBELOE_VODKA.length}`);
console.log(`KRASNOEIBELOE_WHISKEY: ${KRASNOEIBELOE_WHISKEY.length}`);
console.log(`KRASNOEIBELOE_SPARKLING_WINE: ${KRASNOEIBELOE_SPARKLING_WINE.length}`);
console.log(`KRASNOEIBELOE_VERMOUTH: ${KRASNOEIBELOE_VERMOUTH.length}`);
console.log(`KRASNOEIBELOE_SODAS: ${KRASNOEIBELOE_SODAS.length}`);
console.log(`KRASNOEIBELOE_COCKTAILS: ${KRASNOEIBELOE_COCKTAILS.length}`);
console.log(`KRASNOEIBELOE_JUICES: ${KRASNOEIBELOE_JUICES.length}`);
console.log("=".repeat(50));

const total = ALKOTEKA_REAL_PRODUCTS.length +
  KRASNOEIBELOE_BEER.length +
  KRASNOEIBELOE_COGNAC.length +
  KRASNOEIBELOE_LIQUEURS.length +
  KRASNOEIBELOE_RUM.length +
  KRASNOEIBELOE_TEQUILA.length +
  KRASNOEIBELOE_TINCTURES.length +
  KRASNOEIBELOE_VODKA.length +
  KRASNOEIBELOE_WHISKEY.length +
  KRASNOEIBELOE_SPARKLING_WINE.length +
  KRASNOEIBELOE_VERMOUTH.length +
  KRASNOEIBELOE_SODAS.length +
  KRASNOEIBELOE_COCKTAILS.length +
  KRASNOEIBELOE_JUICES.length;

console.log(`Ожидаемая сумма (импорты): ${total}`);
console.log(`SAMPLE_INGREDIENTS.length: ${SAMPLE_INGREDIENTS.length}`);
console.log("=".repeat(50));

if (total !== SAMPLE_INGREDIENTS.length) {
  console.log(`⚠️ ОШИБКА: Не совпадает количество! Разница: ${total - SAMPLE_INGREDIENTS.length}`);
} else {
  console.log("✅ Все ингредиенты загружены корректно!");
}
