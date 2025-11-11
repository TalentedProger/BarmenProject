# Скрипт для получения URL изображений соков

## Быстрый способ - Консольный скрипт

### Шаг 1: Откройте страницы каталога в браузере

**Страница 1:**
https://krasnoeibeloe.ru/catalog/soki-i-nektary/?form_id=catalog_filter_form&filter_search=&cat_subsect%5B0%5D=756&cat_subsect%5B1%5D=757&cat_subsect%5B2%5D=758&arrFilter_100_MIN=0.2&arrFilter_100_MAX=2&set_filter=Y&

**Страница 2:**
https://krasnoeibeloe.ru/catalog/soki-i-nektary/?form_id=catalog_filter_form&filter_search=&cat_subsect%5B0%5D=756&cat_subsect%5B1%5D=757&cat_subsect%5B2%5D=758&arrFilter_100_MIN=0.2&arrFilter_100_MAX=2&set_filter=Y&PAGEN_1=2

### Шаг 2: Выполните скрипт в консоли браузера

1. Нажмите **F12** (откроется DevTools)
2. Перейдите на вкладку **Console**
3. Скопируйте и вставьте следующий скрипт:

```javascript
// Скрипт для извлечения URL изображений соков
(function() {
  const results = [];
  
  // Находим все карточки товаров
  const items = document.querySelectorAll('.catalog-item, .product-card, [class*="item"]');
  
  items.forEach((item) => {
    try {
      // Пытаемся найти изображение
      const img = item.querySelector('img[src*="krasnoeibeloe"]');
      if (!img) return;
      
      // Пытаемся найти название товара
      const nameElement = item.querySelector('.name, .title, h3, h4, a[class*="name"]');
      if (!nameElement) return;
      
      const name = nameElement.textContent.trim();
      const imageUrl = img.src;
      
      // Фильтруем только соки/нектары/напитки
      if (imageUrl.includes('servicecdn.ru') || imageUrl.includes('upload')) {
        results.push({ name, imageUrl });
      }
    } catch (e) {
      console.error('Ошибка обработки элемента:', e);
    }
  });
  
  // Выводим результаты в формате TypeScript
  console.log('\n=== РЕЗУЛЬТАТЫ (скопируйте) ===\n');
  results.forEach(({ name, imageUrl }) => {
    console.log(`imageUrl: "${imageUrl}", // ${name}`);
  });
  
  console.log(`\n=== Найдено ${results.length} изображений ===\n`);
  
  // Также выводим как JSON для удобства
  console.log('JSON:', JSON.stringify(results, null, 2));
})();
```

4. Нажмите **Enter**
5. Скопируйте результаты

### Шаг 3: Альтернативный метод (вручную)

Если скрипт не работает, используйте этот более надежный способ:

1. На странице каталога найдите товар
2. **Правый клик** на изображение товара
3. **"Копировать адрес изображения"**
4. Вставьте URL в соответствующую строку в файлах

---

## Пример результата

После выполнения скрипта вы получите такой вывод:

```
imageUrl: "https://krasnoeibeloe.servicecdn.ru/upload/resize_cache/iblock/XXX/YYY/200_356_1/product.jpg", // Сок Рич Яблоко 1л
imageUrl: "https://krasnoeibeloe.servicecdn.ru/upload/resize_cache/iblock/XXX/YYY/200_356_1/product2.jpg", // Нектар Добрый Мультифрукт 2л
```

---

## Шаг 4: Добавление URL в файлы

### Для krasnoeibeloe-juices-part1.ts:
```typescript
{ 
  name: "Сок Рич Яблоко 1л", 
  // ... остальные поля
  imageUrl: "СЮДА_ВСТАВИТЬ_URL"
},
```

### Для krasnoeibeloe-juices-part2.ts:
```typescript
{ 
  name: "Напиток Добрый Апельсин 2л", 
  // ... остальные поля
  imageUrl: "https://krasnoeibeloe.servicecdn.ru/upload/resize_cache/iblock/f5f/een22d3en21bxrii0xefa5vfv2dm2los/200_356_1/mandarin_040624_t.jpg"  // ✅ УЖЕ ДОБАВЛЕНО
},
```

---

## Список товаров для обработки

### Part 1 (26 товаров):
1. ⬜ Нектар мультифрукт 1.93л
2. ⬜ Сок Крал Гранатовый 1л
3. ⬜ Нектар Добрый Мультифрукт 2л
4. ⬜ Сок Рич Грейпфрут 1л
5. ⬜ Нектар Рич Вишня 1л
6. ⬜ Напиток Добрый Палпи Апельсин
7. ⬜ Сок Рич Яблоко 1л
8. ⬜ Сок Рич Томат с солью 1л
9. ⬜ Сок Рич Ананас с мякотью 1л
10. ⬜ Нектар Крал манго 1л
11. ⬜ Сок Крал Гранатовый 0.25л
12. ⬜ Напиток Морсэль клюква 1л
13. ⬜ Сок ФрутоНяня Яблоко 0.2л
14. ⬜ Сок Сады Придонья яблочный 1л
15. ⬜ Нектар яблочный 1.93л
16. ⬜ Нектар Сады Придонья томат
17. ⬜ Сок Сады Придонья томат 1л
18. ⬜ Морс DeVita клюквенный 1л
19. ⬜ Нектар Мой мультифрукт 0.2л
20. ⬜ Нектар Сады Придонья 0.95л
21. ⬜ Нектар Сады Придонья яблоко
22. ⬜ Сок Сады Придонья яблоко-смор
23. ⬜ Нектар Крал вишня 1л

### Part 2 (21 товар):
1. ⬜ Сок Мой зеленое яблоко 0.2л
2. ⬜ Нектар Сады Придонья черешня
3. ✅ Напиток Добрый Апельсин 2л (УЖЕ ДОБАВЛЕН)
4. ⬜ Нектар Добрый Яблоко 2л
5. ⬜ Нектар Добрый Томат 2л
6. ⬜ Напиток Алоэ Вера 0.525л
7. ⬜ Сок ФрутоНяня яблоко-вишня
8. ⬜ Нектар DeVita яблоко-вишня 1л
9. ⬜ Нектар Сады Придонья 1.93л
10. ⬜ Нектар DeVita яблочный 1л
11. ⬜ Сок Ми ми мишки мультифрукт
12. ⬜ Напиток Organic арбуз-алоэ
13. ⬜ Нектар Ми ми мишки банан 0.2л
14. ⬜ Нектар Рич Апельсин 1л
15. ⬜ Нектар Сады Придонья яблочный
16. ⬜ Сок Агуша яблоко 0.2л
17. ⬜ Сок Агуша яблоко-персик
18. ⬜ Сок Ми ми мишки яблоко-вишня
19. ⬜ Сок Сады Придонья зеленое яб
20. ⬜ Сок Сады Придонья яблоко-вишня
21. ⬜ Сок Сады Придонья яблоко-груша

---

## Примечание

URL изображений имеют следующий формат:
```
https://krasnoeibeloe.servicecdn.ru/upload/resize_cache/iblock/[ID]/[HASH]/200_356_1/[filename].jpg
```

Размер `200_356_1` - это оптимальный размер для карточек ингредиентов (200px ширина).
