import React, { useContext } from 'react';
import { GameContext } from '../../App';
import { BALANCE_ICON } from '../constants';

type Page = 'main' | 'wiki' | 'casino' | 'profile' | 'admin' | 'trade' | 'scammers' | 'more' | 'calculator';

interface NavBarProps {
  activePage: string;
  setActivePage: (page: Page) => void;
  isAdmin: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ activePage, setActivePage, isAdmin }) => {
  const game = useContext(GameContext);
  const balance = game?.balance || 0;

  const navItems = [
    { id: 'main', label: 'ГЛАВНАЯ', icon: '🏠' },
    { id: 'profile', label: 'ПРОФИЛЬ', icon: '👤' },
    { id: 'casino', label: 'КАЗИНО', icon: '🎰' },
    { id: 'trade', label: 'ТОРГОВЛЯ', icon: '🤝' },
    { id: 'calculator', label: 'КАЛЬКУЛЯТОР', icon: '🧮' },
    { id: 'wiki', label: 'ВИКИ', icon: '📚' },
    { id: 'scammers', label: 'СКАМЕРЫ', icon: '🚫' }
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'АДМИН', icon: '⚡' });
  }

  return (
    <nav className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo Area */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => setActivePage('main')}
          >
            <div className="flex-shrink-0 relative">
              <div className="absolute -inset-1 bg-orange-600 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-200"></div>
              <span className="relative text-orange-600 font-black text-2xl tracking-tighter uppercase italic" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}>
                CASIC<span className="text-stone-200">FNTD</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-baseline space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id as Page)}
                  className={`relative px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider transition-all duration-200 overflow-hidden group ${activePage === item.id ? 'text-black' : 'text-stone-400 hover:text-orange-500'}`}
                >
                  <div className={`absolute inset-0 transform origin-bottom transition-transform duration-200 ${activePage === item.id ? 'bg-orange-600 scale-y-100' : 'bg-stone-800 scale-y-0 group-hover:scale-y-100'}`}></div>

                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </span>
                </button>
              ))}

              <button
                onClick={() => setActivePage('more')}
                className={`relative px-4 py-2 ml-4 rounded-sm text-sm font-bold uppercase tracking-wider transition-all duration-200 overflow-hidden group border border-orange-900/50 ${activePage === 'more' ? 'bg-orange-900/20 text-orange-400' : 'text-stone-500 hover:text-orange-400'}`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  ➕ ЕЩЁ
                </span>
              </button>
            </div>

            {/* Balance Display (Desktop) */}
            <div className="flex items-center gap-2 bg-stone-900/80 px-4 py-2 rounded border border-stone-700 ml-4 shadow-inner">
              <img src={BALANCE_ICON} alt="Balance" className="w-5 h-5 opacity-90" />
              <span className="font-rust text-orange-500 text-lg tracking-wide">{balance.toLocaleString()}</span>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden w-full fixed bottom-0 left-0 bg-stone-900 border-t border-stone-800 p-2 flex justify-around z-50 safe-area-pb overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as Page)}
                className={`flex flex-col items-center p-2 rounded min-w-[60px] ${activePage === item.id ? 'text-orange-500' : 'text-stone-500'}`}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-[9px] font-bold uppercase whitespace-nowrap">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => setActivePage('more')}
              className={`flex flex-col items-center p-2 rounded min-w-[60px] ${activePage === 'more' ? 'text-orange-500' : 'text-stone-500'}`}
            >
              <span className="text-xl mb-1">➕</span>
              <span className="text-[9px] font-bold uppercase">ЕЩЁ</span>
            </button>
          </div>

          {/* Mobile Balance (Top Right) */}
          <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-stone-900/80 px-3 py-1 rounded border border-stone-700">
            <img src={BALANCE_ICON} alt="Balance" className="w-4 h-4 opacity-90" />
            <span className="font-rust text-orange-500 text-sm tracking-wide">{balance.toLocaleString()}</span>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;