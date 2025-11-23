import React from 'react';

interface MorePageProps {
  onNavigate: (page: string) => void;
  isAdmin: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  adminOnly?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'crafting', label: 'Крафт', description: 'Слияние юнитов', icon: '⚒️', color: 'var(--accent-purple)' },
  { id: 'wheel', label: 'Колесо', description: 'Крути призы!', icon: '🎡', color: 'var(--accent-yellow)' },
  { id: 'pvp', label: 'PvP Арена', description: 'Битва с ИИ', icon: '⚔️', color: 'var(--accent-red)' },
  { id: 'gifts', label: 'Подарки', description: 'Отправить юнитов', icon: '🎁', color: 'var(--accent-purple)' },
  { id: 'lottery', label: 'Лотерея', description: 'Джекпот!', icon: '🎫', color: 'var(--accent-cyan)' },
  { id: 'advanced_stats', label: 'Статистика', description: 'Аналитика', icon: '📊', color: 'var(--accent-green)' },
  { id: 'moderator', label: 'Модерация', description: 'Панель управления', icon: '🛡️', color: 'var(--accent-red)', adminOnly: true },
];

const MorePage: React.FC<MorePageProps> = ({ onNavigate, isAdmin }) => {
  return (
    <div className="p-4 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col p-6 min-h-0">
        <h1 className="font-pixel text-3xl text-glow-cyan mb-6 text-center">ЕЩЕ</h1>

        <div className="flex-grow overflow-y-auto pr-2 min-h-0">
          <div className="grid grid-cols-2 gap-4">
            {MENU_ITEMS.map(item => {
              if (item.adminOnly && !isAdmin) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="p-6 bg-black/50 border-2 border-border-light hover:border-accent-cyan transition-all text-center"
                  data-tutorial={`${item.id}-button`}
                >
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <p className="font-pixel text-lg text-text-light mb-2">
                    {item.label}
                  </p>
                  <p className="text-sm text-text-dark">{item.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorePage;

