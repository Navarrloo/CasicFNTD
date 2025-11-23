import React from 'react';

// Images from public folder - use direct paths as strings
const navIconBase = '/nav-icons/nav-icon-base.jpg';
const navIconWiki = '/nav-icons/nav-icon-wiki.jpg';
const navIconCasino = '/nav-icons/nav-icon-casino.jpg';
const navIconMarket = '/nav-icons/nav-icon-market.jpg';
const navIconScammers = '/nav-icons/nav-icon-scammers.jpg';
const navIconAdmin = '/nav-icons/nav-icon-admin.jpg';

type Page = 'main' | 'wiki' | 'casino' | 'profile' | 'admin' | 'trade';

interface NavBarProps {
  activePage: string;
  setActivePage: (page: Page) => void;
  isAdmin: boolean;
}

const NavItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  imageSrc: string;
  activeColor: string;
}> = ({ label, imageSrc, isActive, onClick, activeColor }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleClick = () => {
    // Haptic feedback for Telegram WebApp
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className="relative flex flex-col items-center justify-center w-16 h-full transition-all duration-300 group focus:outline-none pt-2"
      aria-label={label}
    >
      {/* Top Glow Indicator with pulse animation */}
      <div
        className={`absolute top-0 h-1 w-8 rounded-full transition-all duration-300 ${isActive ? 'animate-pulseGlow' : ''}`}
        style={{
          backgroundColor: isActive ? activeColor : 'transparent',
          opacity: isActive ? 1 : 0,
        }}
      />

      {/* Icon with bounce animation on active */}
      <div
        className={`w-8 h-8 mb-1 flex items-center justify-center transition-all duration-300 ${isPressed ? 'animate-buttonPress' : ''
          } ${isActive ? 'animate-bounceIn' : ''
          } group-hover:scale-110`}
        style={{
          filter: isActive ? `drop-shadow(0 0 8px ${activeColor}) drop-shadow(0 0 12px ${activeColor})` : 'none',
          transform: isActive && !isPressed ? 'scale(1.15)' : 'scale(1)'
        }}
      >
        <img src={imageSrc} alt={label} className="w-full h-full object-contain" />
      </div>

      {/* Label with glow effect */}
      <span
        className={`text-xs uppercase font-pixel font-bold transition-colors duration-300 ${!isActive ? 'text-text-dark group-hover:text-text-light' : ''}`}
        style={{
          color: isActive ? activeColor : undefined,
          textShadow: isActive ? `0 0 6px ${activeColor}, 0 0 10px ${activeColor}` : 'none'
        }}
      >
        {label}
      </span>

      {/* Ripple effect on click */}
      {isPressed && (
        <div
          className="absolute inset-0 rounded-full opacity-30 animate-pulse"
          style={{ backgroundColor: activeColor }}
        />
      )}
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
    profile: colors.green,
    admin: colors.red
  }[activePage] || 'transparent';


  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-20 bg-black/70 backdrop-blur-md border-t border-border-dark/50"
      style={{
        boxShadow: `0 -2px 15px -5px ${activeColor}, inset 0 1px 0px rgba(255, 50, 50, 0.2)`,
        transition: 'box-shadow 0.4s ease-in-out'
      }}
    >


      // ... existing code ...

      <div className="flex justify-around items-center h-full">
        <NavItem
          label="ГЛАВНАЯ"
          imageSrc={navIconBase}
          isActive={activePage === 'main'}
          onClick={() => setActivePage('main')}
          activeColor={colors.yellow}
        />
        <NavItem
          label="ВИКИ"
          imageSrc={navIconWiki}
          isActive={activePage === 'wiki'}
          onClick={() => setActivePage('wiki')}
          activeColor={colors.green}
        />
        <NavItem
          label="КАЗИНО"
          imageSrc={navIconCasino}
          isActive={activePage === 'casino'}
          onClick={() => setActivePage('casino')}
          activeColor={colors.purple}
        />
        <NavItem
          label="ТОРГОВЛЯ"
          imageSrc={navIconMarket}
          isActive={activePage === 'trade'}
          onClick={() => setActivePage('trade')}
          activeColor={colors.cyan}
        />
        <NavItem
          label="ПРОФИЛЬ"
          imageSrc={navIconScammers}
          isActive={activePage === 'profile'}
          onClick={() => setActivePage('profile')}
          activeColor={colors.green}
        />
        {isAdmin && (
          <NavItem
            label="АДМИН"
            imageSrc={navIconAdmin}
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