import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../App';
import { Unit } from '../types';
import { BALANCE_ICON } from './constants';
import { supabase } from '../lib/supabase';

interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'cancel';
  unit: Unit;
  price: number;
  date: string;
  otherParty?: string;
}

const TransactionHistoryView: React.FC = () => {
  const game = useContext(GameContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!game?.userProfile || !supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('transaction_history')
        .eq('id', game.userProfile.id)
        .single();

      if (error) {
        console.error('Error loading transaction history:', error);
        setTransactions([]);
      } else {
        const history = profile?.transaction_history || [];
        setTransactions(Array.isArray(history) ? history : []);
      }
      setLoading(false);
    };

    loadHistory();
  }, [game?.userProfile]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-glow-cyan animate-pulse">Loading History...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center text-center py-10 px-4 bg-black/20 border-2 border-dashed border-border-dark">
        <div>
          <p className="text-text-dark font-pixel text-sm">No transactions yet.</p>
          <p className="text-text-dark/50 mt-2 text-sm">Buy or sell units to see your history here!</p>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-accent-green';
      case 'sale': return 'text-accent-yellow';
      case 'cancel': return 'text-text-dark';
      default: return 'text-text-light';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'purchase': return 'BOUGHT';
      case 'sale': return 'SOLD';
      case 'cancel': return 'CANCELLED';
      default: return type.toUpperCase();
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex-grow overflow-y-auto pr-2 min-h-0">
      <div className="space-y-3">
        {sortedTransactions.map((tx) => (
          <div 
            key={tx.id} 
            className="bg-black/50 border-2 border-border-light p-4 flex items-center gap-3"
          >
            <div className="w-16 h-20 flex-shrink-0">
              <img 
                src={tx.unit.image} 
                alt={tx.unit.name} 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-pixel text-sm text-text-light truncate">{tx.unit.name}</p>
                <span className={`text-xs font-pixel px-2 py-1 border ${getTypeColor(tx.type)} border-current/50`}>
                  {getTypeLabel(tx.type)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <img src={BALANCE_ICON} alt="Souls" className="w-4 h-4" />
                <span className={`font-pixel ${tx.type === 'purchase' ? 'text-accent-red' : 'text-accent-green'}`}>
                  {tx.type === 'purchase' ? '-' : '+'}{tx.price.toLocaleString()}
                </span>
              </div>
              
              {tx.otherParty && (
                <p className="text-text-dark text-xs mt-1">
                  {tx.type === 'purchase' ? 'From' : 'To'}: @{tx.otherParty}
                </p>
              )}
              
              <p className="text-text-dark/50 text-xs mt-1">
                {new Date(tx.date).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistoryView;

