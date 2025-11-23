export enum Rarity {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Mythic = 'Mythic',
  Secret = 'Secret',
  Nightmare = 'Nightmare',
  Hero = 'Hero',
  Apex = 'Apex',
  Legendary = 'Legendary'
}

export interface Unit {
  id: number;
  name: string;
  rarity: Rarity;
  image: string;
  description: string;
  cost: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;
}

export interface Listing {
  id: string; // uuid
  created_at: string;
  seller_id: number;
  seller_username: string;
  asking_price: number;
  status: 'active' | 'completed' | 'cancelled';
  unit_data: Unit;
}


export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface Scammer {
  id: string;
  roblox_username: string;
  telegram_nickname: string | null;
  telegram_username: string | null;
  reason: string;
  description: string | null;
  damage_amount: number | null;
  proof_images: string[];
  status: 'pending' | 'verified';
  added_by: number | null;
  created_at: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    [key: string]: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (disable?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: { [key: string]: any }) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  close: () => void;
  ready: () => void;
}