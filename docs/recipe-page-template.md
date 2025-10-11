# Шаблон страницы рецепта коктейля

## Обзор

Внутренняя страница рецепта (`/recipe/:id`) отображает полную информацию о коктейле с интерактивными элементами, визуализацией и возможностью оценки.

## Текущая реализация

### Путь к файлу
`client/src/pages/RecipePage.tsx`

### Структура данных рецепта

```typescript
interface RecipeData {
  id: number | string
  name: string
  image: string  // URL изображения коктейля
  description: string
  tags: string[]  // ["🌿 Лёгкий", "🌱 Мятный", "❄️ Освежающий"]
  
  // Характеристики
  abv: number      // Крепость в %
  volume: number   // Объём в мл
  calories: number // Калорийность
  price: number    // Стоимость в рублях
  rating: number   // Средняя оценка (0-5)
  reviewCount: number
  
  // Видео
  videoUrl?: string  // YouTube URL (опционально)
  
  // Ингредиенты
  ingredients: Array<{
    name: string
    amount: string  // "50 мл", "½ штуки"
    icon: string    // Эмодзи "🥃", "🌿"
  }>
  
  // Пошаговый рецепт
  steps: Array<{
    icon: string    // Эмодзи для визуализации
    text: string    // Краткое описание
    step: number    // Номер шага
  }>
  
  // Оборудование
  equipment: Array<{
    name: string
    icon: string    // Эмодзи
  }>
  
  // Вкусовой профиль
  taste: {
    sweetness: number     // 0-5
    sourness: number      // 0-5
    bitterness: number    // 0-5
    strength: number      // 0-5 (крепость)
    refreshing: number    // 0-5 (освежающая сила)
  }
  
  // Рекомендации
  recommendations: Array<{
    name: string
    image: string
  }>
}
```

## Секции страницы

### 1. Hero секция (верхняя часть)
- **Фоновое видео**: Зацикленное без звука
- **Название коктейля**: Крупный текст с неоновым эффектом
- **Теги**: Горизонтальный список тегов
- **Кнопка "Назад"**: В левом верхнем углу

```tsx
<section className="relative min-h-[70vh] flex items-center justify-center">
  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
    <source src="/video.mp4" type="video/mp4" />
  </video>
  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
  
  <div className="relative z-10 text-center">
    <h1 className="text-6xl font-bold text-white mb-8">
      {recipe.name}
    </h1>
    <div className="flex flex-wrap justify-center gap-3 mb-16">
      {recipe.tags.map(tag => (
        <span className="px-4 py-2 bg-zinc-800/80 backdrop-blur-sm text-cyan-400 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  </div>
</section>
```

### 2. Основной контент (max-width: 6xl)

#### 2.1 Состав и расчёты (2 колонки на desktop)

```tsx
<section className="flex flex-col md:flex-row gap-8 mb-16">
  {/* Что внутри? */}
  <div className="flex-1">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">
      🧪 Что внутри?
    </h2>
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full">
      {recipe.ingredients.map(ingredient => (
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{ingredient.icon}</span>
            <span className="text-lg">{ingredient.name}</span>
          </div>
          <span className="text-cyan-400 font-semibold">{ingredient.amount}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Расчёты */}
  <div className="flex-1">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">📊 Расчёты</h2>
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-3 border border-white/10 h-full">
      <div className="grid grid-cols-2 gap-4">
        {/* ABV, Объём, Калории, Стоимость - 4 карточки */}
      </div>
    </div>
  </div>
</section>
```

#### 2.2 Оборудование и Пошаговый рецепт (2 колонки)

```tsx
<section className="flex flex-col lg:flex-row gap-8 mb-16">
  {/* Что потребуется? */}
  <div className="flex-1">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">
      Что потребуется ?
    </h2>
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full flex flex-col">
      <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        {recipe.equipment.map(item => (
          <div className="text-center p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl">
            <div className="text-4xl mb-3">{item.icon}</div>
            <div className="text-white font-semibold">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Пошаговый рецепт - кликабельная карточка */}
  <div className="flex-1 flex flex-col">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">
      Пошаговый рецепт
    </h2>
    <div className="rounded-2xl p-6 flex-1">
      {/* Показывается только один шаг, клик переключает на следующий */}
      <div className="cursor-pointer" onClick={nextStep}>
        <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/50 rounded-2xl p-6">
          <div className="text-cyan-300 text-lg font-medium mb-2">
            Шаг {currentStep}
          </div>
          <div className="text-white text-xl font-semibold mb-4">
            {step.text}
          </div>
          <div className="text-4xl mb-4">{step.icon}</div>
          <p className="text-zinc-300 text-sm">
            {detailedDescription}
          </p>
          <p className="text-cyan-400/60 text-xs mt-4">
            Нажмите для перехода к следующему шагу
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### 2.3 Анализ вкуса (полукруглые индикаторы)

```tsx
<section className="mb-16">
  <h2 className="text-3xl font-bold text-white mb-6 text-center">
    🧠 Анализ вкуса
  </h2>
  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
    {/* 5 полукруглых индикаторов: */}
    {/* Сладость, Кислотность, Горечь, Крепость, Освежающая сила */}
    <TasteSemicircles taste={recipe.taste} />
  </div>
</section>
```

**Компонент TasteSemicircles**: SVG полукруги с сегментами (5 делений), цветная подсветка по значению.

#### 2.4 Оценка пользователя

```tsx
<section className="mb-16">
  <h2 className="text-3xl font-bold text-white mb-6 text-center">
    Ваша оценка
  </h2>
  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6">
    <div className="flex items-center justify-between">
      {/* В избранное */}
      <Button>
        <Heart className="w-5 h-5 mr-2 flex-shrink-0" />
        В избранное
      </Button>
      
      {/* Звёзды рейтинга */}
      <div className="text-center">
        <div className="flex justify-center space-x-2">
          {[1,2,3,4,5].map(star => (
            <Star onClick={() => setRating(star)} />
          ))}
        </div>
        <div className="text-white/60 text-sm">
          {recipe.rating} ({recipe.reviewCount} отзывов)
        </div>
      </div>
      
      {/* Поделиться */}
      <Button>
        <Share2 className="w-5 h-5 mr-2 flex-shrink-0" />
        Поделиться
      </Button>
    </div>
  </div>
</section>
```

#### 2.5 Рекомендации

```tsx
<section className="mb-16">
  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">
      🧬 Если понравилось — попробуй ещё
    </h2>
    <div className="grid md:grid-cols-2 gap-6">
      {recipe.recommendations.map(rec => (
        <div className="bg-white/5 rounded-xl p-6 cursor-pointer hover:bg-white/10">
          <img src={rec.image} className="w-full h-48 object-cover rounded-lg mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">{rec.name}</h3>
          <Button className="w-full">Открыть рецепт</Button>
        </div>
      ))}
    </div>
  </div>
</section>
```

## Интеграция с API

### Получение рецепта

```typescript
// В компоненте
const { id } = useParams()

const { data: recipe, isLoading } = useQuery({
  queryKey: ['/api/recipes', id],
  // queryFn автоматически использует fetch с этим URL
})
```

### API endpoint
```
GET /api/recipes/:id
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Мохито",
  "description": "Освежающий кубинский коктейль",
  "glassTypeId": 3,
  "totalVolume": 200,
  "totalAbv": "10.00",
  "totalCost": "240.00",
  "tasteBalance": {
    "sweetness": 3,
    "sourness": 3,
    "bitterness": 1,
    "strength": 2,
    "refreshing": 5
  },
  "difficulty": "easy",
  "category": "classic",
  "rating": "4.8",
  "ratingCount": 342,
  "ingredients": [
    {
      "id": 1,
      "amount": "50.00",
      "unit": "ml",
      "order": 1,
      "ingredient": {
        "id": 2,
        "name": "Белый ром Bacardi",
        "color": "#FFFACD",
        "abv": "40.00"
      }
    }
    // ... другие ингредиенты
  ]
}
```

## Добавление нового рецепта

### Шаги для создания новой страницы рецепта

1. **Создать данные рецепта**:
   - Добавить recipe в базу данных через API
   - Или создать статические данные как в `RecipePage.tsx`

2. **Подготовить ассеты**:
   - Фоновое видео (MP4, зацикленное)
   - Фото коктейля (высокое качество)
   - Фото для рекомендаций

3. **Определить маршрут**:
```tsx
// В App.tsx
<Route path="/recipe/:id" component={RecipePage} />
```

4. **Использовать шаблон**:
```tsx
export default function NewRecipePage() {
  const params = useParams()
  
  // Либо fetch из API
  const { data: recipe } = useQuery({
    queryKey: ['/api/recipes', params.id]
  })
  
  // Либо статические данные
  const recipe = staticRecipeData
  
  // Остальной код по шаблону...
}
```

## Стилизация и дизайн

### Цветовая схема
- **Фон**: Градиент от `#0A0A0D` через `#1B1B1F` до `#0A0A0D`
- **Карточки**: `bg-black/40` с `backdrop-blur-sm`
- **Borders**: `border-white/10` или `border-white/20`
- **Текст**: 
  - Заголовки: `text-white`
  - Описания: `text-zinc-300`
  - Акценты: `text-cyan-400`

### Анимации
- **Hover эффекты**: `hover:scale-105`, `hover:bg-white/10`
- **Transitions**: `transition-all duration-300`
- **Shadows**: `shadow-lg shadow-cyan-500/25`

### Адаптивность
- **Mobile** (<768px): Одна колонка
- **Tablet** (768px-1024px): Адаптивная сетка
- **Desktop** (>1024px): Две колонки для основных секций

## Интерактивные элементы

### Кнопки действий

1. **В избранное**:
```tsx
const { mutate: addToFavorites } = useMutation({
  mutationFn: () => apiRequest('POST', `/api/users/${userId}/favorites`, {
    recipeId: recipe.id
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/favorites'] })
    toast({ title: 'Добавлено в избранное!' })
  }
})
```

2. **Оценка**:
```tsx
const { mutate: rateRecipe } = useMutation({
  mutationFn: (rating: number) => apiRequest('POST', 
    `/api/recipes/${recipe.id}/ratings`, { rating }
  ),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/recipes', recipe.id] })
  }
})
```

3. **Поделиться**:
```tsx
const handleShare = async () => {
  if (navigator.share) {
    await navigator.share({
      title: recipe.name,
      text: recipe.description,
      url: window.location.href
    })
  } else {
    // Fallback - копирование в буфер обмена
    navigator.clipboard.writeText(window.location.href)
  }
}
```

## SEO оптимизация

```tsx
// В компоненте добавить meta tags
useEffect(() => {
  document.title = `${recipe.name} - Cocktailo Maker`
  
  // Open Graph
  const ogImage = document.querySelector('meta[property="og:image"]')
  if (ogImage) ogImage.setAttribute('content', recipe.image)
}, [recipe])
```

## Тестирование

### Test IDs для автотестов
```tsx
// Кнопки
data-testid="button-back"
data-testid="button-favorite"
data-testid="button-share"
data-testid="button-rate-{star}"

// Секции
data-testid="section-hero"
data-testid="section-ingredients"
data-testid="section-steps"
data-testid="section-taste-analysis"

// Динамические элементы
data-testid="ingredient-{index}"
data-testid="step-{stepNumber}"
data-testid="recommendation-{index}"
```
