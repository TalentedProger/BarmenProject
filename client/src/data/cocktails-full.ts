/**
 * Полные данные коктейлей для страниц рецептов
 * Используются на внутренних страницах /recipe/:id
 */

import { Wine, Leaf, Citrus, Candy, Droplets, Utensils, Pipette, IceCream, GlassWater, Sparkles, Cherry, Apple, Coffee, Milk, Flame, CircleDot, Grape, Snowflake, CupSoda, Timer, Gauge, Blend, LucideIcon, Beer, Martini, Wheat, Beaker, Droplet, Slice, Mountain, Banana } from "lucide-react";

export interface FullCocktailIngredient {
  name: string;
  amount: string;
  icon: LucideIcon;
}

export interface FullCocktailStep {
  icon: LucideIcon;
  text: string;
  step: number;
}

export interface FullCocktailEquipment {
  name: string;
  icon: LucideIcon;
}

export interface FullCocktailTaste {
  sweetness: number;
  sourness: number;
  bitterness: number;
  strength: number;
  refreshing: number;
}

export interface FullCocktailRecommendation {
  name: string;
  image: string;
  id: string;
}

export interface FullCocktailData {
  id: string;
  name: string;
  image: string;
  description: string;
  tags: string[];
  abv: number;
  volume: number;
  calories: number;
  price: number;
  videoUrl?: string;
  ingredients: FullCocktailIngredient[];
  steps: FullCocktailStep[];
  equipment: FullCocktailEquipment[];
  taste: FullCocktailTaste;
  recommendations: FullCocktailRecommendation[];
  history?: string;
  tips?: string[];
}

export const fullCocktailsData: Record<string, FullCocktailData> = {
  // 1. Мохито
  "1": {
    id: "1",
    name: "Мохито",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_refreshing_Mojito_in_a_tall_hig_0_1753377591761.jpg",
    description: "Освежающий кубинский коктейль с мятой и лаймом. Один из самых популярных летних напитков в мире.",
    tags: ["Лёгкий", "Мятный", "Освежающий"],
    abv: 12.5,
    volume: 200,
    calories: 160,
    price: 350,
    videoUrl: "https://www.youtube.com/watch?v=Zc_TZ0UWP3I",
    ingredients: [
      { name: "Белый ром", amount: "60 мл", icon: Wine },
      { name: "Свежая мята", amount: "10 листьев", icon: Leaf },
      { name: "Лайм", amount: "½ шт", icon: Citrus },
      { name: "Сахар", amount: "2 ч. ложки", icon: Candy },
      { name: "Содовая", amount: "100 мл", icon: Droplets }
    ],
    steps: [
      { icon: Citrus, text: "Разомните мяту с сахаром и соком лайма в стакане", step: 1 },
      { icon: IceCream, text: "Добавьте колотый лёд и белый ром", step: 2 },
      { icon: GlassWater, text: "Долейте содовую до краёв", step: 3 },
      { icon: Sparkles, text: "Аккуратно перемешайте барной ложкой", step: 4 }
    ],
    equipment: [
      { name: "Мадлер", icon: Utensils },
      { name: "Хайбол", icon: GlassWater },
      { name: "Джиггер", icon: Pipette },
      { name: "Барная ложка", icon: Utensils }
    ],
    taste: {
      sweetness: 3,
      sourness: 3,
      bitterness: 1,
      strength: 2,
      refreshing: 5
    },
    recommendations: [
      { name: "Дайкири", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Daiquiri_in_a_sleek_cocktail_gl_0_1753377591759.jpg", id: "5" },
      { name: "Пина Колада", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Pia_Colada_in_a_tall_hurricane__0_1753377591760.jpg", id: "6" }
    ],
    history: "Мохито был создан в Гаване, Куба. По легенде, напиток изобрели пираты в XVI веке для борьбы с цингой и дизентерией. Современная версия коктейля стала популярной в 1930-х годах в баре La Bodeguita del Medio.",
    tips: [
      "Используйте только свежую мяту — она должна быть ароматной",
      "Не перетирайте мяту слишком сильно, чтобы избежать горечи",
      "Лёд должен быть колотым для лучшего охлаждения"
    ]
  },

  // 2. Негрони
  "2": {
    id: "2",
    name: "Негрони",
    image: "/attached_assets/Flux_Dev_A_classic_Negroni_in_a_short_glass_with_a_large_ice_c_3_1753377591753.jpg",
    description: "Классический итальянский аперитив с идеальным балансом горечи, сладости и крепости. Один из столпов коктейльной классики.",
    tags: ["Горький", "Классика", "Аперитив"],
    abv: 25,
    volume: 90,
    calories: 180,
    price: 450,
    ingredients: [
      { name: "Джин", amount: "30 мл", icon: Wine },
      { name: "Кампари", amount: "30 мл", icon: Droplet },
      { name: "Сладкий вермут", amount: "30 мл", icon: Wine },
      { name: "Апельсиновая цедра", amount: "1 твист", icon: Citrus }
    ],
    steps: [
      { icon: IceCream, text: "Наполните рокс крупными кубиками льда", step: 1 },
      { icon: Wine, text: "Влейте джин, кампари и вермут", step: 2 },
      { icon: Sparkles, text: "Перемешивайте барной ложкой 20-30 секунд", step: 3 },
      { icon: Citrus, text: "Украсьте твистом апельсиновой цедры", step: 4 }
    ],
    equipment: [
      { name: "Рокс", icon: GlassWater },
      { name: "Барная ложка", icon: Utensils },
      { name: "Джиггер", icon: Pipette }
    ],
    taste: {
      sweetness: 2,
      sourness: 1,
      bitterness: 5,
      strength: 4,
      refreshing: 2
    },
    recommendations: [
      { name: "Манхэттен", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_deep_amber_Manhattan_in_a_short_0_1753377591759.jpg", id: "7" },
      { name: "Апероль Шприц", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_An_Aperol_Spritz_in_a_large_ballo_0_1753377591760.jpg", id: "12" }
    ],
    history: "Коктейль был создан в 1919 году во Флоренции, Италия, для графа Камилло Негрони. Он попросил бармена усилить свой любимый Americano, заменив содовую джином.",
    tips: [
      "Используйте качественный джин — он определяет характер напитка",
      "Вермут должен быть свежим, храните открытую бутылку в холодильнике",
      "Цедру апельсина выжмите над напитком, чтобы выделить эфирные масла"
    ]
  },

  // 3. Маргарита
  "3": {
    id: "3",
    name: "Маргарита",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_classic_Margarita_cocktail_in_a_0_1753377591761.jpg",
    description: "Классический мексиканский коктейль с текилой, лаймом и солью. Идеальный баланс кислоты, сладости и крепости.",
    tags: ["Кислый", "Мексиканский", "Текила"],
    abv: 22,
    volume: 120,
    calories: 170,
    price: 380,
    ingredients: [
      { name: "Текила бланко", amount: "50 мл", icon: Wine },
      { name: "Трипл сек", amount: "25 мл", icon: Droplet },
      { name: "Сок лайма", amount: "25 мл", icon: Citrus },
      { name: "Соль", amount: "для ободка", icon: Snowflake }
    ],
    steps: [
      { icon: Citrus, text: "Натрите край бокала долькой лайма и обмакните в соль", step: 1 },
      { icon: Wine, text: "В шейкер добавьте текилу, трипл сек и сок лайма", step: 2 },
      { icon: IceCream, text: "Добавьте лёд и интенсивно взбивайте 15 секунд", step: 3 },
      { icon: GlassWater, text: "Процедите в охлаждённый бокал маргарита", step: 4 }
    ],
    equipment: [
      { name: "Шейкер", icon: Beaker },
      { name: "Бокал маргарита", icon: Martini },
      { name: "Джиггер", icon: Pipette },
      { name: "Стрейнер", icon: Utensils }
    ],
    taste: {
      sweetness: 2,
      sourness: 4,
      bitterness: 1,
      strength: 3,
      refreshing: 4
    },
    recommendations: [
      { name: "Дайкири", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Daiquiri_in_a_sleek_cocktail_gl_0_1753377591759.jpg", id: "5" },
      { name: "Космополитен", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_bright_pink_Cosmopolitan_in_a_m_0_1753377591757.jpg", id: "4" }
    ],
    history: "Происхождение Маргариты окутано легендами. Одна из версий гласит, что коктейль был создан в 1938 году мексиканским барменом Карлосом Эррерой для танцовщицы Маргариты Хенкель.",
    tips: [
      "Используйте свежевыжатый сок лайма — бутилированный испортит напиток",
      "Соль на ободке должна быть крупной морской",
      "Текила бланко даёт более чистый вкус, чем выдержанная"
    ]
  },

  // 4. Космополитен
  "4": {
    id: "4",
    name: "Космополитен",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_bright_pink_Cosmopolitan_in_a_m_0_1753377591757.jpg",
    description: "Элегантный розовый коктейль, ставший символом гламура 90-х. Идеальный баланс цитруса, клюквы и водки.",
    tags: ["Элегантный", "Цитрусовый", "Водка"],
    abv: 18.5,
    volume: 110,
    calories: 150,
    price: 420,
    ingredients: [
      { name: "Водка цитрусовая", amount: "45 мл", icon: Wine },
      { name: "Трипл сек", amount: "15 мл", icon: Droplet },
      { name: "Клюквенный сок", amount: "30 мл", icon: Cherry },
      { name: "Сок лайма", amount: "15 мл", icon: Citrus }
    ],
    steps: [
      { icon: IceCream, text: "Охладите бокал мартини льдом", step: 1 },
      { icon: Wine, text: "В шейкер со льдом добавьте все ингредиенты", step: 2 },
      { icon: Sparkles, text: "Энергично взбивайте 15-20 секунд", step: 3 },
      { icon: GlassWater, text: "Процедите в охлаждённый бокал, украсьте цедрой лайма", step: 4 }
    ],
    equipment: [
      { name: "Шейкер", icon: Beaker },
      { name: "Бокал мартини", icon: Martini },
      { name: "Джиггер", icon: Pipette },
      { name: "Стрейнер", icon: Utensils }
    ],
    taste: {
      sweetness: 3,
      sourness: 3,
      bitterness: 1,
      strength: 3,
      refreshing: 3
    },
    recommendations: [
      { name: "Маргарита", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_classic_Margarita_cocktail_in_a_0_1753377591761.jpg", id: "3" },
      { name: "Апероль Шприц", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_An_Aperol_Spritz_in_a_large_ballo_0_1753377591760.jpg", id: "12" }
    ],
    history: "Космополитен был создан в 1980-х годах барменом Тоби Чеккини в Нью-Йорке. Мировую славу коктейль получил благодаря сериалу «Секс в большом городе».",
    tips: [
      "Используйте качественный клюквенный сок без добавленного сахара",
      "Цитрусовая водка подчёркивает вкус, но можно использовать обычную",
      "Не переборщите с клюквенным соком — цвет должен быть розовым, не красным"
    ]
  },

  // 5. Дайкири
  "5": {
    id: "5",
    name: "Дайкири",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Daiquiri_in_a_sleek_cocktail_gl_0_1753377591759.jpg",
    description: "Элегантный кубинский коктейль — эталон баланса между ромом, лаймом и сахаром. Любимый напиток Хемингуэя.",
    tags: ["Классика", "Ром", "Освежающий"],
    abv: 28,
    volume: 80,
    calories: 130,
    price: 320,
    ingredients: [
      { name: "Белый ром", amount: "60 мл", icon: Wine },
      { name: "Сок лайма", amount: "25 мл", icon: Citrus },
      { name: "Сахарный сироп", amount: "15 мл", icon: Candy }
    ],
    steps: [
      { icon: Wine, text: "Влейте ром, сок лайма и сироп в шейкер", step: 1 },
      { icon: IceCream, text: "Добавьте много льда", step: 2 },
      { icon: Sparkles, text: "Энергично взбивайте 15-20 секунд", step: 3 },
      { icon: GlassWater, text: "Дважды процедите в охлаждённый коктейльный бокал", step: 4 }
    ],
    equipment: [
      { name: "Шейкер", icon: Beaker },
      { name: "Купе или мартини", icon: Martini },
      { name: "Джиггер", icon: Pipette },
      { name: "Файн стрейнер", icon: Utensils }
    ],
    taste: {
      sweetness: 2,
      sourness: 4,
      bitterness: 0,
      strength: 4,
      refreshing: 4
    },
    recommendations: [
      { name: "Мохито", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_refreshing_Mojito_in_a_tall_hig_0_1753377591761.jpg", id: "1" },
      { name: "Пина Колада", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Pia_Colada_in_a_tall_hurricane__0_1753377591760.jpg", id: "6" }
    ],
    history: "Дайкири был создан в 1898 году американским инженером Дженнингсом Коксом на шахте Дайкири на Кубе. Эрнест Хемингуэй обожал этот коктейль и пил его в баре El Floridita в Гаване.",
    tips: [
      "Пропорции 8:3:2 (ром:лайм:сироп) — золотой стандарт",
      "Свежий лайм обязателен — бутилированный сок недопустим",
      "Двойная фильтрация уберёт мелкие льдинки и мякоть"
    ]
  },

  // 6. Пина Колада
  "6": {
    id: "6",
    name: "Пина Колада",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Pia_Colada_in_a_tall_hurricane__0_1753377591760.jpg",
    description: "Тропический кремовый коктейль с Пуэрто-Рико. Сладкое сочетание рома, кокоса и ананаса — вкус каникул в бокале.",
    tags: ["Тропический", "Кремовый", "Сладкий"],
    abv: 12,
    volume: 250,
    calories: 320,
    price: 390,
    ingredients: [
      { name: "Белый ром", amount: "50 мл", icon: Wine },
      { name: "Кокосовый крем", amount: "50 мл", icon: Milk },
      { name: "Ананасовый сок", amount: "100 мл", icon: Apple },
      { name: "Ананас", amount: "для украшения", icon: Apple }
    ],
    steps: [
      { icon: Wine, text: "Добавьте ром, кокосовый крем и ананасовый сок в блендер", step: 1 },
      { icon: IceCream, text: "Добавьте стакан колотого льда", step: 2 },
      { icon: Sparkles, text: "Взбивайте до однородной кремовой текстуры", step: 3 },
      { icon: GlassWater, text: "Перелейте в харрикейн, украсьте ананасом и вишней", step: 4 }
    ],
    equipment: [
      { name: "Блендер", icon: Beaker },
      { name: "Харрикейн", icon: GlassWater },
      { name: "Джиггер", icon: Pipette }
    ],
    taste: {
      sweetness: 5,
      sourness: 1,
      bitterness: 0,
      strength: 2,
      refreshing: 4
    },
    recommendations: [
      { name: "Мохито", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_refreshing_Mojito_in_a_tall_hig_0_1753377591761.jpg", id: "1" },
      { name: "Дайкири", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Daiquiri_in_a_sleek_cocktail_gl_0_1753377591759.jpg", id: "5" }
    ],
    history: "Пина Колада была создана в 1954 году барменом Рамоном Маррероом Пересом в отеле Caribe Hilton в Сан-Хуане, Пуэрто-Рико. В 1978 году стала официальным напитком Пуэрто-Рико.",
    tips: [
      "Используйте кокосовый крем Coco Lopez для аутентичного вкуса",
      "Свежий ананасовый сок даёт лучший результат",
      "Не жалейте льда — коктейль должен быть хорошо охлаждённым"
    ]
  },

  // 7. Манхэттен
  "7": {
    id: "7",
    name: "Манхэттен",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_deep_amber_Manhattan_in_a_short_0_1753377591759.jpg",
    description: "Благородный американский коктейль с виски — один из старейших классических коктейлей. Глубокий, согревающий вкус.",
    tags: ["Крепкий", "Классика", "Виски"],
    abv: 30,
    volume: 95,
    calories: 190,
    price: 480,
    ingredients: [
      { name: "Ржаной виски", amount: "60 мл", icon: Wine },
      { name: "Сладкий вермут", amount: "30 мл", icon: Wine },
      { name: "Ангостура биттер", amount: "2 дэша", icon: Droplet },
      { name: "Вишня мараскино", amount: "1 шт", icon: Cherry }
    ],
    steps: [
      { icon: IceCream, text: "Наполните смесительный стакан льдом", step: 1 },
      { icon: Wine, text: "Добавьте виски, вермут и биттер", step: 2 },
      { icon: Sparkles, text: "Перемешивайте барной ложкой 30-40 секунд", step: 3 },
      { icon: GlassWater, text: "Процедите в охлаждённый коктейльный бокал, украсьте вишней", step: 4 }
    ],
    equipment: [
      { name: "Смесительный стакан", icon: GlassWater },
      { name: "Барная ложка", icon: Utensils },
      { name: "Стрейнер", icon: Utensils },
      { name: "Купе или мартини", icon: Martini }
    ],
    taste: {
      sweetness: 2,
      sourness: 1,
      bitterness: 3,
      strength: 5,
      refreshing: 1
    },
    recommendations: [
      { name: "Негрони", image: "/attached_assets/Flux_Dev_A_classic_Negroni_in_a_short_glass_with_a_large_ice_c_3_1753377591753.jpg", id: "2" },
      { name: "Белый Русский", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_White_Russian_in_a_short_glass__2_1753377591757.jpg", id: "9" }
    ],
    history: "Манхэттен был создан в 1870-х годах в Манхэттенском клубе Нью-Йорка. По легенде, коктейль был изобретён для банкета, устроенного матерью Уинстона Черчилля.",
    tips: [
      "Используйте качественный ржаной виски (rye) для классического вкуса",
      "Вермут должен быть свежим — храните открытую бутылку в холодильнике",
      "Не трясите в шейкере — только перемешивание для бархатистой текстуры"
    ]
  },

  // 8. Лонг Айленд
  "8": {
    id: "8",
    name: "Лонг Айленд",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Long_Island_Iced_Tea_in_a_tall__1_1753377591756.jpg",
    description: "Легендарный крепкий коктейль с пятью видами алкоголя. Несмотря на название, не содержит чая — напоминает его по цвету.",
    tags: ["Крепкий", "Сложный", "Микс"],
    abv: 22,
    volume: 300,
    calories: 280,
    price: 550,
    ingredients: [
      { name: "Водка", amount: "15 мл", icon: Wine },
      { name: "Белый ром", amount: "15 мл", icon: Wine },
      { name: "Текила", amount: "15 мл", icon: Wine },
      { name: "Джин", amount: "15 мл", icon: Wine },
      { name: "Трипл сек", amount: "15 мл", icon: Droplet },
      { name: "Сок лимона", amount: "30 мл", icon: Citrus },
      { name: "Кола", amount: "30 мл", icon: CupSoda }
    ],
    steps: [
      { icon: Wine, text: "В шейкер добавьте все спиртные напитки и лимонный сок", step: 1 },
      { icon: IceCream, text: "Добавьте лёд и встряхните", step: 2 },
      { icon: GlassWater, text: "Перелейте в высокий стакан со льдом", step: 3 },
      { icon: CupSoda, text: "Долейте колу и украсьте долькой лимона", step: 4 }
    ],
    equipment: [
      { name: "Шейкер", icon: Beaker },
      { name: "Хайбол", icon: GlassWater },
      { name: "Джиггер", icon: Pipette }
    ],
    taste: {
      sweetness: 2,
      sourness: 3,
      bitterness: 1,
      strength: 5,
      refreshing: 3
    },
    recommendations: [
      { name: "Мохито", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_refreshing_Mojito_in_a_tall_hig_0_1753377591761.jpg", id: "1" },
      { name: "Маргарита", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_classic_Margarita_cocktail_in_a_0_1753377591761.jpg", id: "3" }
    ],
    history: "Лонг Айленд Айс Ти был создан в 1972 году барменом Робертом «Рози» Баттом в баре Oak Beach Inn на Лонг-Айленде, Нью-Йорк.",
    tips: [
      "Используйте качественные белые спирты для чистого вкуса",
      "Колы нужно совсем немного — только для цвета",
      "Коктейль очень крепкий, несмотря на лёгкий вкус — будьте осторожны"
    ]
  },

  // 9. Белый Русский
  "9": {
    id: "9",
    name: "Белый Русский",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_White_Russian_in_a_short_glass__2_1753377591757.jpg",
    description: "Кремовый десертный коктейль с кофейным ликёром. Стал культовым благодаря фильму «Большой Лебовски».",
    tags: ["Кремовый", "Десертный", "Кофейный"],
    abv: 20,
    volume: 100,
    calories: 250,
    price: 370,
    ingredients: [
      { name: "Водка", amount: "50 мл", icon: Wine },
      { name: "Кофейный ликёр", amount: "20 мл", icon: Coffee },
      { name: "Сливки", amount: "30 мл", icon: Milk }
    ],
    steps: [
      { icon: IceCream, text: "Наполните рокс кубиками льда", step: 1 },
      { icon: Wine, text: "Влейте водку и кофейный ликёр", step: 2 },
      { icon: Sparkles, text: "Перемешайте барной ложкой", step: 3 },
      { icon: Milk, text: "Аккуратно влейте сливки по лезвию ножа", step: 4 }
    ],
    equipment: [
      { name: "Рокс", icon: GlassWater },
      { name: "Барная ложка", icon: Utensils },
      { name: "Джиггер", icon: Pipette }
    ],
    taste: {
      sweetness: 4,
      sourness: 0,
      bitterness: 2,
      strength: 3,
      refreshing: 1
    },
    recommendations: [
      { name: "B52", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_layered_B52_shot_in_a_small_sho_3_1753377591758.jpg", id: "10" },
      { name: "Негрони", image: "/attached_assets/Flux_Dev_A_classic_Negroni_in_a_short_glass_with_a_large_ice_c_3_1753377591753.jpg", id: "2" }
    ],
    history: "Белый Русский появился в 1960-х годах как развитие коктейля «Чёрный Русский» (водка + кофейный ликёр). Культовый статус получил благодаря персонажу Дюда из фильма «Большой Лебовски» (1998).",
    tips: [
      "Используйте жирные сливки (20-30%) для кремовой текстуры",
      "Kahlúa — классический выбор кофейного ликёра",
      "Можно заменить сливки на молоко для более лёгкой версии"
    ]
  },

  // 10. B52
  "10": {
    id: "10",
    name: "B52",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_layered_B52_shot_in_a_small_sho_3_1753377591758.jpg",
    description: "Эффектный слоистый шот с тремя ликёрами. Можно поджигать для зрелищной подачи.",
    tags: ["Шот", "Слоистый", "Эффектный"],
    abv: 25,
    volume: 60,
    calories: 160,
    price: 280,
    ingredients: [
      { name: "Кофейный ликёр", amount: "20 мл", icon: Coffee },
      { name: "Ирландский крем", amount: "20 мл", icon: Milk },
      { name: "Апельсиновый ликёр", amount: "20 мл", icon: Citrus }
    ],
    steps: [
      { icon: Coffee, text: "Налейте кофейный ликёр на дно шот-стакана", step: 1 },
      { icon: Milk, text: "Аккуратно по ложке влейте ирландский крем", step: 2 },
      { icon: Citrus, text: "Сверху так же аккуратно влейте апельсиновый ликёр", step: 3 },
      { icon: Flame, text: "Опционально: подожгите верхний слой и выпейте через трубочку", step: 4 }
    ],
    equipment: [
      { name: "Шот-стакан", icon: GlassWater },
      { name: "Барная ложка", icon: Utensils },
      { name: "Джиггер", icon: Pipette }
    ],
    taste: {
      sweetness: 5,
      sourness: 0,
      bitterness: 1,
      strength: 3,
      refreshing: 0
    },
    recommendations: [
      { name: "Белый Русский", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_White_Russian_in_a_short_glass__2_1753377591757.jpg", id: "9" },
      { name: "Лонг Айленд", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Long_Island_Iced_Tea_in_a_tall__1_1753377591756.jpg", id: "8" }
    ],
    history: "B52 был создан в 1977 году барменом Питером Финком в баре Banff Springs Hotel в Канаде. Назван в честь американского бомбардировщика B-52 Stratofortress.",
    tips: [
      "Ликёры наливайте медленно по обратной стороне барной ложки",
      "Температура ликёров должна быть одинаковой для чётких слоёв",
      "Если поджигаете — потушите перед тем, как пить, чтобы не обжечься"
    ]
  },

  // 11. Сангрия
  "11": {
    id: "11",
    name: "Сангрия",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_vibrant_red_Sangria_in_a_large__1_1753377591760.jpg",
    description: "Традиционный испанский фруктовый пунш на основе красного вина. Идеален для жаркого дня и больших компаний.",
    tags: ["Фруктовый", "Вино", "Испанский"],
    abv: 8.5,
    volume: 300,
    calories: 180,
    price: 310,
    ingredients: [
      { name: "Красное вино", amount: "200 мл", icon: Wine },
      { name: "Бренди", amount: "30 мл", icon: Wine },
      { name: "Апельсин", amount: "½ шт", icon: Citrus },
      { name: "Яблоко", amount: "½ шт", icon: Apple },
      { name: "Сахар", amount: "1 ст.л.", icon: Candy },
      { name: "Газировка", amount: "50 мл", icon: Droplets }
    ],
    steps: [
      { icon: Apple, text: "Нарежьте фрукты небольшими кусочками", step: 1 },
      { icon: Wine, text: "Смешайте вино, бренди и сахар в кувшине", step: 2 },
      { icon: Timer, text: "Добавьте фрукты и настаивайте 2-4 часа в холодильнике", step: 3 },
      { icon: Droplets, text: "Перед подачей добавьте газировку и лёд", step: 4 }
    ],
    equipment: [
      { name: "Кувшин", icon: GlassWater },
      { name: "Нож", icon: Utensils },
      { name: "Большие бокалы", icon: GlassWater }
    ],
    taste: {
      sweetness: 4,
      sourness: 2,
      bitterness: 1,
      strength: 2,
      refreshing: 4
    },
    recommendations: [
      { name: "Апероль Шприц", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_An_Aperol_Spritz_in_a_large_ballo_0_1753377591760.jpg", id: "12" },
      { name: "Мохито", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_refreshing_Mojito_in_a_tall_hig_0_1753377591761.jpg", id: "1" }
    ],
    history: "Сангрия родом из Испании и Португалии, где её готовили ещё в Средние века. Название происходит от испанского «sangre» (кровь) из-за красного цвета напитка.",
    tips: [
      "Чем дольше настаивается, тем насыщеннее вкус",
      "Используйте недорогое, но качественное красное вино",
      "Можно добавить персики, груши, клубнику по вкусу"
    ]
  },

  // 12. Апероль Шприц
  "12": {
    id: "12",
    name: "Апероль Шприц",
    image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_An_Aperol_Spritz_in_a_large_ballo_0_1753377591760.jpg",
    description: "Солнечный итальянский аперитив с игристым вином. Визитная карточка Венеции и символ летней dolce vita.",
    tags: ["Игристый", "Аперитив", "Итальянский"],
    abv: 8,
    volume: 180,
    calories: 120,
    price: 340,
    ingredients: [
      { name: "Апероль", amount: "60 мл", icon: Droplet },
      { name: "Просекко", amount: "90 мл", icon: Wine },
      { name: "Содовая", amount: "30 мл", icon: Droplets },
      { name: "Апельсин", amount: "2 дольки", icon: Citrus }
    ],
    steps: [
      { icon: IceCream, text: "Наполните большой бокал кубиками льда", step: 1 },
      { icon: Wine, text: "Влейте просекко", step: 2 },
      { icon: Droplet, text: "Добавьте Апероль", step: 3 },
      { icon: Citrus, text: "Долейте немного содовой и украсьте долькой апельсина", step: 4 }
    ],
    equipment: [
      { name: "Бокал для вина", icon: Wine },
      { name: "Джиггер", icon: Pipette }
    ],
    taste: {
      sweetness: 3,
      sourness: 2,
      bitterness: 3,
      strength: 1,
      refreshing: 5
    },
    recommendations: [
      { name: "Негрони", image: "/attached_assets/Flux_Dev_A_classic_Negroni_in_a_short_glass_with_a_large_ice_c_3_1753377591753.jpg", id: "2" },
      { name: "Сангрия", image: "/attached_assets/Flux_Dev_a_lush_3d_render_of_A_vibrant_red_Sangria_in_a_large__1_1753377591760.jpg", id: "11" }
    ],
    history: "Апероль был создан в 1919 году братьями Барбьери в Падуе, Италия. Коктейль Spritz стал популярен в Венеции в 1950-х, а мировое признание получил в 2000-х годах.",
    tips: [
      "Пропорция 3:2:1 (просекко:апероль:содовая) — итальянский стандарт",
      "Просекко должно быть хорошо охлаждённым",
      "Подавайте сразу после приготовления, пока игристое не выдохлось"
    ]
  }
};

// Функция для получения данных коктейля по ID
export const getFullCocktailById = (id: string): FullCocktailData | undefined => {
  return fullCocktailsData[id];
};

// Получить все коктейли как массив
export const getAllFullCocktails = (): FullCocktailData[] => {
  return Object.values(fullCocktailsData);
};
