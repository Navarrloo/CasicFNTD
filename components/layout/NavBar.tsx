import React from 'react';
import { HomeIcon, AdminIcon, WikiIcon, CasinoIcon, ProfileIcon, TradeIcon, ScammersIcon } from '../shared/Icons';

type Page = 'main' | 'wiki' | 'casino' | 'profile' | 'admin' | 'trade' | 'scammers' | 'more';

interface NavBarProps {
  activePage: string;
  setActivePage: (page: Page) => void;
  isAdmin: boolean;
}

const NavItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  activeColor: string;
}> = ({ label, icon, isActive, onClick, activeColor }) => {
  return (
    <button 
        onClick={onClick} 
        className="relative flex flex-col items-center justify-center w-16 h-full transition-all duration-300 group focus:outline-none pt-2"
        aria-label={label}
    >
        {/* Top Glow Indicator */}
        <div 
            className="absolute top-0 h-1 w-8 rounded-full transition-all duration-300"
            style={{ 
                backgroundColor: isActive ? activeColor : 'transparent',
                boxShadow: isActive ? `0 0 8px ${activeColor}, 0 0 12px ${activeColor}` : 'none',
                opacity: isActive ? 1 : 0,
            }}
        />

        {/* Icon */}
        <div 
            className={`w-8 h-8 mb-1 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-text-dark group-hover:text-text-light'}`}
            style={{
                filter: isActive ? `drop-shadow(0 0 6px ${activeColor})` : 'none',
                transform: isActive ? 'scale(1.1)' : 'scale(1)'
            }}
        >
            {icon}
        </div>
        
        {/* Label */}
        <span 
            className={`text-xs uppercase font-pixel font-bold transition-colors duration-300 ${!isActive ? 'text-text-dark group-hover:text-text-light' : ''}`}
            style={{ 
                color: isActive ? activeColor : undefined, 
                textShadow: isActive ? `0 0 4px ${activeColor}` : 'none' 
            }}
        >
            {label}
        </span>
    </button>
  );
};

const NavBar: React.FC<NavBarProps> = ({ activePage, setActivePage, isAdmin }) => {
   const colors = {
    green: 'var(--accent-green)',
    yellow: 'var(--accent-yellow)',
    purple: 'var(--accent-purple)',
    red: 'var(--accent-red)',
    cyan: 'var(--accent-cyan)',
  };
  
  const activeColor = {
      main: colors.yellow,
      wiki: colors.green,
      casino: colors.purple,
      trade: colors.cyan,
      scammers: colors.red,
      profile: colors.green,
      admin: colors.red,
      more: colors.purple
  }[activePage] || 'transparent';


  return (
    <div 
        className="fixed bottom-0 left-0 right-0 h-20 bg-black/70 backdrop-blur-md border-t border-border-dark/50"
        style={{ 
            boxShadow: `0 -2px 15px -5px ${activeColor}, inset 0 1px 0px rgba(255, 50, 50, 0.2)`,
            transition: 'box-shadow 0.4s ease-in-out'
        }}
    >
      <div className="flex justify-around items-center h-full">
        <div data-nav="main">
          <NavItem
            label="Main"
            icon={<HomeIcon className="w-full h-full"/>}
            isActive={activePage === 'main'}
            onClick={() => setActivePage('main')}
            activeColor={colors.yellow}
          />
        </div>
        <div data-nav="wiki">
        <div data-tutorial="wiki-nav">
          <NavItem
            label="Wiki"
            icon={<WikiIcon className="w-full h-full"/>}
            isActive={activePage === 'wiki'}
            onClick={() => setActivePage('wiki')}
            activeColor={colors.green}
          />
        </div>
        </div>
        <div data-nav="casino">
        <div data-tutorial="casino-nav">
          <NavItem
            label="Casino"
            icon={<CasinoIcon className="w-full h-full"/>}
            isActive={activePage === 'casino'}
            onClick={() => setActivePage('casino')}
            activeColor={colors.purple}
          />
        </div>
        </div>
        <div data-nav="trade">
          <NavItem
            label="Trade"
            icon={<TradeIcon className="w-full h-full"/>}
            isActive={activePage === 'trade'}
            onClick={() => setActivePage('trade')}
            activeColor={colors.cyan}
          />
        </div>
        <div data-nav="scammers">
          <NavItem
            label="Scam"
            icon={<ScammersIcon className="w-full h-full"/>}
            isActive={activePage === 'scammers'}
            onClick={() => setActivePage('scammers')}
            activeColor={colors.red}
          />
        </div>
        <div data-nav="more">
        <div data-tutorial="more-nav">
          <NavItem
            label="More"
            icon={<svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
            isActive={activePage === 'more' || ['crafting', 'wheel', 'pvp', 'gifts', 'lottery', 'advanced_stats'].includes(activePage)}
            onClick={() => setActivePage('more')}
            activeColor={colors.purple}
          />
        </div>
        </div>
        <div data-nav="profile">
        <div data-tutorial="profile-nav">
          <NavItem
            label="Profile"
            icon={<ProfileIcon className="w-full h-full"/>}
            isActive={activePage === 'profile'}
            onClick={() => setActivePage('profile')}
            activeColor={colors.green}
          />
        </div>
        </div>
        {isAdmin && (
          <NavItem
            label="Admin"
            icon={<AdminIcon className="w-full h-full"/>}
            isActive={activePage === 'admin'}
            onClick={() => setActivePage('admin')}
            activeColor={colors.red}
          />
        )}
      </div>
    </div>
  );
};

export default NavBar;
