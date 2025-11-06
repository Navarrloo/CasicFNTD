import React, { useState, useContext, useEffect } from 'react';
import { GameContext } from '../App';
import { supabase } from '../lib/supabase';
import { BALANCE_ICON } from './constants';

const TICKET_COST = 10;
const LOTTERY_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface LotteryData {
  jackpot: number;
  participants: number;
  myTickets: number;
  nextDraw: string;
  lastWinner?: {
    username: string;
    prize: number;
  };
}

const LotteryPage: React.FC = () => {
  const game = useContext(GameContext);
  const [lotteryData, setLotteryData] = useState<LotteryData>({
    jackpot: 500,
    participants: 0,
    myTickets: 0,
    nextDraw: new Date(Date.now() + LOTTERY_DURATION).toISOString(),
  });
  const [ticketsToBuy, setTicketsToBuy] = useState(1);

  useEffect(() => {
    loadLotteryData();
  }, [game?.userProfile?.id]);

  const loadLotteryData = async () => {
    if (!game?.userProfile || !supabase) return;

    const { data } = await supabase
      .from('profiles')
      .select('lottery_tickets, lottery_jackpot')
      .eq('id', game.userProfile.id)
      .single();

    if (data) {
      setLotteryData(prev => ({
        ...prev,
        myTickets: data.lottery_tickets || 0,
        jackpot: data.lottery_jackpot || 500,
      }));
    }
  };

  const buyTickets = async () => {
    if (!game?.userProfile || !supabase) return;

    const cost = ticketsToBuy * TICKET_COST;
    if (game.balance < cost) {
      game.showToast('Not enough souls!', 'error');
      return;
    }

    await game.updateBalance(game.balance - cost);

    const newTickets = lotteryData.myTickets + ticketsToBuy;
    await supabase.from('profiles')
      .update({ lottery_tickets: newTickets })
      .eq('id', game.userProfile.id);

    setLotteryData(prev => ({
      ...prev,
      myTickets: newTickets,
      participants: prev.participants + 1,
    }));

    game.showToast(`Bought ${ticketsToBuy} ticket(s)!`, 'success');
  };

  const getTimeUntilDraw = () => {
    const now = new Date().getTime();
    const draw = new Date(lotteryData.nextDraw).getTime();
    const diff = draw - now;

    if (diff <= 0) return 'Drawing soon...';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (!game) return null;

  return (
    <div className="p-2 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col p-4 min-h-0">
        <h1 className="font-pixel text-3xl text-glow-purple mb-4 text-center">🎫 Soul Lottery</h1>

        {/* Jackpot Display */}
        <div className="bg-black/50 border-2 border-accent-yellow p-6 mb-4 text-center">
          <p className="font-pixel text-sm text-text-dark mb-2">Current Jackpot</p>
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={BALANCE_ICON} alt="Souls" className="w-12 h-12" />
            <span className="font-pixel text-5xl text-glow-yellow animate-pulse">
              {lotteryData.jackpot.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-text-dark">+ Legendary Unit</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-black/30 p-2 border border-border-dark text-center">
            <p className="text-xs text-text-dark mb-1">Next Draw</p>
            <p className="font-pixel text-sm text-accent-cyan">{getTimeUntilDraw()}</p>
          </div>
          <div className="bg-black/30 p-2 border border-border-dark text-center">
            <p className="text-xs text-text-dark mb-1">Participants</p>
            <p className="font-pixel text-sm text-accent-green">{lotteryData.participants}</p>
          </div>
          <div className="bg-black/30 p-2 border border-border-dark text-center">
            <p className="text-xs text-text-dark mb-1">Your Tickets</p>
            <p className="font-pixel text-sm text-accent-yellow">{lotteryData.myTickets}</p>
          </div>
        </div>

        {/* Last Winner */}
        {lotteryData.lastWinner && (
          <div className="bg-black/20 border border-accent-green p-3 mb-4">
            <p className="text-xs text-text-dark mb-1">Last Winner</p>
            <p className="font-pixel text-accent-green">@{lotteryData.lastWinner.username}</p>
            <p className="text-xs text-text-light">Won {lotteryData.lastWinner.prize} souls</p>
          </div>
        )}

        {/* Buy Tickets */}
        <div className="bg-black/30 p-4 border border-border-dark">
          <p className="font-pixel text-lg text-glow-cyan mb-3">Buy Tickets</p>
          
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setTicketsToBuy(Math.max(1, ticketsToBuy - 1))}
              className="btn btn-yellow !px-4 !py-2"
            >
              -
            </button>
            <div className="flex-grow text-center">
              <p className="font-pixel text-3xl text-text-light">{ticketsToBuy}</p>
              <p className="text-xs text-text-dark">
                Cost: {ticketsToBuy * TICKET_COST} souls
              </p>
            </div>
            <button
              onClick={() => setTicketsToBuy(ticketsToBuy + 1)}
              className="btn btn-yellow !px-4 !py-2"
            >
              +
            </button>
          </div>

          <button
            onClick={buyTickets}
            disabled={game.balance < ticketsToBuy * TICKET_COST}
            className="btn btn-green w-full"
          >
            Buy {ticketsToBuy} Ticket(s)
          </button>
        </div>

        {/* How it works */}
        <div className="mt-4 bg-black/20 p-3 border border-border-dark">
          <p className="font-pixel text-sm text-accent-purple mb-2">How it works:</p>
          <ul className="text-xs text-text-dark space-y-1 list-disc list-inside">
            <li>Buy tickets for {TICKET_COST} souls each</li>
            <li>Draw happens every 24 hours automatically</li>
            <li>Winner gets jackpot + legendary unit</li>
            <li>More tickets = higher chance to win</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LotteryPage;

