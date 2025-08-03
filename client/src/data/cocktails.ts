// Статическая база данных коктейлей
export interface CocktailData {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'summer' | 'shot' | 'nonalcoholic';
  difficulty: 'easy' | 'medium' | 'hard';
  image: string;
  ingredients: string[];
  instructions: string;
  tags: string[];
  abv: number;
  volume: number;
  rating: number;
  reviewCount: number;
  cost: number;
}

export const cocktailsDatabase: CocktailData[] = [
  {
    id: '1',
    name: 'Мохито',
    description: 'Освежающий кубинский коктейль с мятой и лаймом',
    category: 'summer',
    difficulty: 'easy',
    image: '/attached_assets/Flux_Dev_a_lush_3d_render_of_A_refreshing_Mojito_in_a_tall_hig_0_1753377591761.jpg',
    ingredients: [
      'Белый ром - 60мл',
      'Лайм - 1/2 шт',
      'Свежая мята - 10 листьев',
      'Сахар - 2 ч.л.',
      'Содовая вода - 100мл',
      'Лед'
    ],
    instructions: 'Разомните мяту с сахаром в стакане. Добавьте сок лайма и ром. Заполните льдом и долейте содовой.',
    tags: ['освежающий', 'мята', 'лайм', 'ром'],
    abv: 12.5,
    volume: 200,
    rating: 4.5,
    reviewCount: 1247,
    cost: 350
  },
  {
    id: '2',
    name: 'Негрони',
    description: 'Классический итальянский коктейль с горьким вкусом',
    category: 'classic',
    difficulty: 'medium',
    image: '/attached_assets/Flux_Dev_A_classic_Negroni_in_a_short_glass_with_a_large_ice_c_3_1753377591753.jpg',
    ingredients: [
      'Джин - 30мл',
      'Кампари - 30мл',
      'Сладкий вермут - 30мл',
      'Апельсиновая цедра',
      'Лед'
    ],
    instructions: 'Смешайте джин, кампари и вермут в стакане со льдом. Украсьте апельсиновой цедрой.',
    tags: ['горький', 'классика', 'джин', 'кампари'],
    abv: 25.0,
    volume: 90,
    rating: 4.2,
    reviewCount: 832,
    cost: 450
  },
  {
    id: '3',
    name: 'Маргарита',
    description: 'Классический мексиканский коктейль с текилой и лаймом',
    category: 'classic',
    difficulty: 'easy',
    image: '/attached_assets/Flux_Dev_a_lush_3d_render_of_A_classic_Margarita_cocktail_in_a_0_1753377591761.jpg',
    ingredients: [
      'Текила - 50мл',
      'Апельсиновый ликер - 25мл',
      'Лайм - 1/2 шт',
      'Соль для ободка',
      'Лед'
    ],
    instructions: 'Обмакните край бокала в соль. Смешайте все ингредиенты с льдом в шейкере. Процедите в бокал.',
    tags: ['кислый', 'текила', 'лайм', 'соль'],
    abv: 22.0,
    volume: 120,
    rating: 4.6,
    reviewCount: 1589,
    cost: 380
  },
  {
    id: '4',
    name: 'Космополитен',
    description: 'Элегантный розовый коктейль с водкой и клюквой',
    category: 'classic',
    difficulty: 'medium',
    image: '/attached_assets/Flux_Dev_a_lush_3d_render_of_A_bright_pink_Cosmopolitan_in_a_m_0_1753377591757.jpg',
    ingredients: [
      'Водка - 45мл',
      'Апельсиновый ликер - 15мл',
      'Клюквенный сок - 30мл',
      'Лайм - 1/4 шт',
      'Лед'
    ],
    instructions: 'Смешайте все ингредиенты в шейкере со льдом. Процедите в охлажденный бокал мартини.',
    tags: ['розовый', 'водка', 'клюква', 'элегантный'],
    abv: 18.5,
    volume: 110,
    rating: 4.3,
    reviewCount: 967,
    cost: 420
  },
  {
    id: '5',
    name: 'Дайкири',
    description: 'Простой и элегантный коктейль с ромом и лаймом',
    category: 'summer',
    difficulty: 'easy',
    image: '/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Daiquiri_in_a_sleek_cocktail_gl_0_1753377591759.jpg',
    ingredients: [
      'Белый ром - 60мл',
      'Лайм - 1/2 шт',
      'Сахарный сироп - 15мл',
      'Лед'
    ],
    instructions: 'Смешайте все ингредиенты в шейкере со льдом. Процедите в охлажденный бокал.',
    tags: ['простой', 'ром', 'лайм', 'освежающий'],
    abv: 28.0,
    volume: 80,
    rating: 4.4,
    reviewCount: 756,
    cost: 320
  },
  {
    id: '6',
    name: 'Пина Колада',
    description: 'Тропический кремовый коктейль с ромом и кокосом',
    category: 'summer',
    difficulty: 'medium',
    image: '/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Pia_Colada_in_a_tall_hurricane__0_1753377591760.jpg',
    ingredients: [
      'Белый ром - 50мл',
      'Кокосовый крем - 30мл',
      'Ананасовый сок - 90мл',
      'Лед',
      'Ананас для украшения'
    ],
    instructions: 'Смешайте все ингредиенты в блендере с льдом. Подавайте в высоком бокале, украсьте ананасом.',
    tags: ['тропический', 'кремовый', 'ананас', 'кокос'],
    abv: 12.0,
    volume: 250,
    rating: 4.7,
    reviewCount: 1432,
    cost: 390
  },
  {
    id: '7',
    name: 'Манхэттен',
    description: 'Классический американский коктейль с виски',
    category: 'classic',
    difficulty: 'medium',
    image: '/attached_assets/Flux_Dev_a_lush_3d_render_of_A_deep_amber_Manhattan_in_a_short_0_1753377591759.jpg',
    ingredients: [
      'Ржаной виски - 60мл',
      'Сладкий вермут - 30мл',
      'Ангостура - 2 капли',
      'Вишня мараскино',
      'Лед'
    ],
    instructions: 'Перемешайте виски, вермут и биттер со льдом. Процедите в бокал, украсьте вишней.',
    tags: ['крепкий', 'виски', 'классика', 'горький'],
    abv: 30.0,
    volume: 95,
    rating: 4.1,
    reviewCount: 689,
    cost: 480
  },
  {
    id: '8',
    name: 'Лонг Айленд',
    description: 'Крепкий коктейль с пятью видами алкоголя',
    category: 'classic',
    difficulty: 'hard',
    image: '/attached_assets/Flux_Dev_a_lush_3d_render_of_A_Long_Island_Iced_Tea_in_a_tall__1_1753377591756.jpg',
    ingredients: [
      'Водка - 15мл',
      'Ром - 15мл',
      'Джин - 15мл',
      'Текила - 15мл',
      'Апельсиновый ликер - 15мл',
      'Лимонный сок - 30мл',
      'Кола - 30мл'
    ],
    instructions: 'Смешайте все алкогольные ингредиенты с лимонным соком. Добавьте лед и долейте колу.',
    tags: ['крепкий', 'сложный', 'микс', 'кола'],
    abv: 35.0,
    volume: 300,
    rating: 4.0,
    reviewCount: 1105,
    cost: 550
  },
  {
    id: '9',
    name: 'Белый Русский',
    description: 'Кремовый коктейль с водкой и кофейным ликером',
    category: 'classic',
    difficulty: 'easy',
    image: '/attached_assets/Flux_Dev_a_lush_3d_render_of_A_White_Russian_in_a_short_glass__2_1753377591757.jpg',
    ingredients: [
      'Водка - 50мл',
      'Кофейный ликер - 20мл',
      'Сливки - 30мл',
      'Лед'
    ],
    instructions: 'Налейте водку и ликер в стакан со льдом. Аккуратно добавьте сливки.',
    tags: ['кремовый', 'кофе', 'водка', 'десертный'],
    abv: 20.0,
    volume: 100,
    rating: 4.3,
    reviewCount: 543,
    cost: 370
  },
  {
    id: '10',
    name: 'B52',
    description: 'Слоистый шот с кофейным ликером и сливками',
    category: 'shot',
    difficulty: 'hard',
    image: '/attached_assets/Flux_Dev_a_lush_3d_render_of_A_layered_B52_shot_in_a_small_sho_3_1753377591758.jpg',
    ingredients: [
      'Кофейный ликер - 20мл',
      'Ирландский крем - 20мл',
      'Апельсиновый ликер - 20мл'
    ],
    instructions: 'Аккуратно налейте слоями: сначала кофейный ликер, затем ирландский крем, сверху апельсиновый ликер.',
    tags: ['слоистый', 'шот', 'кофе', 'сливки'],
    abv: 25.0,
    volume: 60,
    rating: 4.2,
    reviewCount: 324,
    cost: 280
  },
  {
    id: '11',
    name: 'Сангрия',
    description: 'Испанский фруктовый коктейль с вином',
    category: 'summer',
    difficulty: 'easy',
    image: '/attached_assets/Flux_Dev_a_lush_3d_render_of_A_vibrant_red_Sangria_in_a_large__1_1753377591760.jpg',
    ingredients: [
      'Красное вино - 200мл',
      'Апельсин - 1/2 шт',
      'Яблоко - 1/2 шт',
      'Бренди - 30мл',
      'Сахар - 1 ст.л.',
      'Газировка - 50мл'
    ],
    instructions: 'Нарежьте фрукты. Смешайте вино, бренди и сахар. Добавьте фрукты, настаивайте час. Подавайте с газировкой.',
    tags: ['фруктовый', 'вино', 'освежающий', 'испанский'],
    abv: 8.5,
    volume: 300,
    rating: 4.4,
    reviewCount: 892,
    cost: 310
  },
  {
    id: '12',
    name: 'Апероль Шприц',
    description: 'Итальянский аперитив с просекко и аперолем',
    category: 'summer',
    difficulty: 'easy',
    image: '/attached_assets/Flux_Dev_a_lush_3d_render_of_An_Aperol_Spritz_in_a_large_ballo_0_1753377591760.jpg',
    ingredients: [
      'Апероль - 60мл',
      'Просекко - 90мл',
      'Содовая - 30мл',
      'Апельсин - 2 дольки',
      'Лед'
    ],
    instructions: 'В бокал со льдом налейте апероль, затем просекко и содовую. Украсьте долькой апельсина.',
    tags: ['игристое', 'апероль', 'апельсин', 'аперитив'],
    abv: 8.0,
    volume: 180,
    rating: 4.5,
    reviewCount: 1267,
    cost: 340
  }
];

// Функции для работы с базой данных коктейлей
export const getCocktails = (filters?: {
  search?: string;
  category?: string;
  difficulty?: string;
}) => {
  let filtered = [...cocktailsDatabase];

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(cocktail => 
      cocktail.name.toLowerCase().includes(searchTerm) ||
      cocktail.description.toLowerCase().includes(searchTerm) ||
      cocktail.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter(cocktail => cocktail.category === filters.category);
  }

  if (filters?.difficulty && filters.difficulty !== 'all') {
    filtered = filtered.filter(cocktail => cocktail.difficulty === filters.difficulty);
  }

  return filtered;
};

export const getCocktailById = (id: string) => {
  return cocktailsDatabase.find(cocktail => cocktail.id === id);
};

export const getCategoryCounts = () => {
  return {
    all: cocktailsDatabase.length,
    classic: cocktailsDatabase.filter(c => c.category === 'classic').length,
    summer: cocktailsDatabase.filter(c => c.category === 'summer').length,
    shot: cocktailsDatabase.filter(c => c.category === 'shot').length,
    nonalcoholic: cocktailsDatabase.filter(c => c.category === 'nonalcoholic').length,
  };
};

export const getDifficultyCounts = () => {
  return {
    all: cocktailsDatabase.length,
    easy: cocktailsDatabase.filter(c => c.difficulty === 'easy').length,
    medium: cocktailsDatabase.filter(c => c.difficulty === 'medium').length,
    hard: cocktailsDatabase.filter(c => c.difficulty === 'hard').length,
  };
};