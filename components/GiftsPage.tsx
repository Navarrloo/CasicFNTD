import React, { useState, useContext, useEffect } from 'react';
import { GameContext } from '../App';
import { supabase } from '../lib/supabase';
import { Unit } from '../types';
import UnitCard from './shared/UnitCard';

interface Gift {
  id: string;
  from_username: string;
  unit: Unit;
  message: string;
  created_at: string;
}

const GiftsPage: React.FC = () => {
  const game = useContext(GameContext);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [recipientUsername, setRecipientUsername] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<{unit: Unit, index: number} | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadGifts();
  }, [game?.userProfile?.id]);

  const loadGifts = async () => {
    if (!game?.userProfile || !supabase) return;

    const { data } = await supabase
      .from('profiles')
      .select('pending_gifts')
      .eq('id', game.userProfile.id)
      .single();

    if (data?.pending_gifts) {
      setGifts(data.pending_gifts || []);
    }
  };

  const sendGift = async () => {
    if (!game?.userProfile || !supabase || !selectedUnit) return;

    if (!recipientUsername.trim()) {
      game.showToast('Enter recipient username!', 'error');
      return;
    }

    // Find recipient
    const { data: recipient } = await supabase
      .from('profiles')
      .select('id, username, pending_gifts')
      .ilike('username', recipientUsername.trim())
      .single();

    if (!recipient) {
      game.showToast('User not found!', 'error');
      return;
    }

    if (recipient.id === game.userProfile.id) {
      game.showToast('Cannot send gift to yourself!', 'error');
      return;
    }

    // Remove unit from sender
    await game.removeFromInventory(selectedUnit.unit, selectedUnit.index);

    // Add gift to recipient
    const newGift: Gift = {
      id: `${Date.now()}-${Math.random()}`,
      from_username: game.userProfile.username,
      unit: selectedUnit.unit,
      message: message || 'A gift for you!',
      created_at: new Date().toISOString(),
    };

    const recipientGifts = recipient.pending_gifts || [];
    await supabase.from('profiles')
      .update({ pending_gifts: [...recipientGifts, newGift] })
      .eq('id', recipient.id);

    game.showToast(`Gift sent to @${recipient.username}!`, 'success');
    setShowSendModal(false);
    setSelectedUnit(null);
    setRecipientUsername('');
    setMessage('');
  };

  const acceptGift = async (gift: Gift) => {
    if (!game?.userProfile || !supabase) return;

    // Add unit to inventory
    await game.addToInventory(gift.unit);

    // Remove from pending gifts
    const newGifts = gifts.filter(g => g.id !== gift.id);
    setGifts(newGifts);

    await supabase.from('profiles')
      .update({ pending_gifts: newGifts })
      .eq('id', game.userProfile.id);

    game.showToast(`Gift accepted from @${gift.from_username}!`, 'success');
  };

  if (!game) return null;

  return (
    <div className="p-4 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col p-6 min-h-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-pixel text-3xl text-glow-purple">🎁 GIFTS</h1>
          <button onClick={() => setShowSendModal(true)} className="btn btn-green !py-2">
            Send Gift
          </button>
        </div>

        {/* Received Gifts */}
        <div className="flex-grow overflow-y-auto pr-2 min-h-0">
          {gifts.length > 0 ? (
            <div className="space-y-3">
              {gifts.map(gift => (
                <div key={gift.id} className="bg-black/30 border border-accent-purple p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-28">
                      <UnitCard unit={gift.unit} />
                    </div>
                    <div className="flex-grow">
                      <p className="font-pixel text-sm text-glow-green">From: @{gift.from_username}</p>
                      <p className="text-xs text-text-light mt-1">{gift.message}</p>
                      <p className="text-xs text-text-dark mt-1">
                        {new Date(gift.created_at).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => acceptGift(gift)}
                        className="btn btn-green !py-1 !text-sm mt-2"
                      >
                        Accept Gift
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-text-dark font-pixel">No gifts received yet.</p>
                <p className="text-text-dark/50 text-sm mt-2">Gifts from friends will appear here!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Send Gift Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="modal-content w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-pixel text-xl text-glow-cyan">Send a Gift</h2>
              <button onClick={() => setShowSendModal(false)} className="btn !p-2 !border-none text-glow-red text-2xl">
                X
              </button>
            </div>

            <div className="space-y-4">
              {/* Recipient */}
              <div>
                <p className="font-pixel text-sm text-text-light mb-2">Recipient Username</p>
                <input
                  type="text"
                  placeholder="username"
                  value={recipientUsername}
                  onChange={e => setRecipientUsername(e.target.value)}
                  className="admin-input w-full"
                />
              </div>

              {/* Select Unit */}
              <div>
                <p className="font-pixel text-sm text-text-light mb-2">Select Unit</p>
                <div className="h-48 overflow-y-auto bg-black/20 p-2 border border-border-dark grid grid-cols-4 gap-2">
                  {game.inventory.map((unit, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedUnit({unit, index})}
                      className={`cursor-pointer ${
                        selectedUnit?.index === index ? 'ring-2 ring-accent-green' : ''
                      }`}
                    >
                      <UnitCard unit={unit} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="font-pixel text-sm text-text-light mb-2">Message (optional)</p>
                <textarea
                  placeholder="Write a message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="admin-input w-full h-20 resize-none"
                  maxLength={100}
                />
              </div>

              <button
                onClick={sendGift}
                disabled={!selectedUnit || !recipientUsername.trim()}
                className="btn btn-green w-full"
              >
                Send Gift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftsPage;

