import React, { useState, useMemo, createContext, useEffect, useCallback } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { ADMIN_USERNAMES, STARTING_BALANCE, ACHIEVEMENTS, CASINO_COST } from './components/constants';
import NavBar from './components/layout/NavBar';
import MainPage from './components/MainPage';
import CasinoPage from './components/CasinoPage';
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage';
import WikiPage from './components/WikiPage';
import TradePage from './components/trade/TradePage';
import ScammersPage from './components/ScammersPage';
import DailyBonusModal from './components/DailyBonusModal';
import CraftingPage from './components/CraftingPage';
import WheelOfFortunePage from './components/WheelOfFortunePage';
import QuestsLivePage from './components/QuestsLivePage';
import PvPBattlePage from './components/PvPBattlePage';
import ReferralPage from './components/ReferralPage';
import GiftsPage from './components/GiftsPage';
import BattlePassPage from './components/BattlePassPage';
import LotteryPage from './components/LotteryPage';
import AdvancedStatsPage from './components/AdvancedStatsPage';
import SettingsPage from './components/SettingsPage';
import MorePage from './components/MorePage';
import TutorialOverlay from './components/TutorialOverlay';
import { Unit } from './types';
import { supabase } from './lib/supabase';
import ToastProvider from './components/shared/ToastProvider';
import { UNITS } from './components/constants';

type Page = 'main' | 'wiki' | 'casino' | 'profile' | 'admin' | 'trade' | 'scammers' | 'more' | 'crafting' | 'wheel' | 'quests' | 'pvp' | 'referral' | 'gifts' | 'battlepass' | 'lottery' | 'advanced_stats' | 'settings';
type DbStatus = 'connecting' | 'ok' | 'error';

interface GameContextType {
  balance: number;
  updateBalance: (newBalance: number) => Promise<void>;
  inventory: Unit[];
  addToInventory: (unit: Unit) => Promise<void>;
  removeFromInventory: (unitToRemove: Unit, unitIndex: number) => Promise<void>;
  isLoading: boolean;
  achievements: string[];
  unlockAchievement: (achievementId: string) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  userProfile: { id: number; username: string; } | null;
  unitStats: Record<number, number>;
  totalSpins: number;
  totalSpent: number;
  totalEarned: number;
  dailyStreak: number;
  recordUnitWin: (unitId: number) => Promise<void>;
  addTransaction: (transaction: { type: 'purchase' | 'sale' | 'cancel', unit: Unit, price: number, otherParty?: string }) => Promise<void>;
  tradeCount: number;
  tutorialActive: boolean;
  tutorialStep: number;
  setActivePage: (page: any) => void;
}

export const GameContext = createContext<GameContextType | null>(null);

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('main');
  const { user } = useTelegram();
  const [userProfile, setUserProfile] = useState<{id: number, username: string} | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [inventory, setInventory] = useState<Unit[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<DbStatus>('connecting');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Daily bonus state
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [lastDailyBonusDate, setLastDailyBonusDate] = useState<string | null>(null);
  const [showDailyBonus, setShowDailyBonus] = useState<boolean>(false);
  
  // Statistics state
  const [unitStats, setUnitStats] = useState<Record<number, number>>({});
  const [totalSpins, setTotalSpins] = useState<number>(0);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [tradeCount, setTradeCount] = useState<number>(0);
  
  // Tutorial state
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(0);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (!supabase) {
        console.error("Supabase client is not initialized. Check lib/supabase.ts");
        setDbStatus('error');
        setConnectionError("Supabase credentials are not set. Please edit `lib/supabase.ts` and replace the placeholder values.");
        return;
      }
      
      const { error } = await supabase.from('profiles').select('id').limit(1);

      if (error) {
        setConnectionError(error.message);
        const isFatalError = 
            error.message.includes('Failed to fetch') || 
            error.message.includes('JWT') ||
            error.message.includes('Invalid API key');
        
        if (isFatalError) {
           console.error("Supabase connection error:", error.message);
           setDbStatus('error');
        } else {
           console.warn("Supabase query warning (e.g., RLS or missing table):", error.message);
           setDbStatus('ok'); 
        }
      } else {
         setDbStatus('ok');
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    if (dbStatus !== 'ok' || !supabase) return;

    if (!user) {
        if (window.Telegram?.WebApp?.initData === "") setIsLoading(false);
        return;
    };

    const loadUserProfile = async () => {
        setIsLoading(true);
        if (!supabase) {
            console.error("Supabase client not available for profile load.");
            setIsLoading(false);
            return;
        }
        
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = row not found
            console.error('Error fetching profile', error);
            setIsLoading(false);
            return;
        }

        if (profile) {
            setBalance(profile.balance);
            const userInventory = Array.isArray(profile.inventory) ? profile.inventory : [];
            const userAchievements = Array.isArray(profile.achievements) ? profile.achievements : [];
            setInventory(userInventory);
            setAchievements(userAchievements);
            setUserProfile({id: profile.id, username: profile.username || 'unknown' });
            
            // Check if tutorial should be shown
            if (!profile.tutorial_completed && userInventory.length === 0) {
                // Give starter units if somehow missing
                const starterUnits = UNITS.filter(u => [101, 102, 103].includes(u.id));
                await supabase.from('profiles')
                    .update({ inventory: starterUnits })
                    .eq('id', profile.id);
                setInventory(starterUnits);
                
                setTimeout(() => {
                    setShowTutorial(true);
                    setTutorialStep(0);
                }, 500);
            }
            
            // Load daily bonus data
            setDailyStreak(profile.daily_streak || 0);
            setLastDailyBonusDate(profile.last_daily_bonus_date || null);
            
            // Load statistics
            setUnitStats(profile.unit_stats || {});
            setTotalSpins(profile.total_spins || 0);
            setTotalSpent(profile.total_spent || 0);
            setTotalEarned(profile.total_earned || 0);
            setTradeCount(profile.trade_count || 0);
            
            // Check if daily bonus is available
            const lastDate = profile.last_daily_bonus_date;
            if (!lastDate) {
              setTimeout(() => setShowDailyBonus(true), 1000);
            } else {
              const today = new Date().toISOString().split('T')[0];
              const lastClaim = new Date(lastDate).toISOString().split('T')[0];
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split('T')[0];
              
              if (lastClaim !== today && (lastClaim === yesterdayStr || lastClaim !== yesterdayStr)) {
                setTimeout(() => setShowDailyBonus(true), 1000);
              }
            }
        } else {
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    balance: STARTING_BALANCE,
                    inventory: [],
                    achievements: [],
                    daily_streak: 0,
                    last_daily_bonus_date: null,
                    unit_stats: {},
                    total_spins: 0,
                    total_spent: 0,
                    total_earned: 0,
                    transaction_history: [],
                    trade_count: 0,
                })
                .select()
                .single();
            
            if (insertError) {
                console.error('Error creating profile', insertError);
            } else if (newProfile) {
                // Give starter units (Freddy, Bonnie, Chica)
                const starterUnits = UNITS.filter(u => [101, 102, 103].includes(u.id));
                
                const { data: updatedProfile } = await supabase
                    .from('profiles')
                    .update({ inventory: starterUnits })
                    .eq('id', newProfile.id)
                    .select()
                    .single();

                const finalProfile = updatedProfile || newProfile;
                
                setBalance(finalProfile.balance);
                setInventory(starterUnits);
                setAchievements(finalProfile.achievements || []);
                setUserProfile({id: finalProfile.id, username: finalProfile.username || 'unknown' });
                setDailyStreak(0);
                setLastDailyBonusDate(null);
                setUnitStats({});
                setTotalSpins(0);
                setTotalSpent(0);
                setTotalEarned(0);
                setTradeCount(0);
                
                // Start tutorial for new users
                setTimeout(() => {
                    setShowTutorial(true);
                    setTutorialStep(0);
                }, 500);
            }
        }
        setIsLoading(false);
    };

    loadUserProfile();
  }, [user, dbStatus]);

  // Check daily bonus function is now inline in loadUserProfile to avoid dependency issues

  const unlockAchievement = useCallback(async (achievementId: string) => {
    if (!user || !supabase || achievements.includes(achievementId)) return;

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return;

    const newAchievements = [...achievements, achievementId];

    const { error } = await supabase
      .from('profiles')
      .update({ achievements: newAchievements })
      .eq('id', user.id);
    
    if (error) {
      console.error('Failed to save achievements', error);
      showToast('Failed to save achievement progress.', 'error');
    } else {
      setAchievements(newAchievements);
      showToast(`Achievement Unlocked: ${achievement.name}!`, 'success');
    }
  }, [user, achievements, supabase, showToast]);

  const addToInventory = useCallback(async (unit: Unit) => {
    if (!user || !supabase) return;
    
    const oldInventory = inventory;
    const newInventory = [...inventory, unit];
    setInventory(newInventory);

    const { error } = await supabase
        .from('profiles')
        .update({ inventory: newInventory })
        .eq('id', user.id);
    
    if (error) {
        console.error("Failed to update inventory in DB:", error);
        setInventory(oldInventory); // Revert on failure
    } else {
        if(newInventory.length >= 5){
            unlockAchievement('novice_collector');
        }
    }
  }, [user, inventory, unlockAchievement, supabase]);
  
  const removeFromInventory = useCallback(async (_unitToRemove: Unit, unitIndex: number) => {
    if (!user || !supabase) return;
    
    const oldInventory = inventory;
    const newInventory = [...inventory];
    newInventory.splice(unitIndex, 1);
    setInventory(newInventory);

    const { error } = await supabase
        .from('profiles')
        .update({ inventory: newInventory })
        .eq('id', user.id);

    if (error) {
        console.error("Failed to update inventory in DB:", error);
        setInventory(oldInventory); // Revert on failure
    }
  }, [user, inventory, supabase]);

  const claimDailyBonus = useCallback(async (amount: number) => {
    if (!user || !supabase) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (lastDailyBonusDate) {
      const lastClaim = new Date(lastDailyBonusDate).toISOString().split('T')[0];
      if (lastClaim === yesterdayStr) {
        newStreak = dailyStreak + 1;
      }
    }

    const newBalance = balance + amount;
    setBalance(newBalance);
    setDailyStreak(newStreak);
    setLastDailyBonusDate(today);
    setTotalEarned(totalEarned + amount);

    const { error } = await supabase
      .from('profiles')
      .update({
        balance: newBalance,
        daily_streak: newStreak,
        last_daily_bonus_date: today,
        total_earned: totalEarned + amount,
      })
      .eq('id', user.id);

    if (error) {
      console.error("Failed to claim daily bonus", error);
      showToast('Failed to claim daily bonus', 'error');
    } else {
      showToast(`Daily bonus claimed! +${amount} souls`, 'success');
    }
  }, [user, supabase, balance, dailyStreak, lastDailyBonusDate, totalEarned, showToast]);

  const recordUnitWin = useCallback(async (unitId: number) => {
    if (!user || !supabase) return;

    const newStats = { ...unitStats };
    newStats[unitId] = (newStats[unitId] || 0) + 1;
    setUnitStats(newStats);

    const newSpins = totalSpins + 1;
    const newSpent = totalSpent + CASINO_COST;
    setTotalSpins(newSpins);
    setTotalSpent(newSpent);

    const { error } = await supabase
      .from('profiles')
      .update({
        unit_stats: newStats,
        total_spins: newSpins,
        total_spent: newSpent,
      })
      .eq('id', user.id);

    if (error) {
      console.error("Failed to update statistics", error);
    }
  }, [user, supabase, unitStats, totalSpins, totalSpent]);

  const addTransaction = useCallback(async (transaction: { type: 'purchase' | 'sale' | 'cancel', unit: Unit, price: number, otherParty?: string }) => {
    if (!user || !supabase) return;

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('transaction_history, trade_count')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      console.error("Failed to fetch transaction history", fetchError);
      return;
    }

    const history = profile?.transaction_history || [];
    const newHistory = Array.isArray(history) ? [...history] : [];
    
    const newTransaction = {
      id: `${Date.now()}-${Math.random()}`,
      type: transaction.type,
      unit: transaction.unit,
      price: transaction.price,
      date: new Date().toISOString(),
      otherParty: transaction.otherParty,
    };

    newHistory.push(newTransaction);
    
    // Keep only last 100 transactions
    const trimmedHistory = newHistory.slice(-100);

    // Track completed trades (purchase only)
    let newTradeCount = profile?.trade_count || 0;
    if (transaction.type === 'purchase') {
      newTradeCount += 1;
      setTradeCount(newTradeCount);
      
      if (newTradeCount >= 10) {
        unlockAchievement('trader_pro');
      }
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        transaction_history: trimmedHistory,
        trade_count: newTradeCount
      })
      .eq('id', user.id);

    if (updateError) {
      console.error("Failed to update transaction history", updateError);
    }
  }, [user, supabase, unlockAchievement]);

  const updateBalance = useCallback(async (newBalance: number) => {
    if (!user || !supabase) return;
    const oldBalance = balance;
    setBalance(newBalance); 

    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id);

    if (error) {
      console.error("Failed to update balance", error);
      setBalance(oldBalance);
    }
  }, [balance, user, supabase]);

  const isAdmin = useMemo(() => {
    if (!user?.username) return false;
    return ADMIN_USERNAMES.includes(user.username.toUpperCase());
  }, [user]);

  const renderPage = () => {
    if (dbStatus === 'connecting') {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="font-pixel text-2xl text-glow-cyan animate-pulse">Connecting to Database...</p>
            </div>
        );
    }

    if (dbStatus === 'error') {
        const isCorsError = connectionError?.includes('Failed to fetch');
        return (
             <div className="p-4 flex items-center justify-center h-full">
               <div className="container-glow container-glow-red max-w-lg text-left">
                {isCorsError ? (
                  <>
                    <h1 className="font-pixel text-2xl text-glow-red mb-4 text-center">CORS Configuration Required</h1>
                    <p className="text-text-light text-base mb-4">
                        The app failed to connect to the database. This is a Cross-Origin Resource Sharing (CORS) issue that must be resolved in your Supabase project settings.
                    </p>
                    
                    <div className="bg-black/30 p-3 border border-border-dark space-y-3">
                        <p className="font-pixel text-lg text-accent-yellow">How to fix:</p>
                        <ol className="text-sm text-text-light list-decimal list-inside space-y-2">
                            <li>
                                Go to your <span className="font-bold text-white">Supabase Dashboard</span>.
                            </li>
                            <li>
                                Navigate to: <code className="bg-black/50 p-1 rounded-sm text-white">Project Settings &gt; API</code>.
                            </li>
                            <li>
                                Scroll down to <code className="bg-black/50 p-1 rounded-sm text-white">Cross-Origin Resource Sharing (CORS)</code>.
                            </li>
                            <li>
                                Add the following pattern to the text box: <br />
                                <code className="bg-black/50 p-1 rounded-sm text-accent-green mt-1 inline-block text-lg">*</code>
                            </li>
                            <li>
                                Click <span className="font-bold text-white">"Save"</span> and then reload this app.
                            </li>
                        </ol>
                    </div>

                    <p className="text-xs text-text-dark/70 mt-4 text-center">
                        Note: Using '*' allows requests from any domain. For production, you should restrict this to your specific app's domain.
                    </p>
                    
                    <div className="mt-6 flex justify-center">
                        <button 
                            onClick={() => window.location.reload()}
                            className="btn btn-yellow"
                        >
                            Reload App
                        </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <h1 className="font-pixel text-2xl text-glow-red mb-4">Supabase Configuration Required</h1>
                    <p className="text-text-light text-base mb-4">
                        The app needs to be connected to your database. This is a one-time setup step.
                    </p>
                    
                    <div className="bg-black/30 p-3 border border-border-dark space-y-3 text-left">
                        <p className="font-pixel text-lg text-accent-yellow">How to fix:</p>
                        <ol className="text-sm text-text-light list-decimal list-inside space-y-2">
                            <li>
                                Open the file: <br /> <code className="bg-black/50 p-1 rounded-sm text-white mt-1 inline-block">lib/supabase.ts</code>
                            </li>
                            <li>
                                Follow the instructions at the top of that file to add your unique Supabase <span className="font-bold text-white">Project URL</span> and <span className="font-bold text-white">Public Key</span>.
                            </li>
                            <li>
                                Save the file and reload this app.
                            </li>
                        </ol>
                    </div>

                    <p className="text-xs text-text-dark/70 mt-4">
                        Technical Error: {connectionError}
                    </p>
                    
                    <div className="mt-6 flex justify-center">
                        <button 
                            onClick={() => window.location.reload()}
                            className="btn btn-yellow"
                        >
                            Reload App
                        </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="font-pixel text-2xl text-glow-cyan animate-pulse">Loading Profile...</p>
            </div>
        );
    }
    switch (activePage) {
      case 'main':
        return <MainPage />;
      case 'wiki':
        return <WikiPage />;
      case 'casino':
        return <CasinoPage />;
      case 'trade':
        return <TradePage />;
      case 'scammers':
        return <ScammersPage userId={user?.id || 0} isAdmin={isAdmin} />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return isAdmin ? <AdminPage /> : <MainPage />;
      case 'crafting':
        return <CraftingPage />;
      case 'wheel':
        return <WheelOfFortunePage />;
      case 'quests':
        return <QuestsLivePage />;
      case 'pvp':
        return <PvPBattlePage />;
      case 'referral':
        return <ReferralPage />;
      case 'gifts':
        return <GiftsPage />;
      case 'battlepass':
        return <BattlePassPage />;
      case 'lottery':
        return <LotteryPage />;
      case 'advanced_stats':
        return <AdvancedStatsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'more':
        return <MorePage onNavigate={(page) => setActivePage(page as Page)} />;
      default:
        return <MainPage />;
    }
  };

  const getDailyBonusAmount = useCallback(() => {
    const baseReward = 50;
    if (dailyStreak >= 7) return baseReward * 3;
    if (dailyStreak >= 3) return baseReward * 2;
    return baseReward;
  }, [dailyStreak]);

  return (
    <GameContext.Provider value={{ 
      balance, 
      updateBalance, 
      inventory, 
      addToInventory, 
      removeFromInventory, 
      isLoading, 
      achievements, 
      unlockAchievement, 
      showToast, 
      userProfile,
      unitStats,
      totalSpins,
      totalSpent,
      totalEarned,
      dailyStreak,
      recordUnitWin,
      addTransaction,
      tradeCount,
      tutorialActive: showTutorial,
      tutorialStep,
      setActivePage,
    }}>
      <ToastProvider toast={toast}>
        <div className="bg-transparent h-full text-text-light font-pixel selection:bg-accent-green selection:text-background-dark flex flex-col">
          <main className="flex-grow pt-4 px-2 pb-24 flex flex-col min-h-0">
            {renderPage()}
          </main>
          <NavBar activePage={activePage} setActivePage={setActivePage} isAdmin={isAdmin} />
          <DailyBonusModal
            isOpen={showDailyBonus && !showTutorial}
            onClose={() => setShowDailyBonus(false)}
            onClaim={claimDailyBonus}
            streakDays={dailyStreak}
            nextBonus={getDailyBonusAmount()}
          />
          {showTutorial && (
            <TutorialOverlay
              step={tutorialStep}
              onNext={() => setTutorialStep(s => s + 1)}
              onComplete={async () => {
                setShowTutorial(false);
                if (userProfile && supabase) {
                  await supabase.from('profiles')
                    .update({ tutorial_completed: true })
                    .eq('id', userProfile.id);
                }
              }}
              activePage={activePage}
              setActivePage={setActivePage}
            />
          )}
        </div>
      </ToastProvider>
    </GameContext.Provider>
  );
};

export default App;