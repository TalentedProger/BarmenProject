# Руководство по развертыванию Cocktailo Maker

## Обзор проекта

Cocktailo Maker - это full-stack веб-приложение для создания коктейлей с интерактивным конструктором, генератором рецептов и каталогом. Проект построен на React + TypeScript (фронтенд) и Node.js + Express (бэкенд) с PostgreSQL в качестве базы данных.

## Системные требования

### Минимальные требования сервера:
- Node.js версии 20 или выше
- PostgreSQL 14+ или Neon Serverless PostgreSQL
- RAM: минимум 2 GB (рекомендуется 4 GB)
- Диск: минимум 5 GB свободного места
- ОС: Ubuntu 22.04, CentOS 8+, или другой Linux дистрибутив

## Настройка базы данных

### База данных PostgreSQL

Проект использует следующую структуру БД:

#### Основные таблицы:

1. **users** - пользователи приложения
   - Поля: id, email, nickname, profile_image_url, google_id, password_hash, email_verified, created_at, updated_at
   - Поддержка Google OAuth и email/password аутентификации

2. **sessions** - сессии пользователей  
   - Поля: sid (PK), sess (jsonb), expire
   - Используется для Express сессий

3. **ingredients** - ингредиенты для коктейлей
   - Поля: id, name, category, color, abv, price_per_liter, taste_profile, unit, created_at
   - Содержит информацию о крепости, цене, вкусовом профиле

4. **glass_types** - типы бокалов
   - Поля: id, name, capacity, shape, created_at
   - Определяет виды стаканов и их объем

5. **recipes** - рецепты коктейлей
   - Поля: id, name, description, instructions, created_by, glass_type_id, total_volume, total_abv, total_cost, taste_balance, difficulty, category, is_public, rating, rating_count, created_at, updated_at

6. **recipe_ingredients** - связь рецептов и ингредиентов
   - Поля: id, recipe_id, ingredient_id, amount, unit, order, created_at
   - Определяет состав каждого рецепта

7. **user_favorites** - избранные рецепты пользователей
8. **recipe_ratings** - рейтинги и отзывы на рецепты

### Создание базы данных:

```bash
# Для PostgreSQL локально:
sudo -u postgres createdb cocktailo_maker

# Или используйте Neon Serverless PostgreSQL (рекомендуется)
# Получите DATABASE_URL из консоли Neon
```

## Переменные окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```env
# База данных (обязательно)
DATABASE_URL=postgresql://username:password@host:port/database_name

# Или для Neon Serverless:
DATABASE_URL=postgresql://username:password@host/database_name?sslmode=require

# Дополнительные переменные БД для отладки (при необходимости)
PGHOST=localhost
PGPORT=5432
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=cocktailo_maker

# Сессии (рекомендуется генерировать случайную строку)
SESSION_SECRET=your-super-secret-session-key-here-change-in-production

# Google OAuth (опционально)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Окружение
NODE_ENV=production
PORT=5000
```

## Установка и запуск

### 1. Клонирование репозитория и установка зависимостей:

```bash
# Клонируйте проект
git clone <repository-url>
cd cocktailo-maker

# Установите зависимости
npm install
```

### 2. Настройка базы данных:

```bash
# Примените схему БД (создаст все таблицы)
npm run db:push

# Проект автоматически заполнит базу начальными данными при первом запуске
```

### 3. Сборка проекта для production:

```bash
# Соберите фронтенд и бэкенд
npm run build
```

### 4. Запуск приложения:

```bash
# В режиме разработки:
npm run dev

# В режиме production:
npm start
```

## Установленные библиотеки

### Основные production зависимости:

#### Frontend:
- **React 18** - основной фреймворк UI
- **TypeScript** - типизация
- **Vite** - сборщик и dev server
- **Tailwind CSS** - CSS фреймворк
- **Radix UI** - компоненты UI (accordion, dialog, dropdown-menu и др.)
- **React Query (@tanstack/react-query)** - управление серверным состоянием
- **Wouter** - маршрутизация
- **Zustand** - клиентское управление состоянием
- **React Hook Form** - работа с формами
- **Framer Motion** - анимации
- **Lucide React** - иконки

#### Backend:
- **Express.js** - веб-сервер
- **Drizzle ORM** - работа с БД
- **@neondatabase/serverless** - Neon PostgreSQL драйвер
- **Express Session** - управление сессиями
- **connect-pg-simple** - PostgreSQL хранилище сессий
- **Passport.js** - аутентификация
- **bcryptjs** - хеширование паролей
- **zod** - валидация данных

#### Dev Dependencies:
- **TypeScript** - компилятор TS
- **tsx** - запуск TypeScript файлов
- **esbuild** - быстрая сборка бэкенда
- **drizzle-kit** - миграции БД

## Первоначальная настройка

### При первом запуске проект автоматически:

1. **Создает схему БД** - применяет все необходимые таблицы
2. **Заполняет базовые данные**:
   - Стандартные ингредиенты (алкоголь, соки, сиропы)
   - Типы бокалов (мартини, хайбол, шот и др.)
   - Базовые рецепты коктейлей

3. **Настраивает сессии** - создает таблицу сессий для аутентификации

### Предотвращение пересоздания данных:

Проект проверяет наличие данных перед заполнением:
- Если таблицы уже содержат данные, повторное заполнение не произойдет
- Сидирование выполняется только если таблицы пустые

### Автоматическое восстановление:

В файле `server/seed.ts` реализована логика проверки:
```typescript
// Проверяет наличие ингредиентов перед заполнением
const existingIngredients = await db.select().from(ingredients).limit(1);
if (existingIngredients.length === 0) {
  // Только тогда добавляет базовые ингредиенты
}
```

## Структура проекта

```
cocktailo-maker/
├── client/               # Frontend React приложение
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── pages/       # Страницы приложения  
│   │   ├── hooks/       # Пользовательские хуки
│   │   ├── lib/         # Утилиты и хелперы
│   │   └── store/       # Zustand стор
├── server/              # Backend Express сервер
│   ├── index.ts         # Точка входа сервера
│   ├── routes.ts        # API маршруты
│   ├── db.ts           # Подключение к БД
│   ├── auth.ts         # Аутентификация
│   └── seed.ts         # Заполнение БД
├── shared/              # Общие типы и схемы
│   └── schema.ts        # Drizzle схема БД
├── migrations/          # Миграции БД
└── attached_assets/     # Статические файлы (изображения)
```

## Порты и сетевая конфигурация

- **Основной порт**: 5000 (настраивается через PORT в .env)
- **Привязка**: 0.0.0.0 (принимает подключения извне)
- Приложение обслуживает как API (бэкенд), так и статические файлы (фронтенд) на одном порту

## Резервное копирование

### Регулярно создавайте бэкапы БД:

```bash
# Создание дампа
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из дампа  
psql $DATABASE_URL < backup_file.sql
```

## Мониторинг и логи

Приложение выводит логи в stdout:
- Запросы к API с временем выполнения
- Ошибки подключения к БД
- Статус запуска сервера

## Возможные проблемы и решения

### Проблема: "Cannot find module 'tsx'"
**Решение**: 
```bash
npm install tsx --save-dev
# или глобально: npm install -g tsx
```

### Проблема: Ошибки подключения к БД
**Решение**: 
1. Проверьте правильность DATABASE_URL
2. Убедитесь, что PostgreSQL запущен
3. Проверьте сетевые настройки (фаервол)

### Проблема: Сессии не работают
**Решение**:
1. Убедитесь, что таблица sessions создана
2. Проверьте SESSION_SECRET в .env
3. Убедитесь, что connect-pg-simple правильно настроен

## Обновления и миграции

При изменении схемы БД:
```bash
# Примените изменения к БД
npm run db:push

# При необходимости принудительного обновления:
npm run db:push --force
```

---

*Этот документ содержит все необходимые инструкции для развертывания Cocktailo Maker на сервере. При следовании данному руководству приложение будет готово к работе без дополнительной настройки.*