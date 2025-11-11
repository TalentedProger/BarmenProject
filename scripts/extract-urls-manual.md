# 📋 Инструкция: Извлечение URL товаров вручную

## Проблема

Сайт Alkoteka использует JavaScript для динамической загрузки товаров, поэтому автоматический парсер каталога не может извлечь ссылки.

## Решение: Ручное извлечение URL через браузер

### Шаг 1: Откройте категорию в браузере

Примеры категорий:
- https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_viski
- https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_vodka
- https://alkoteka.com/catalog/krepkiy-alkogol/options-categories_dzhin

### Шаг 2: Откройте консоль разработчика

1. Нажмите `F12` или `Ctrl+Shift+I`
2. Перейдите на вкладку "Console"

### Шаг 3: Выполните скрипт для извлечения URL

Скопируйте и вставьте этот код в консоль:

```javascript
// Извлечение URL товаров из страницы каталога Alkoteka
(function() {
  const links = [];
  
  // Попробуем разные селекторы
  const selectors = [
    'a[href*="/product/"]',
    'a[href*="/catalog/"][href*="-ml"]',
    '.product-card a',
    '.catalog-item a',
    '[data-product] a'
  ];
  
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(link => {
      const href = link.href;
      // Фильтруем только URL товаров
      if (href && 
          !href.includes('/options-') && 
          !href.endsWith('/catalog/') &&
          (href.includes('/product/') || href.match(/\/catalog\/.*\/[^\/]+-\d+-ml\//))) {
        links.push(href);
      }
    });
  });
  
  // Убираем дубликаты
  const uniqueLinks = [...new Set(links)];
  
  // Берем первые 10
  const top10 = uniqueLinks.slice(0, 10);
  
  console.log(`\n🎉 Найдено ${uniqueLinks.length} уникальных товаров`);
  console.log(`📋 Первые 10 товаров:\n`);
  
  top10.forEach((url, i) => {
    console.log(`${i + 1}. ${url}`);
  });
  
  // Копируем в буфер обмена
  const textToCopy = top10.join('\n');
  navigator.clipboard.writeText(textToCopy).then(() => {
    console.log(`\n✅ URL скопированы в буфер обмена!`);
    console.log(`📝 Вставьте их в scripts/urls.txt и запустите: npm run parse:batch`);
  });
  
  return top10;
})();
```

### Шаг 4: Скопируйте URL

После выполнения скрипта:
1. URL будут выведены в консоль
2. URL автоматически скопированы в буфер обмена

### Шаг 5: Вставьте URL в файл

1. Откройте файл `scripts/urls.txt`
2. Вставьте скопированные URL (каждый на новой строке)
3. Повторите для других категорий

### Шаг 6: Запустите парсинг

```bash
npm run parse:batch
```

---

## Альтернативный метод: Прямые ссылки

Если вы знаете конкретные товары, можете вручную добавить их URL в `urls.txt`:

```
# Виски
https://alkoteka.com/catalog/krepkiy-alkogol/dzhek-daniels-700-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/dzheymson-700-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/ballantayns-finest-700-ml/

# Водка
https://alkoteka.com/catalog/krepkiy-alkogol/russkiy-standart-original-500-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/beluga-noble-700-ml/

# и т.д.
```

Формат URL может быть:
- `/catalog/krepkiy-alkogol/name-volume-ml/`
- `/product/category/slug_id`

Оба формата поддерживаются парсером.

---

## Быстрый способ: Готовые URL

Если нужно быстро протестировать, вот несколько реальных URL товаров Alkoteka:

```
https://alkoteka.com/catalog/krepkiy-alkogol/dzhek-daniels-700-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/dzheymson-700-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/ballantayns-finest-700-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/russkiy-standart-original-500-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/beluga-noble-700-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/bombey-sapfir-700-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/tankerey-london-dry-dzhin-700-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/bakardi-beliy-rom-500-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/kapitan-morgan-spiced-gold-700-ml/
https://alkoteka.com/catalog/krepkiy-alkogol/tekila-olmeka-blanco-700-ml/
```

---

## Проверка работы парсера

Попробуйте спарсить один товар:

```bash
npm run parse:alkoteka "https://alkoteka.com/catalog/krepkiy-alkogol/dzhek-daniels-700-ml/"
```

Если работает - значит парсер настроен правильно, и можно парсить все товары из `urls.txt`.

---

**Готово!** После парсинга результаты будут в `scripts/parsed-ingredients.ts` 🎉
