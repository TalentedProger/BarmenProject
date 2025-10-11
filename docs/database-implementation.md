# База данных - Полное описание и реализация

## Обзор

Проект использует **PostgreSQL** как основную базу данных с **Drizzle ORM** для работы с данными. База данных размещена на Neon (serverless PostgreSQL).

## Подключение к базе данных

```bash
DATABASE_URL=postgresql://postgres:password@helium/heliumdb?sslmode=disable
```

## Схема базы данных

### 1. Таблица `users` - Пользователи

```typescript
{
  id: varchar (PRIMARY KEY)
  email: varchar (UNIQUE)
  nickname: varchar (NOT NULL)
  profileImageUrl: varchar
  googleId: varchar (UNIQUE)        // Google OAuth ID
  passwordHash: varchar              // Для email/password аутентификации
  emailVerified: boolean (default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Назначение**: Хранит информацию о пользователях, поддерживает два типа аутентификации:
- Google OAuth (через `googleId`)
- Email/Password (через `passwordHash`)

### 2. Таблица `ingredients` - Ингредиенты

```typescript
{
  id: serial (PRIMARY KEY)
  name: varchar(100) (NOT NULL)
  category: varchar(50) (NOT NULL)  // alcohol, juice, syrup, fruit, ice, spice
  color: varchar(7) (NOT NULL)       // hex цвет для визуализации
  abv: decimal(5,2) (default: 0)     // процент алкоголя
  pricePerLiter: decimal(10,2) (NOT NULL)
  tasteProfile: jsonb (NOT NULL)     // {sweet: 0-10, sour: 0-10, bitter: 0-10, alcohol: 0-10}
  unit: varchar(10) (default: 'ml')  // ml, g, piece, kg
  createdAt: timestamp
}
```

**Назначение**: Хранит все доступные ингредиенты для создания коктейлей.

**Категории ингредиентов**:
- `alcohol` - алкогольные напитки (водка, ром, джин и т.д.)
- `juice` - соки (апельсиновый, ананасовый, клюквенный и т.д.)
- `syrup` - сиропы (простой, гранатовый, кокосовый и т.д.)
- `fruit` - фрукты и травы (лайм, лимон, мята и т.д.)
- `ice` - виды льда (кубики, дробленый, сферический)
- `spice` - специи и добавки

### 3. Таблица `glass_types` - Типы бокалов

```typescript
{
  id: serial (PRIMARY KEY)
  name: varchar(50) (NOT NULL)
  capacity: integer (NOT NULL)       // вместимость в мл
  shape: varchar(20) (NOT NULL)      // форма бокала
  createdAt: timestamp
}
```

**Назначение**: Определяет типы бокалов для коктейлей.

**Доступные формы**: shot, old-fashioned, highball, martini, margarita, hurricane, tumbler, snifter, champagne-flute, beer-mug, red-wine, white-wine, sour, champagne-saucer

### 4. Таблица `recipes` - Рецепты коктейлей

```typescript
{
  id: uuid (PRIMARY KEY, auto-generated)
  name: varchar(100) (NOT NULL)
  description: text
  instructions: text
  createdBy: varchar → references users(id)
  glassTypeId: integer → references glass_types(id)
  totalVolume: integer (NOT NULL)              // в мл
  totalAbv: decimal(5,2) (NOT NULL)           // общая крепость
  totalCost: decimal(10,2) (NOT NULL)         // стоимость в рублях
  tasteBalance: jsonb (NOT NULL)              // профиль вкуса
  difficulty: varchar(20) (default: 'easy')   // easy, medium, hard
  category: varchar(50) (NOT NULL)            // classic, summer, shot, non-alcoholic
  isPublic: boolean (default: true)
  rating: decimal(3,2) (default: 0)
  ratingCount: integer (default: 0)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Назначение**: Основная таблица с рецептами коктейлей.

**Категории коктейлей**:
- `classic` - классические коктейли
- `summer` - летние коктейли
- `shot` - шоты
- `non-alcoholic` - безалкогольные
- `crazy` - экспериментальные

### 5. Таблица `recipe_ingredients` - Связь рецептов и ингредиентов

```typescript
{
  id: serial (PRIMARY KEY)
  recipeId: uuid → references recipes(id) ON DELETE CASCADE
  ingredientId: integer → references ingredients(id)
  amount: decimal(8,2) (NOT NULL)
  unit: varchar(10) (NOT NULL)
  order: integer (NOT NULL)           // порядок слоев для визуализации
  createdAt: timestamp
}
```

**Назначение**: Связывает рецепты с ингредиентами, указывает количество и порядок слоев.

### 6. Таблица `user_favorites` - Избранные рецепты

```typescript
{
  id: serial (PRIMARY KEY)
  userId: varchar → references users(id) ON DELETE CASCADE
  recipeId: uuid → references recipes(id) ON DELETE CASCADE
  createdAt: timestamp
}
```

**Назначение**: Хранит избранные рецепты пользователей.

### 7. Таблица `recipe_ratings` - Оценки рецептов

```typescript
{
  id: serial (PRIMARY KEY)
  userId: varchar → references users(id) ON DELETE CASCADE
  recipeId: uuid → references recipes(id) ON DELETE CASCADE
  rating: integer (NOT NULL)          // 1-5 звезд
  review: text                        // текст отзыва
  createdAt: timestamp
}
```

**Назначение**: Хранит оценки и отзывы пользователей на рецепты.

### 8. Таблица `sessions` - Сессии пользователей

```typescript
{
  sid: varchar (PRIMARY KEY)
  sess: jsonb (NOT NULL)
  expire: timestamp (NOT NULL)
  // INDEX на expire для очистки
}
```

**Назначение**: Хранит сессии пользователей для аутентификации (используется Passport.js).

## Интерфейс хранилища (IStorage)

Проект использует интерфейс `IStorage` для абстракции работы с данными:

```typescript
interface IStorage {
  // Пользователи
  getUser(id: string): Promise<User | undefined>
  getUserByEmail(email: string): Promise<User | undefined>
  getUserByGoogleId(googleId: string): Promise<User | undefined>
  upsertUser(user: UpsertUser): Promise<User>

  // Ингредиенты
  getIngredients(): Promise<Ingredient[]>
  getIngredientsByCategory(category: string): Promise<Ingredient[]>
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>

  // Типы бокалов
  getGlassTypes(): Promise<GlassType[]>
  getGlassType(id: number): Promise<GlassType | undefined>
  createGlassType(glassType: InsertGlassType): Promise<GlassType>

  // Рецепты
  getRecipes(limit?: number, offset?: number): Promise<Recipe[]>
  getRecipe(id: string): Promise<Recipe | undefined>
  getRecipeWithIngredients(id: string): Promise<RecipeWithIngredients | undefined>
  getUserRecipes(userId: string): Promise<Recipe[]>
  createRecipe(recipe: InsertRecipe): Promise<Recipe>
  updateRecipe(id: string, recipe: Partial<InsertRecipe>): Promise<Recipe>
  deleteRecipe(id: string): Promise<void>
  searchRecipes(query: string, category?: string, difficulty?: string): Promise<Recipe[]>

  // Ингредиенты рецептов
  getRecipeIngredients(recipeId: string): Promise<RecipeIngredientWithIngredient[]>
  createRecipeIngredient(recipeIngredient: InsertRecipeIngredient): Promise<RecipeIngredient>
  deleteRecipeIngredients(recipeId: string): Promise<void>

  // Избранное
  getUserFavorites(userId: string): Promise<UserFavoriteWithRecipe[]>
  addUserFavorite(userId: string, recipeId: string): Promise<UserFavorite>
  removeUserFavorite(userId: string, recipeId: string): Promise<void>
  isUserFavorite(userId: string, recipeId: string): Promise<boolean>

  // Оценки
  getRecipeRatings(recipeId: string): Promise<RecipeRating[]>
  createRecipeRating(rating: InsertRecipeRating): Promise<RecipeRating>
  updateRecipeRating(userId: string, recipeId: string, rating: number, review?: string): Promise<RecipeRating>
  getUserRecipeRating(userId: string, recipeId: string): Promise<RecipeRating | undefined>
}
```

## Миграции базы данных

Проект использует **Drizzle Kit** для миграций:

```bash
# Применить изменения схемы к базе данных
npm run db:push
```

Конфигурация миграций находится в `drizzle.config.ts`.

## Валидация данных

Проект использует **Zod** для валидации:

```typescript
// Автоматически генерируемые схемы из Drizzle
const insertIngredientSchema = createInsertSchema(ingredients)
const insertRecipeSchema = createInsertSchema(recipes)
// и т.д.

// Кастомные схемы аутентификации
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nickname: z.string().min(2).max(50)
})
```

## SQL запросы (примеры)

### Получение рецепта со всеми ингредиентами

```sql
SELECT 
  r.*,
  json_agg(
    json_build_object(
      'id', ri.id,
      'amount', ri.amount,
      'unit', ri.unit,
      'order', ri.order,
      'ingredient', json_build_object(
        'id', i.id,
        'name', i.name,
        'color', i.color,
        'abv', i.abv
      )
    ) ORDER BY ri.order
  ) as ingredients
FROM recipes r
LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
LEFT JOIN ingredients i ON ri.ingredient_id = i.id
WHERE r.id = $1
GROUP BY r.id;
```

### Поиск рецептов с фильтрами

```sql
SELECT * FROM recipes
WHERE 
  (name ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%')
  AND ($2::varchar IS NULL OR category = $2)
  AND ($3::varchar IS NULL OR difficulty = $3)
  AND is_public = true
ORDER BY rating DESC, created_at DESC
LIMIT $4 OFFSET $5;
```

## Индексы (рекомендуется добавить)

```sql
-- Для быстрого поиска
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_created_by ON recipes(created_by);
CREATE INDEX idx_recipes_rating ON recipes(rating DESC);
CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_recipe_id ON user_favorites(recipe_id);

-- Для полнотекстового поиска
CREATE INDEX idx_recipes_name_trgm ON recipes USING gin(name gin_trgm_ops);
CREATE INDEX idx_recipes_description_trgm ON recipes USING gin(description gin_trgm_ops);
```

## Резервное копирование

Рекомендуется настроить автоматическое резервное копирование через Neon Dashboard или использовать pg_dump:

```bash
# Экспорт базы данных
pg_dump $DATABASE_URL > backup.sql

# Импорт базы данных
psql $DATABASE_URL < backup.sql
```
