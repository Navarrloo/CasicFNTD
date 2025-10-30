import React from 'react';
import { HomeIcon, AdminIcon, WikiIcon, CasinoIcon, ProfileIcon } from './icons/Icons';

interface NavBarProps {
  activePage: string;
  setActivePage: (page: 'main' | 'wiki' | 'casino' | 'profile' | 'admin') => void;
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
  };
  
  const activeColor = {
      main: colors.yellow,
      wiki: colors.green,
      casino: colors.purple,
      profile: colors.green,
      admin: colors.red
  }[activePage] || 'transparent';


  return (
    <div 
        className="fixed bottom-0 left-0 right-0 h-20 bg-black/70 backdrop-blur-md border-t border-border-dark/50"
        style={{ 
            boxShadow: `0 -2px 15px -5px ${activeColor}, inset 0 1px 0px rgba(0, 255, 255, 0.1)`,
            transition: 'box-shadow 0.4s ease-in-out'
        }}
    >
      <div className="flex justify-around items-center h-full">
        <NavItem
          label="Main"
          icon={<HomeIcon className="w-full h-full"/>}
          isActive={activePage === 'main'}
          onClick={() => setActivePage('main')}
          activeColor={colors.yellow}
        />
        <NavItem
          label="Wiki"
          icon={<WikiIcon className="w-full h-full"/>}
          isActive={activePage === 'wiki'}
          onClick={() => setActivePage('wiki')}
          activeColor={colors.green}
        />
        <NavItem
          label="Casino"
          icon={<CasinoIcon className="w-full h-full"/>}
          isActive={activePage === 'casino'}
          onClick={() => setActivePage('casino')}
          activeColor={colors.purple}
        />
        <NavItem
          label="Profile"
          icon={<ProfileIcon className="w-full h-full"/>}
          isActive={activePage === 'profile'}
          onClick={() => setActivePage('profile')}
          activeColor={colors.green}
        />
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