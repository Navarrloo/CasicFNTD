import React from 'react';
import NavBar from './NavBar';

interface MainLayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: any) => void;
  isAdmin: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activePage, setActivePage, isAdmin }) => {
  return (
    <div className="min-h-screen flex flex-col font-rust text-stone-200 selection:bg-orange-500/30 selection:text-orange-200">
      <NavBar activePage={activePage} setActivePage={setActivePage} isAdmin={isAdmin} />

      <main className="flex-grow relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        <div className="bg-stone-950/80 backdrop-blur-md border border-stone-800 rounded-lg shadow-2xl min-h-[80vh] relative">
          {/* Inner glow effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-orange-500/5 to-transparent opacity-50"></div>

          {/* Content Container */}
          <div className="relative z-10 p-4 sm:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
