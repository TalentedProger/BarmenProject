# 🚀 Чек-лист для деплоя исправлений

> **Дата**: 21 августа 2026  
> **Цель**: Исправление SEO индексации, динамических импортов и CSP

---

## ✅ Что было исправлено

### 1. SEO Индексация
- ✅ `robots.txt` - правильные Allow/Disallow для страниц
- ✅ `vercel.json` - X-Robots-Tag для личных страниц
- ✅ `generate-sitemap.ts` - удалены личные страницы из sitemap

### 2. Динамические импорты
- ✅ `vite.config.ts` - manualChunks для стабильных имен
- ✅ `landing.tsx` - Error Boundary для graceful degradation

### 3. Content Security Policy
- ✅ `vercel.json` - CSP заголовок настроен

---

## 📋 Шаги для деплоя

### Шаг 1: Проверка локально

```bash
# Регенерация sitemap
npm run generate:sitemap

# Проверка билда
npm run build

# Проверка производственного билда
npm run start
```

Откройте http://localhost:3000 и проверьте:
- ✅ Главная страница загружается
- ✅ Все секции отображаются
- ✅ Нет ошибок в консоли

### Шаг 2: Коммит изменений

```bash
git add -A
git commit -m "fix: SEO indexing, dynamic imports, CSP

- Updated robots.txt with proper Allow/Disallow rules
- Added X-Robots-Tag headers for private pages
- Configured Vite manualChunks for stable chunk names
- Added Error Boundary for lazy-loaded components
- Configured Content Security Policy headers
- Removed private pages from sitemap generation"
git push origin main
```

### Шаг 3: Проверка после деплоя (через 2-3 минуты)

#### A) Проверка robots.txt
```bash
curl https://cocktailomaker.ru/robots.txt
```

**Ожидаемый результат**:
```
Allow: /catalog
Allow: /courses
Disallow: /profile
Disallow: /favorites
```

#### B) Проверка X-Robots-Tag
```bash
curl -I https://cocktailomaker.ru/profile
curl -I https://cocktailomaker.ru/favorites
```

**Ожидаемый результат**:
```
X-Robots-Tag: noindex, nofollow
```

#### C) Проверка CSP
```bash
curl -I https://cocktailomaker.ru/
```

**Ожидаемый результат**:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://mc.yandex.ru...
```

#### D) Проверка динамических импортов

1. Откройте https://cocktailomaker.ru/
2. Откройте DevTools → Network
3. Перезагрузите страницу (Ctrl+Shift+R)
4. Проверьте, что все JS чанки загружаются (200 OK):
   - ✅ `react-vendor-*.js`
   - ✅ `ui-vendor-*.js`
   - ✅ `swiper-*.js`
   - ✅ `PopularRecipesSection-*.js`

#### E) Проверка sitemap
```bash
curl https://cocktailomaker.ru/sitemap.xml | head -50
```

**Ожидаемый результат**:
```xml
<url>
  <loc>https://cocktailomaker.ru/catalog</loc>
  ...
</url>
<!-- НЕ ДОЛЖНО БЫТЬ /favorites или /profile -->
```

---

## 🌐 Обновление Search Console

### Google Search Console

1. Перейдите: https://search.google.com/search-console
2. Выберите свойство: `cocktailomaker.ru`
3. Перейдите: **Файлы Sitemap**
4. Удалите старый sitemap (если есть)
5. Добавьте новый sitemap:
   ```
   https://cocktailomaker.ru/sitemap.xml
   ```
6. Нажмите **Отправить**
7. Перейдите: **URL Inspection**
8. Проверьте главную страницу:
   ```
   https://cocktailomaker.ru/
   ```
9. Нажмите **Запросить индексацию**

### Яндекс.Вебмастер

1. Перейдите: https://webmaster.yandex.ru
2. Выберите сайт: `cocktailomaker.ru`
3. Перейдите: **Индексирование → Файлы Sitemap**
4. Удалите старый sitemap (если есть)
5. Добавьте новый sitemap:
   ```
   https://cocktailomaker.ru/sitemap.xml
   ```
6. Нажмите **Добавить**
7. Перейдите: **Проверка сайта → Переобход страниц**
8. Добавьте важные страницы для переобхода:
   ```
   https://cocktailomaker.ru/
   https://cocktailomaker.ru/catalog
   https://cocktailomaker.ru/constructor
   https://cocktailomaker.ru/generator
   ```

---

## 🧪 Тестирование Rich Results

### Google Rich Results Test

1. Перейдите: https://search.google.com/test/rich-results
2. Введите URL любого рецепта:
   ```
   https://cocktailomaker.ru/recipe/1
   ```
3. Нажмите **Проверить URL**
4. Убедитесь, что Schema.org Recipe найден
5. Проверьте, что все поля заполнены:
   - ✅ name
   - ✅ image
   - ✅ recipeIngredient
   - ✅ recipeInstructions
   - ✅ aggregateRating
   - ✅ prepTime, cookTime, totalTime
   - ✅ author, keywords, recipeCuisine

### Schema.org Validator

1. Перейдите: https://validator.schema.org/
2. Выберите вкладку: **URL**
3. Введите URL рецепта:
   ```
   https://cocktailomaker.ru/recipe/1
   ```
4. Нажмите **Run Test**
5. Убедитесь в отсутствии ошибок

---

## 📊 Мониторинг (через 1-2 недели)

### Метрики для отслеживания

#### Google Search Console
- **Покрытие**: Должно быть ~20 страниц (было ~50)
- **Производительность**: CTR должен вырасти на 10-15%
- **Ошибки**: Ошибка CSP eval должна исчезнуть

#### Google Analytics
- **Bounce Rate**: Должен снизиться на 3-5%
- **Time on Site**: Должен вырасти на 10-15%
- **Органический трафик**: Должен вырасти на 20-40% (через 2-3 месяца)

#### Ошибки в консоли
- Откройте https://cocktailomaker.ru/
- Откройте DevTools → Console
- Не должно быть ошибок типа:
  - ❌ "Failed to fetch dynamically imported module"
  - ❌ "Refused to evaluate a string as JavaScript"

---

## 🔍 Troubleshooting

### Проблема: Sitemap не обновился

**Решение**:
```bash
# Очистить кэш
rm client/public/sitemap.xml
rm client/dist/sitemap.xml

# Регенерировать
npm run generate:sitemap

# Деплой
git add client/public/sitemap.xml
git commit -m "chore: regenerate sitemap"
git push origin main
```

### Проблема: X-Robots-Tag не работает

**Проверка**:
```bash
curl -I https://cocktailomaker.ru/profile
```

Если нет заголовка `X-Robots-Tag`:
1. Проверьте, что изменения в `vercel.json` задеплоились
2. Очистите кэш Vercel: `Deployments → ... → Clear Cache`
3. Пересоберите: `git commit --allow-empty -m "rebuild" && git push`

### Проблема: CSP блокирует ресурсы

**Проверка**:
1. Откройте DevTools → Console
2. Ищите ошибки типа: "Refused to load..."

**Решение**:
- Добавьте нужный домен в CSP в `vercel.json`
- Пример: `script-src 'self' https://new-domain.com`

### Проблема: Динамические импорты всё ещё падают

**Проверка**:
1. Откройте DevTools → Network
2. Перезагрузите страницу
3. Найдите Failed запросы

**Решение**:
```bash
# Пересобрать с чистого листа
rm -rf client/dist node_modules/.vite
npm install
npm run build
```

---

## ✅ Финальный чек-лист

### Сразу после деплоя
- [ ] ✅ robots.txt содержит правильные правила
- [ ] ✅ X-Robots-Tag установлен для личных страниц
- [ ] ✅ CSP заголовок присутствует
- [ ] ✅ Sitemap обновлён
- [ ] ✅ Динамические импорты работают (нет 404)
- [ ] ✅ Главная страница загружается без ошибок

### В течение часа
- [ ] ✅ Sitemap отправлен в Google Search Console
- [ ] ✅ Sitemap отправлен в Яндекс.Вебмастер
- [ ] ✅ Rich Results Test пройден
- [ ] ✅ Schema.org Validator пройден

### Через 1-2 недели
- [ ] 📊 Google переиндексировал сайт
- [ ] 📊 Личные страницы удалены из индекса
- [ ] 📊 CSP ошибка исчезла из Search Console
- [ ] 📊 CTR вырос на 10-15%
- [ ] 📊 Ошибки динамических импортов <1%

### Через 1-2 месяца
- [ ] 📈 Органический трафик вырос на 20-40%
- [ ] 📈 Bounce Rate снизился на 3-5%
- [ ] 📈 Time on Site вырос на 10-15%

---

## 📞 Поддержка

Если что-то не работает:

1. **Проверьте логи деплоя** на Vercel
2. **Проверьте DevTools Console** на наличие ошибок
3. **Проверьте Google Search Console** → Покрытие → Ошибки
4. **Обратитесь к документации**:
   - `SEO_ANALYSIS_AND_FIXES.md` - подробный анализ
   - `README_SEO.md` - общая SEO документация

---

**Удачи с деплоем! 🚀**

*Последнее обновление: 21 августа 2026*
