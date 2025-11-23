import React, { useContext, useState } from 'react';
import { Listing } from '../../types';
import { GameContext } from '../../App';
import UnitCard from '../shared/UnitCard';
import { BALANCE_ICON } from '../constants';
import { supabase } from '../../lib/supabase';
import { SoundManager } from '../../utils/sounds';

interface ListingCardProps {
    listing: Listing;
    onAction: () => void; // Callback to refresh listings
    onMakeOffer?: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onAction, onMakeOffer }) => {
    const game = useContext(GameContext);
    const [isProcessing, setIsProcessing] = useState(false);
    const isOwner = game?.userProfile?.id === listing.seller_id;

    const handleBuy = async () => {
        if (!game || !game.userProfile || !supabase) return;
        if (game.balance < listing.asking_price) {
            game.showToast('Not enough souls!', 'error');
            return;
        }
        if (!window.confirm(`Buy ${listing.unit_data.name} for ${listing.asking_price} souls?`)) {
            return;
        }

        setIsProcessing(true);
        const { error } = await supabase.rpc('buy_listing', {
            listing_id_to_buy: listing.id,
            buyer_user_id: game.userProfile.id
        });

        if (error) {
            console.error("Error buying item:", error);
            game.showToast(error.message, 'error');
            onAction(); // Refresh listings to remove the stale one
        } else {
            // Record transaction for buyer
            await game.addTransaction({
                type: 'purchase',
                unit: listing.unit_data,
                price: listing.asking_price,
                otherParty: listing.seller_username,
            });

            SoundManager.play('success');
            game.showToast('Purchase successful! Refreshing...', 'success');
            // The database is now the source of truth. Reload the app to get the
            // latest profile state (balance, inventory) safely.
            setTimeout(() => window.location.reload(), 1500);
        }
        setIsProcessing(false);
    };

    const handleCancel = async () => {
        if (!game || !game.userProfile || !supabase) return;
        if (!window.confirm('Are you sure you want to cancel this listing? The unit will be returned to your inventory.')) return;

        setIsProcessing(true);
        const { error } = await supabase.rpc('cancel_listing', {
            listing_id_to_cancel: listing.id,
            seller_user_id: game.userProfile.id
        });

        if (error) {
            console.error("Error cancelling listing:", error);
            game.showToast(error.message, 'error');
            onAction(); // Refresh on error
        } else {
            // Record transaction for cancellation
            await game.addTransaction({
                type: 'cancel',
                unit: listing.unit_data,
                price: listing.asking_price,
            });

            game.showToast('Listing cancelled! Refreshing...', 'success');
            // The database is updated. Reload the app to get the correct inventory.
            setTimeout(() => window.location.reload(), 1500);
        }
        setIsProcessing(false);
    };


    return (
        <div className="bg-stone-900/80 border border-stone-700 p-3 flex flex-col gap-3 shadow-lg hover:border-orange-500/50 transition-colors group">
            <UnitCard unit={listing.unit_data} />
            <div className="text-center space-y-1">
                <p className="text-xs text-stone-400 font-rust">SELLER: <span className="text-stone-300">@{listing.seller_username}</span></p>
                <div className="flex items-center justify-center gap-2 bg-stone-950/50 py-1 rounded border border-stone-800">
                    <img src={BALANCE_ICON} alt="Souls" className="w-4 h-4 opacity-80" />
                    <p className="font-rust text-lg text-orange-400">{listing.asking_price.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800">
                <span className={`text-[10px] px-2 py-1 font-bold uppercase tracking-wider border ${listing.status === 'active' ? 'text-green-500 border-green-900/50 bg-green-900/10' :
                    listing.status === 'completed' ? 'text-stone-400 border-stone-700' :
                        'text-yellow-500 border-yellow-900/50 bg-yellow-900/10'
                    }`}>
                    {listing.status.toUpperCase()}
                </span>
                {isOwner ? (
                    <button
                        className="bg-stone-800 hover:bg-red-900/30 text-stone-300 hover:text-red-400 border border-stone-700 hover:border-red-500/50 text-xs px-3 py-1 font-rust uppercase transition-all"
                        onClick={handleCancel}
                        disabled={isProcessing}
                    >
                        {isProcessing ? '...' : 'CANCEL'}
                    </button>
                ) : (
                    <div className="flex gap-2">
                        {onMakeOffer && (
                            <button
                                className="bg-blue-600 hover:bg-blue-500 text-black font-bold text-xs px-3 py-1 uppercase tracking-wider transition-all"
                                onClick={() => onMakeOffer(listing)}
                                disabled={isProcessing}
                            >
                                OFFER
                            </button>
                        )}
                        <button
                            className="bg-orange-600 hover:bg-orange-500 text-black font-bold text-xs px-4 py-1 uppercase tracking-wider shadow-[0_0_10px_rgba(234,88,12,0.3)] hover:shadow-[0_0_15px_rgba(234,88,12,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleBuy}
                            disabled={!game || game.balance < listing.asking_price || isProcessing}
                        >
                            {isProcessing ? '...' : 'BUY'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingCard;