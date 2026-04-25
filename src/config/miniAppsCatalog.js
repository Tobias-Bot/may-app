// filepath: /src/config/miniAppsCatalog.js
export const MINI_APPS_CATALOG = [
  {
    id: 'balance',
    name: 'Баланс жизни',
    description: 'Отслеживайте баланс в 8 сферах жизни',
    icon: 'balance',
    component: 'BalanceTracker',
    category: 'self',
    gradient: 'linear-gradient(135deg, #1a3b3b, #2a5a5a)'
  },
  {
    id: 'gratitude',
    name: 'Благодарности',
    description: 'Ведите дневник благодарностей',
    icon: 'gratitude',
    component: 'Gratitude',
    category: 'self',
    gradient: 'linear-gradient(135deg, #E2F0CB, #B5D8A1)'
  },
  {
    id: 'mood',
    name: 'Настроение',
    description: 'Трекинг настроения',
    icon: 'mood',
    component: 'Mood',
    category: 'self',
    gradient: 'linear-gradient(135deg, #F3B9C6, #E88DA0)'
  },
  {
    id: 'habits',
    name: 'Привычки',
    description: 'Формируйте полезные привычки',
    icon: 'habits',
    component: 'Habits',
    category: 'self',
    gradient: 'linear-gradient(135deg, #C7CEEA, #A8B2E0)'
  },
  {
    id: 'finance',
    name: 'Финансы',
    description: 'Управляйте личными финансами',
    icon: 'finance',
    component: 'Finance',
    category: 'self',
    gradient: 'linear-gradient(135deg, #FDDFC3, #FCCB9E)'
  },
  {
    id: 'chores',
    name: 'Домашние дела',
    description: 'Планируйте домашние дела',
    icon: 'chores',
    component: 'Chores',
    category: 'home',
    gradient: 'linear-gradient(135deg, #CAE7D9, #A8D4BF)'
  },
  {
    id: 'shopping',
    name: 'Список покупок',
    description: 'Умный список покупок',
    icon: 'shopping',
    component: 'Shopping',
    category: 'home',
    gradient: 'linear-gradient(135deg, #FFDAC1, #FFC497)'
  },
  {
    id: 'plants',
    name: 'Растения',
    description: 'Уход за растениями',
    icon: 'plants',
    component: 'Plants',
    category: 'home',
    gradient: 'linear-gradient(135deg, #B5EAD7, #8DD4B8)'
  },
  {
    id: 'birthdays',
    name: 'Дни рождения',
    description: 'Не пропустите важные даты',
    icon: 'birthdays',
    component: 'Birthdays',
    category: 'social',
    gradient: 'linear-gradient(135deg, #FFB7B2, #FF948C)'
  },
  {
    id: 'calls',
    name: 'Звонки',
    description: 'Планируйте звонки близким',
    icon: 'calls',
    component: 'Calls',
    category: 'social',
    gradient: 'linear-gradient(135deg, #E2F0CB, #C8E4A8)'
  },
  {
    id: 'gifts',
    name: 'Подарки',
    description: 'Идеи подарков',
    icon: 'gifts',
    component: 'Gifts',
    category: 'social',
    gradient: 'linear-gradient(135deg, #C7CEEA, #A8B2E0)'
  },
  {
    id: 'network',
    name: 'Нетворкинг',
    description: 'Развивайте связи',
    icon: 'network',
    component: 'Network',
    category: 'social',
    gradient: 'linear-gradient(135deg, #FDDFC3, #FCCB9E)'
  },
  {
    id: 'events',
    name: 'События',
    description: 'Планирование мероприятий',
    icon: 'events',
    component: 'Events',
    category: 'social',
    gradient: 'linear-gradient(135deg, #CAE7D9, #A8D4BF)'
  }
];

export const getMiniAppById = (id) => MINI_APPS_CATALOG.find(app => app.id === id);

export const getMiniAppsByCategory = (category) => 
  MINI_APPS_CATALOG.filter(app => app.category === category);

export const categories = [
  { id: 'all', name: 'Все', icon: 'all' },
  { id: 'self', name: 'Личное', icon: 'self' },
  { id: 'home', name: 'Дом', icon: 'home' },
  { id: 'social', name: 'Социальное', icon: 'social' }
];