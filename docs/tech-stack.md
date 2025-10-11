# Технический стек проекта Cocktailo Maker

## Backend (Сервер)

### Основной стек
- **Runtime**: Node.js 20
- **Framework**: Express.js 4.21.2
- **Language**: TypeScript 5.6.3 с ES modules
- **Build Tool**: esbuild 0.25.0 + tsx 4.20.4

### База данных
- **СУБД**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM 0.39.1
- **Migrations**: Drizzle Kit 0.30.4
- **Driver**: @neondatabase/serverless 0.10.4
- **Validation**: Zod 3.24.2 + drizzle-zod 0.7.0

### Аутентификация и безопасность
- **Auth Framework**: Passport.js 0.7.0
- **Strategies**:
  - Google OAuth 2.0: passport-google-oauth20 2.0.0
  - Local (Email/Password): passport-local 1.0.0
- **Password Hashing**: bcryptjs 3.0.2
- **Session Management**: 
  - express-session 1.18.1
  - connect-pg-simple 10.0.0 (PostgreSQL store)
  - memorystore 1.6.7 (fallback)
- **ID Generation**: nanoid 5.1.5

### Утилиты
- **Caching/Memoization**: memoizee 0.4.17
- **WebSocket**: ws 8.18.0

## Frontend (Клиент)

### Core технологии
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.19
- **Language**: TypeScript 5.6.3
- **Routing**: Wouter 3.3.5
- **State Management**: Zustand 5.0.6

### UI библиотеки и компоненты
- **Component Library**: Radix UI (полный набор primitives)
  - Dialog, Dropdown, Select, Popover, Tooltip и др.
- **Styling**: 
  - Tailwind CSS 3.4.17
  - @tailwindcss/vite 4.1.3
  - @tailwindcss/typography 0.5.15
  - tailwindcss-animate 1.0.7
  - tw-animate-css 1.2.5
- **Class Management**: 
  - clsx 2.1.1
  - tailwind-merge 2.6.0
  - class-variance-authority 0.7.1
- **Icons**: 
  - lucide-react 0.453.0
  - react-icons 5.4.0

### Формы и валидация
- **Form Management**: react-hook-form 7.55.0
- **Validation**: @hookform/resolvers 3.10.0
- **Schema**: Zod 3.24.2

### Data Fetching
- **Query Library**: @tanstack/react-query 5.60.5

### Специализированные компоненты
- **Animations**: framer-motion 11.18.2
- **Date Picker**: react-day-picker 8.10.1
- **Carousel**: 
  - swiper 11.2.10
  - embla-carousel-react 8.6.0
- **Charts**: recharts 2.15.2
- **Command Palette**: cmdk 1.1.1
- **OTP Input**: input-otp 1.4.2
- **Drawer**: vaul 1.1.2
- **Resizable Panels**: react-resizable-panels 2.1.7
- **Themes**: next-themes 0.4.6
- **Date Utils**: date-fns 3.6.0

## Development инструменты

### Dev Dependencies
- **TypeScript Types**:
  - @types/node 20.16.11
  - @types/react 18.3.11
  - @types/react-dom 18.3.1
  - @types/express 4.17.21
  - @types/passport* (все стратегии)
  - @types/bcryptjs, ws, session и др.

### Build & Dev Tools
- **Vite Plugins**:
  - @vitejs/plugin-react 4.3.2
  - @replit/vite-plugin-cartographer 0.2.7
  - @replit/vite-plugin-runtime-error-modal 0.0.3
- **CSS Processing**:
  - postcss 8.4.47
  - autoprefixer 10.4.20
- **Module Bundler**: esbuild 0.25.0
- **Dev Server**: tsx 4.20.4

### Утилиты разработки
- **Source Maps**: @jridgewell/trace-mapping 0.3.25
- **Error Handling**: zod-validation-error 3.4.0

## Архитектура проекта

### Структура директорий
```
/
├── client/              # Frontend приложение
│   ├── src/
│   │   ├── components/  # React компоненты
│   │   ├── pages/       # Страницы приложения
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Утилиты и хелперы
│   │   └── App.tsx      # Главный компонент
│   └── index.html
│
├── server/              # Backend приложение
│   ├── index.ts         # Entry point
│   ├── routes.ts        # API маршруты
│   ├── auth.ts          # Аутентификация
│   ├── storage.ts       # Слой работы с данными
│   ├── seed.ts          # Инициализация БД
│   └── vite.ts          # Vite интеграция
│
├── shared/              # Общий код
│   └── schema.ts        # Схемы БД и типы
│
├── attached_assets/     # Статические файлы
└── docs/               # Документация
```

### API Routes структура
- `/api/auth/*` - Аутентификация (login, register, Google OAuth)
- `/api/ingredients` - CRUD для ингредиентов
- `/api/glass-types` - CRUD для типов бокалов
- `/api/recipes` - CRUD для рецептов
- `/api/recipes/generate` - Генератор случайных коктейлей
- `/api/favorites` - Избранные рецепты
- `/api/recipes/:id/ratings` - Оценки рецептов

### Environment Variables
```bash
# Обязательные
PORT=5000
NODE_ENV=development|production
DATABASE_URL=postgresql://...

# Опциональные (для Google OAuth)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Сессии
SESSION_SECRET=... # Генерируется автоматически если не указан

# Replit специфичные
REPLIT_DOMAINS=... # Автоматически устанавливается
```

## Production Build

### Build команды
```bash
# Development
npm run dev          # Запуск dev сервера

# Production build
npm run build        # Сборка frontend + backend
npm start           # Запуск production сервера

# Database
npm run db:push     # Применить миграции
npm run check       # TypeScript проверка
```

### Production оптимизации
- Server-Side Rendering: Нет (SPA)
- Code Splitting: Да (Vite автоматически)
- Minification: Да (esbuild)
- Tree Shaking: Да (Vite + esbuild)
- Bundle Size: Оптимизирован

## Безопасность

### Реализованные меры
- ✅ HTTPS в production (Replit автоматически)
- ✅ Session cookies с httpOnly flag
- ✅ Password hashing с bcrypt (12 rounds)
- ✅ SQL injection защита (Drizzle ORM)
- ✅ XSS защита (React автоматически)
- ✅ CORS настройки

### Рекомендации для production
- [ ] Rate limiting на API endpoints
- [ ] CSRF protection
- [ ] Input sanitization
- [ ] Content Security Policy headers
- [ ] Регулярное обновление зависимостей

## Performance

### Оптимизации
- React Query для кэширования данных
- Memoization критичных вычислений (memoizee)
- Lazy loading компонентов (React.lazy)
- Image optimization (рекомендуется добавить)
- Bundle size optimization через Vite

## Совместимость браузеров

Поддержка современных браузеров:
- Chrome/Edge: последние 2 версии
- Firefox: последние 2 версии
- Safari: последние 2 версии
- Mobile browsers: iOS Safari 14+, Chrome Android

Browserslist config:
```
> 0.5%
last 2 versions
not dead
```
