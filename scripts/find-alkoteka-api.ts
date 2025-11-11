/**
 * Поиск API Alkoteka через анализ сетевых запросов
 */

console.log(`
╔════════════════════════════════════════════════════════════╗
║  КАК НАЙТИ ПРАВИЛЬНЫЕ ССЫЛКИ НА ТОВАРЫ ALKOTEKA.COM       ║
╚════════════════════════════════════════════════════════════╝

📋 ИНСТРУКЦИЯ (5 минут):

1️⃣  Откройте в браузере:
   https://alkoteka.com/catalog/krepkiy-alkogol/

2️⃣  Нажмите F12 (DevTools)

3️⃣  Вкладка Network → XHR

4️⃣  Обновите страницу (F5)

5️⃣  Найдите запросы к API:
   ✓ Ищите URL формата: /api/... или /graphql
   ✓ Обратите внимание на запросы возвращающие JSON

6️⃣  Откройте найденный запрос:
   → Response tab
   → Скопируйте JSON ответ

7️⃣  Проанализируйте структуру:
   {
     "products": [
       {
         "id": ...,
         "name": "...",
         "url": "/product/..." ← ВОТ ЭТО НАМ НУЖНО!
       }
     ]
   }

════════════════════════════════════════════════════════════

🔍 АЛЬТЕРНАТИВНЫЙ СПОСОБ (через Console):

1️⃣  Откройте https://alkoteka.com/catalog/krepkiy-alkogol/

2️⃣  Дождитесь загрузки товаров

3️⃣  F12 → Console → Вставьте код:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Собрать ВСЕ ссылки на товары
const productLinks = [];
const seenHrefs = new Set();

// Ищем по разным селекторам
const selectors = [
  'a[href*="/product/"]',
  '.product-card a',
  '.product-item a',
  '[data-product-link]',
  'a[href*="viski"]',
  'a[href*="vodka"]'
];

selectors.forEach(selector => {
  document.querySelectorAll(selector).forEach(link => {
    const href = link.href;
    const text = link.textContent.trim() || link.title || '';
    
    if (href && !seenHrefs.has(href)) {
      seenHrefs.add(href);
      productLinks.push({ text, href });
    }
  });
});

console.log(\`Найдено \${productLinks.length} уникальных ссылок\`);
console.table(productLinks);

// Скопировать в буфер обмена
copy(JSON.stringify(productLinks, null, 2));
console.log('✅ Ссылки скопированы в буфер обмена!');

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4️⃣  Ссылки будут скопированы в буфер обмена

5️⃣  Вставьте их в файл scripts/collected-links.json

════════════════════════════════════════════════════════════

🎯 ЧТО ДЕЛАТЬ С ПОЛУЧЕННЫМИ ССЫЛКАМИ:

1. Создайте файл: scripts/collected-links.json
2. Вставьте туда JSON с ссылками
3. Запустите: npx tsx scripts/update-product-links.ts
4. Скрипт автоматически обновит alkoteka-real-products.ts

════════════════════════════════════════════════════════════

💡 ПОДСКАЗКА:

Если не можете найти ссылки /product/:
1. Посмотрите на главную страницу товара
2. Откройте карточку любого товара
3. Скопируйте URL из адресной строки
4. Проанализируйте формат

Пример:
  ❌ https://alkoteka.com/catalog/krepkiy-alkogol/viski-123/
  ✅ https://alkoteka.com/product/viski-1/ballantines_12345

════════════════════════════════════════════════════════════
`);

console.log('\n✅ Следуйте инструкциям выше\n');
