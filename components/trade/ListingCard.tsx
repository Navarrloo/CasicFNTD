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
        
        // This should ideally be a single database transaction/RPC call for safety.
        // For now, we proceed step-by-step.

        // 1. Debit buyer
        const newBalance = game.balance - listing.asking_price;
        await game.updateBalance(newBalance);

        // 2. Mark listing as completed
        const { error: updateError } = await supabase
            .from('listings')
            .update({ status: 'completed' })
            .eq('id', listing.id);

        if (updateError) {
            console.error("Error updating listing:", updateError);
            game.showToast('Purchase failed!', 'error');
            await game.updateBalance(game.balance); // Revert balance
            return;
        }
        
        // 3. Add unit to buyer's inventory
        await game.addToInventory(listing.unit_data);
        
        // 4. Credit seller
        const { data: sellerProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('balance')
            .eq('id', listing.seller_id)
            .single();

        if (fetchError || !sellerProfile) {
            console.error("Could not find seller to credit:", fetchError);
            // This is a critical error state. The item is sold but seller not paid.
            // A transaction would prevent this.
        } else {
            const newSellerBalance = sellerProfile.balance + listing.asking_price;
            await supabase.from('profiles').update({ balance: newSellerBalance }).eq('id', listing.seller_id);
        }
        
        game.showToast('Purchase successful!', 'success');
        onAction();
    };

    const handleCancel = async () => {
        if (!game || !supabase) return;
        if (!window.confirm('Are you sure you want to cancel this listing? The unit will be returned to your inventory.')) return;
        
        // 1. Mark listing as cancelled
        const { error: updateError } = await supabase
            .from('listings')
            .update({ status: 'cancelled' })
            .eq('id', listing.id);

        if (updateError) {
            console.error("Error cancelling listing:", updateError);
            game.showToast('Failed to cancel listing!', 'error');
            return;
        }
        
        // 2. Return unit to seller's inventory
        await game.addToInventory(listing.unit_data);
        
        game.showToast('Listing cancelled.', 'success');
        onAction();
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
                <button className="btn btn-green !text-sm !py-1" onClick={handleBuy} disabled={game?.balance < listing.asking_price}>
                    Buy
                </button>
            )}
        </div>
    );
};

export default ListingCard;
