export interface TutorialStep {
  id: number;
  targetPage: string; // Which page should be active
  targetElement?: string; // CSS selector or ID
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  title: string;
  description: string;
  requiresClick: boolean; // User must click the element to proceed
  autoNavigate?: string; // Auto navigate to this page
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  // Main - Welcome
  {
    id: 0,
    targetPage: 'main',
    position: 'center',
    title: 'Добро пожаловать в FNTD 2 Casino!',
    description: 'Это главное меню бота. Здесь вы увидите важные сообщения и статус системы.',
    requiresClick: false,
  },
  {
    id: 1,
    targetPage: 'main',
    position: 'center',
    title: 'Стартовые юниты получены!',
    description: 'Вы получили 3 стартовых юнита: Freddy, Bonnie и Chica! Они уже в вашем инвентаре. Давайте изучим функции бота.',
    requiresClick: false,
  },

  // Casino Introduction
  {
    id: 2,
    targetPage: 'main',
    targetElement: '[data-tutorial="casino-nav"]',
    position: 'top',
    title: 'Казино',
    description: 'Нажмите сюда чтобы открыть казино - главный способ получения новых юнитов!',
    requiresClick: true,
    autoNavigate: 'casino',
  },
  {
    id: 3,
    targetPage: 'casino',
    position: 'top',
    title: 'Крутите колесо!',
    description: 'Здесь вы можете крутить колесо за 1 душу и выигрывать случайных юнитов разной редкости.',
    requiresClick: false,
  },
  {
    id: 4,
    targetPage: 'casino',
    targetElement: '[data-tutorial="spin-button"]',
    position: 'top',
    title: 'Попробуйте прямо сейчас',
    description: 'Нажмите на кнопку "Spin!" чтобы выиграть своего первого юнита!',
    requiresClick: true,
  },

  // More menu
  {
    id: 5,
    targetPage: 'casino',
    targetElement: '[data-tutorial="more-nav"]',
    position: 'top',
    title: 'Больше функций',
    description: 'В меню "More" находятся дополнительные функции. Давайте откроем!',
    requiresClick: true,
    autoNavigate: 'more',
  },

  // Crafting
  {
    id: 6,
    targetPage: 'more',
    targetElement: '[data-tutorial="crafting-button"]',
    position: 'right',
    title: 'Крафтинг юнитов',
    description: 'Здесь можно сливать 3 юнита одной редкости в 1 более редкого! Нажмите чтобы открыть.',
    requiresClick: true,
    autoNavigate: 'crafting',
  },
  {
    id: 7,
    targetPage: 'crafting',
    position: 'top',
    title: 'Система крафтинга',
    description: 'Выберите рецепт, затем выберите 3 юнита нужной редкости и нажмите "Craft". Пока у вас мало юнитов, вернемся позже.',
    requiresClick: false,
  },

  // PvP
  {
    id: 8,
    targetPage: 'crafting',
    targetElement: '[data-tutorial="more-nav"]',
    position: 'top',
    title: 'PvP Арена',
    description: 'Вернемся в меню More. Нажмите сюда.',
    requiresClick: true,
    autoNavigate: 'more',
  },
  {
    id: 9,
    targetPage: 'more',
    targetElement: '[data-tutorial="pvp-button"]',
    position: 'right',
    title: 'Сражения с ИИ',
    description: 'В PvP Arena можно сражаться с компьютером! У вас уже есть юниты для боя. Откройте арену.',
    requiresClick: true,
    autoNavigate: 'pvp',
  },
  {
    id: 10,
    targetPage: 'pvp',
    position: 'top',
    title: 'Выбор команды',
    description: 'Выберите до 5 юнитов из инвентаря, затем нажмите "START BATTLE!". Победа принесет души!',
    requiresClick: false,
  },

  // Wiki
  {
    id: 11,
    targetPage: 'pvp',
    targetElement: '[data-tutorial="wiki-nav"]',
    position: 'top',
    title: 'Энциклопедия',
    description: 'В Wiki находится информация обо всех юнитах, элементах, зачарованиях и механиках игры. Откройте Wiki.',
    requiresClick: true,
    autoNavigate: 'wiki',
  },

  // Profile
  {
    id: 12,
    targetPage: 'wiki',
    targetElement: '[data-tutorial="profile-nav"]',
    position: 'top',
    title: 'Ваш профиль',
    description: 'Здесь хранится вся ваша информация: инвентарь, достижения и статистика. Откройте профиль.',
    requiresClick: true,
    autoNavigate: 'profile',
  },
  {
    id: 13,
    targetPage: 'profile',
    position: 'top',
    title: 'Вкладки профиля',
    description: 'Inventory - ваши юниты, Achievements - достижения с наградами, Stats - статистика игры, History - история сделок.',
    requiresClick: false,
  },

  // Final
  {
    id: 14,
    targetPage: 'profile',
    position: 'center',
    title: 'Туториал завершен!',
    description: 'Теперь вы знаете все основные функции! Крутите казино, собирайте коллекцию и выполняйте достижения. Приятной игры! 🎉',
    requiresClick: false,
  },
];
