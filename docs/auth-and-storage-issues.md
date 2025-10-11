# Проблемы с аутентификацией и сохранением данных

## Текущее состояние

### ⚠️ Основные проблемы

1. **Сохранение коктейлей и рецептов НЕ РАБОТАЕТ**
2. **Вход через Google НЕ НАСТРОЕН**
3. **Все данные теряются при перезапуске сервера**

---

## Проблема #1: Использование MemoryStorage вместо базы данных

### Что не так?

В файле `server/storage.ts` используется класс `MemoryStorage`, который хранит все данные **в памяти процесса Node.js**:

```typescript
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map()
  private recipes: Map<string, Recipe> = new Map()
  private userFavorites: Map<string, UserFavorite[]> = new Map()
  // ... и т.д.
}

// В конце файла:
export const storage = new MemoryStorage()  // ❌ Проблема!
```

### Последствия:

- ✅ База данных PostgreSQL СУЩЕСТВУЕТ (`DATABASE_URL` настроен)
- ✅ Схема базы данных ОПРЕДЕЛЕНА (в `shared/schema.ts`)
- ❌ Но данные НЕ СОХРАНЯЮТСЯ в БД
- ❌ Все создаваемые рецепты исчезают при перезапуске
- ❌ Регистрация пользователей не работает долгосрочно
- ❌ Избранное и оценки не сохраняются

### Как исправить:

Создать класс `PostgresStorage` который использует Drizzle ORM для работы с реальной БД:

```typescript
// server/storage.ts
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>

  constructor() {
    const sql = neon(process.env.DATABASE_URL!)
    this.db = drizzle(sql)
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
    return result[0]
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const result = await this.db
      .insert(recipes)
      .values(recipe)
      .returning()
    return result[0]
  }
  
  // ... остальные методы
}

// Использовать PostgresStorage вместо MemoryStorage
export const storage = process.env.DATABASE_URL 
  ? new PostgresStorage()
  : new MemoryStorage()
```

### Примеры Drizzle ORM запросов:

```typescript
import { eq, and, like, desc } from 'drizzle-orm'

// SELECT с условием
await db.select().from(users).where(eq(users.email, email))

// INSERT
await db.insert(recipes).values({ name: 'Mojito', ... })

// UPDATE
await db.update(recipes).set({ rating: '4.5' }).where(eq(recipes.id, id))

// DELETE
await db.delete(recipes).where(eq(recipes.id, id))

// JOIN
await db
  .select()
  .from(recipes)
  .leftJoin(recipeIngredients, eq(recipes.id, recipeIngredients.recipeId))
  .where(eq(recipes.id, id))

// Поиск
await db
  .select()
  .from(recipes)
  .where(
    and(
      like(recipes.name, `%${query}%`),
      eq(recipes.category, category)
    )
  )
  .orderBy(desc(recipes.rating))
```

---

## Проблема #2: Google OAuth не настроен

### Что не так?

В логах при запуске видно:
```
Google OAuth credentials not provided. Google authentication will be disabled.
```

Это происходит потому что отсутствуют переменные окружения:
```bash
GOOGLE_CLIENT_ID=<не установлен>
GOOGLE_CLIENT_SECRET=<не установлен>
```

### Текущая реализация в `server/auth.ts`:

```typescript
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Настройка Google OAuth
  passport.use(new GoogleStrategy({ ... }))
} else {
  console.warn('Google OAuth credentials not provided.')
}
```

### Fallback маршруты:
```typescript
// Если нет credentials, редирект с ошибкой
app.get('/api/auth/google', (req, res) => {
  res.redirect('/auth?error=google_oauth_not_configured')
})
```

### Как исправить:

#### Шаг 1: Получить Google OAuth credentials

1. Перейти в [Google Cloud Console](https://console.cloud.google.com/)
2. Создать новый проект или выбрать существующий
3. Включить "Google+ API"
4. Создать "OAuth 2.0 Client ID":
   - Application type: Web application
   - Authorized JavaScript origins: 
     - `https://your-replit-domain.repl.co`
     - `http://localhost:5000` (для разработки)
   - Authorized redirect URIs:
     - `https://your-replit-domain.repl.co/api/auth/google/callback`
     - `http://localhost:5000/api/auth/google/callback`

5. Скопировать Client ID и Client Secret

#### Шаг 2: Добавить в переменные окружения

В Replit:
- Secrets → Add new secret
- `GOOGLE_CLIENT_ID` = ваш Client ID
- `GOOGLE_CLIENT_SECRET` = ваш Client Secret

Или локально в `.env`:
```bash
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
```

#### Шаг 3: Перезапустить сервер

После добавления credentials, Google OAuth заработает автоматически.

### Альтернатива: Replit Auth

Вместо Google OAuth можно использовать встроенную Replit аутентификацию:

```typescript
import { getOpenIDClient } from 'openid-client'

// Получить OpenID клиент
const replitClient = await getOpenIDClient()

// Настроить маршруты
app.get('/api/auth/replit', async (req, res) => {
  const authUrl = replitClient.authorizationUrl({
    scope: 'openid profile email',
    redirect_uri: `${process.env.REPLIT_DOMAINS}/api/auth/replit/callback`
  })
  res.redirect(authUrl)
})

app.get('/api/auth/replit/callback', async (req, res) => {
  const tokenSet = await replitClient.callback(...)
  const userInfo = await replitClient.userinfo(tokenSet)
  // Создать пользователя в БД
  // ...
})
```

---

## Проблема #3: Сессии используют MemoryStore

### Что не так?

В `server/auth.ts`:

```typescript
if (process.env.DATABASE_URL) {
  // PostgreSQL store
  sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    tableName: "sessions"
  })
} else {
  // Memory store ❌
  sessionStore = new MemStore({ ttl: sessionTtl })
}
```

Проблема: **DATABASE_URL существует**, но сессии всё равно используют MemoryStore из-за ошибки подключения к БД.

### Ошибка в логах:

```
Error seeding database: ErrorEvent {
  ...
  code: 'SELF_SIGNED_CERT_IN_CHAIN'
}
```

### Как исправить:

#### Вариант 1: Игнорировать SSL ошибку (только для разработки)

```typescript
const pgStore = connectPg(session)
sessionStore = new pgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
  ssl: { rejectUnauthorized: false }  // ⚠️ Только для dev!
})
```

#### Вариант 2: Использовать правильный SSL

```typescript
sessionStore = new pgStore({
  conString: process.env.DATABASE_URL.replace('sslmode=disable', 'sslmode=require'),
  ssl: true
})
```

#### Вариант 3: Neon HTTP driver (рекомендуется)

```typescript
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

// Использовать HTTP вместо WebSocket
// Нет проблем с SSL
```

---

## Проблема #4: API маршруты для избранного и оценок - заглушки

### Текущая реализация в `server/routes.ts`:

```typescript
// ❌ Демо-режим - данные не сохраняются!
app.post('/api/users/:userId/favorites', async (req, res) => {
  res.status(201).json({ message: "Favorite added (demo mode)" })
})

app.post('/api/recipes/:recipeId/ratings', async (req, res) => {
  res.status(201).json({ message: "Rating added (demo mode)" })
})
```

### Как исправить:

```typescript
// Избранное - правильная реализация
app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.id
    const { recipeId } = req.body
    
    const favorite = await storage.addUserFavorite(userId, recipeId)
    res.status(201).json(favorite)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add favorite' })
  }
})

app.delete('/api/favorites/:recipeId', isAuthenticated, async (req: any, res) => {
  const userId = req.user?.id
  await storage.removeUserFavorite(userId, req.params.recipeId)
  res.status(204).send()
})

// Оценки - правильная реализация
app.post('/api/recipes/:recipeId/ratings', isAuthenticated, async (req: any, res) => {
  const userId = req.user?.id
  const { rating, review } = req.body
  
  const existingRating = await storage.getUserRecipeRating(userId, req.params.recipeId)
  
  let result
  if (existingRating) {
    result = await storage.updateRecipeRating(userId, req.params.recipeId, rating, review)
  } else {
    result = await storage.createRecipeRating({
      userId,
      recipeId: req.params.recipeId,
      rating,
      review
    })
  }
  
  // Обновить средний рейтинг рецепта
  const allRatings = await storage.getRecipeRatings(req.params.recipeId)
  const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
  
  await storage.updateRecipe(req.params.recipeId, {
    rating: avgRating.toFixed(2),
    ratingCount: allRatings.length
  })
  
  res.status(201).json(result)
})
```

---

## Проблема #5: Email/Password аутентификация работает, но данные не сохраняются

### Что работает:

- ✅ Регистрация новых пользователей
- ✅ Вход по email/password
- ✅ Хеширование паролей (bcrypt)
- ✅ Валидация форм (Zod)

### Что НЕ работает:

- ❌ Пользователи исчезают при перезапуске
- ❌ Сессии не сохраняются между перезапусками
- ❌ Нельзя восстановить пароль

### Как исправить:

После перехода на PostgresStorage всё заработает автоматически.

Дополнительно можно добавить:

1. **Восстановление пароля**:
```typescript
// Генерация токена сброса
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body
  const user = await storage.getUserByEmail(email)
  if (!user) return res.json({ success: true }) // Безопасность
  
  const resetToken = nanoid()
  // Сохранить токен с TTL 1 час
  await storage.createPasswordResetToken(user.id, resetToken)
  
  // Отправить email с ссылкой
  // await sendEmail(email, `Reset link: /reset-password?token=${resetToken}`)
  
  res.json({ success: true })
})

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body
  
  const userId = await storage.validateResetToken(token)
  if (!userId) return res.status(400).json({ error: 'Invalid token' })
  
  const passwordHash = await bcrypt.hash(newPassword, 12)
  await storage.updateUser(userId, { passwordHash })
  await storage.deleteResetToken(token)
  
  res.json({ success: true })
})
```

2. **Email верификация**:
```typescript
app.post('/api/auth/send-verification', async (req, res) => {
  const user = req.user as User
  const token = nanoid()
  
  await storage.createVerificationToken(user.id, token)
  // await sendEmail(user.email, `Verify: /verify?token=${token}`)
  
  res.json({ success: true })
})

app.get('/api/auth/verify', async (req, res) => {
  const { token } = req.query
  const userId = await storage.validateVerificationToken(token)
  
  if (userId) {
    await storage.updateUser(userId, { emailVerified: true })
    res.redirect('/?verified=true')
  } else {
    res.redirect('/?error=invalid_token')
  }
})
```

---

## План миграции (Roadmap)

### Фаза 1: Исправление хранилища (высокий приоритет)

- [ ] Создать PostgresStorage класс с Drizzle ORM
- [ ] Реализовать все методы IStorage для PostgreSQL
- [ ] Применить миграции: `npm run db:push`
- [ ] Протестировать CRUD операции
- [ ] Переключить `storage` с Memory на Postgres

### Фаза 2: Исправление аутентификации

- [ ] Настроить Google OAuth credentials
- [ ] Или перейти на Replit Auth
- [ ] Исправить PostgreSQL session store
- [ ] Протестировать вход/выход

### Фаза 3: Функционал избранного и оценок

- [ ] Заменить demo endpoints на реальные
- [ ] Реализовать добавление/удаление избранного
- [ ] Реализовать систему оценок
- [ ] Обновлять средний рейтинг рецептов

### Фаза 4: Дополнительные функции

- [ ] Восстановление пароля
- [ ] Email верификация  
- [ ] Социальные функции (поделиться)
- [ ] Уведомления

---

## Проверка текущего состояния

### Как проверить, что используется MemoryStorage:

```bash
# В логах при запуске будет:
"Using memory session store (demo mode)"

# Создать рецепт через API
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","category":"classic",...}'

# Перезапустить сервер

# Попробовать получить рецепт - его не будет
curl http://localhost:5000/api/recipes
# Вернёт: []
```

### Как проверить, что Google OAuth не работает:

```bash
# Открыть в браузере
http://localhost:5000/api/auth/google

# Редирект на:
http://localhost:5000/auth?error=google_oauth_not_configured
```

### Как проверить подключение к БД:

```bash
# Выполнить SQL напрямую
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"

# Если ошибка SSL - БД есть, но подключение не работает
```

---

## Итоговая схема исправлений

```
┌─────────────────────────────────────────┐
│  1. PostgresStorage вместо MemoryStorage │
│     ↓                                    │
│  2. Google OAuth credentials ИЛИ         │
│     Replit Auth                          │
│     ↓                                    │
│  3. PostgreSQL session store             │
│     ↓                                    │
│  4. Реальные API endpoints               │
│     ↓                                    │
│  5. Тестирование                         │
└─────────────────────────────────────────┘
```

После всех исправлений:
- ✅ Данные сохраняются в PostgreSQL
- ✅ Работает вход через Google или Replit
- ✅ Сессии переживают перезапуск
- ✅ Избранное и оценки работают
- ✅ Можно деплоить в production
