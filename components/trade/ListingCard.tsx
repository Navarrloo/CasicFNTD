import React, { useContext } from 'react';
import { Listing } from '../../types';
import { GameContext } from '../../App';
import UnitCard from '../shared/UnitCard';
import { BALANCE_ICON } from '../../constants';
import { supabase } from '../../lib/supabase';

interface ListingCardProps {
    listing: Listing;
    onAction: () => void; // Callback to refresh listings
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onAction }) => {
    const game = useContext(GameContext);
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

        const { error } = await supabase.rpc('buy_listing', {
            listing_id_to_buy: listing.id,
            buyer_user_id: game.userProfile.id
        });

        if (error) {
            console.error("Error buying item:", error);
            game.showToast(error.message, 'error');
            onAction(); // Refresh listings to remove the stale one
        } else {
            game.showToast('Purchase successful! Refreshing...', 'success');
            // The database is now the source of truth. Reload the app to get the
            // latest profile state (balance, inventory) safely.
            setTimeout(() => window.location.reload(), 1500);
        }
    };

    const handleCancel = async () => {
        if (!game || !game.userProfile || !supabase) return;
        if (!window.confirm('Are you sure you want to cancel this listing? The unit will be returned to your inventory.')) return;
        
        const { error } = await supabase.rpc('cancel_listing', {
            listing_id_to_cancel: listing.id,
            seller_user_id: game.userProfile.id
        });

        if (error) {
            console.error("Error cancelling listing:", error);
            game.showToast(error.message, 'error');
            onAction(); // Refresh on error
        } else {
            game.showToast('Listing cancelled! Refreshing...', 'success');
            // The database is updated. Reload the app to get the correct inventory.
            setTimeout(() => window.location.reload(), 1500);
        }
    };


    return (
        <div className="bg-black/30 border border-border-dark p-2 flex flex-col gap-2">
            <UnitCard unit={listing.unit_data} />
            <div className="text-center">
                <p className="text-xs text-text-dark">Seller: @{listing.seller_username}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <img src={BALANCE_ICON} alt="Souls" className="w-4 h-4" />
                    <p className="font-pixel text-lg text-glow-yellow">{listing.asking_price.toLocaleString()}</p>
                </div>
            </div>
            
            {isOwner ? (
                <button className="btn btn-yellow !text-sm !py-1" onClick={handleCancel}>Cancel</button>
            ) : (
                <button className="btn btn-green !text-sm !py-1" onClick={handleBuy} disabled={!game || game.balance < listing.asking_price}>
                    Buy
                </button>
            )}
        </div>
    );
};

export default ListingCard;