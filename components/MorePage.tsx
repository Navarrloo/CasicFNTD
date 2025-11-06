import React from 'react';

interface MorePageProps {
  onNavigate: (page: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'crafting', label: 'Crafting', description: 'Fuse units to create better ones', icon: '⚒️', color: 'var(--accent-purple)' },
  { id: 'wheel', label: 'Wheel of Fortune', description: 'Spin for big prizes!', icon: '🎡', color: 'var(--accent-yellow)' },
  { id: 'quests', label: 'Quests', description: 'Complete tasks for rewards', icon: '📜', color: 'var(--accent-cyan)' },
  { id: 'pvp', label: 'PvP Arena', description: 'Battle other players', icon: '⚔️', color: 'var(--accent-red)' },
  { id: 'referral', label: 'Referrals', description: 'Invite friends for bonuses', icon: '👥', color: 'var(--accent-green)' },
  { id: 'gifts', label: 'Gifts', description: 'Send & receive units', icon: '🎁', color: 'var(--accent-purple)' },
  { id: 'battlepass', label: 'Battle Pass', description: 'Seasonal rewards track', icon: '🏆', color: 'var(--accent-yellow)' },
  { id: 'lottery', label: 'Lottery', description: 'Win the jackpot!', icon: '🎫', color: 'var(--accent-cyan)' },
  { id: 'advanced_stats', label: 'Stats Pro', description: 'Advanced analytics', icon: '📊', color: 'var(--accent-green)' },
  { id: 'settings', label: 'Settings', description: 'Customize your experience', icon: '⚙️', color: 'var(--accent-purple)' },
];

const MorePage: React.FC<MorePageProps> = ({ onNavigate }) => {
  return (
    <div className="p-2 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col p-4 min-h-0">
        <h1 className="font-pixel text-2xl text-glow-cyan mb-4 text-center">🎮 MORE FEATURES</h1>

        <div className="flex-grow overflow-y-auto pr-2 min-h-0">
          <div className="grid grid-cols-2 gap-3">
            {MENU_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="p-4 bg-black/30 border border-border-dark hover:border-accent-cyan transition-all text-left group"
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <p className="font-pixel text-sm text-text-light group-hover:text-accent-cyan transition-colors mb-1">
                  {item.label}
                </p>
                <p className="text-xs text-text-dark">{item.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorePage;

