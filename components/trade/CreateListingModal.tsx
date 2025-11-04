import React, { useState, useContext } from 'react';
import { Unit } from '../../types';
import { GameContext } from '../../App';
import UnitCard from '../shared/UnitCard';
import { BALANCE_ICON } from '../constants';
import { supabase } from '../../lib/supabase';

interface CreateListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onListingCreated: () => void;
}

const CreateListingModal: React.FC<CreateListingModalProps> = ({ isOpen, onClose, onListingCreated }) => {
    const game = useContext(GameContext);
    const [selectedUnit, setSelectedUnit] = useState<{unit: Unit, index: number} | null>(null);
    const [price, setPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    const resetState = () => {
        setSelectedUnit(null);
        setPrice(0);
        setIsLoading(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleCreateListing = async () => {
        if (!game || !game.userProfile || !selectedUnit || price <= 0 || !supabase) {
            game?.showToast('Invalid unit or price.', 'error');
            return;
        }
        setIsLoading(true);

        // 1. Create listing in DB first for safety
        const { error } = await supabase
            .from('listings')
            .insert({
                seller_id: game.userProfile.id,
                seller_username: game.userProfile.username,
                unit_data: selectedUnit.unit,
                asking_price: price,
                status: 'active', // Explicitly set status to make it visible on the market
            });
        
        if (error) {
            console.error("Error creating listing:", error);
            game.showToast('Failed to create listing.', 'error');
            setIsLoading(false);
        } else {
            // 2. On success, remove unit from inventory
            await game.removeFromInventory(selectedUnit.unit, selectedUnit.index);
            game.showToast('Listing created successfully!', 'success');
            game.unlockAchievement('first_trade');
            onListingCreated();
            handleClose(); // This also sets isLoading to false
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4" onClick={handleClose}>
            <div className="modal-content w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-pixel text-xl text-glow-cyan">Create a Listing</h2>
                    <button onClick={handleClose} className="btn !p-2 !border-none text-glow-red text-2xl">X</button>
                </div>

                <div>
                    <h3 className="font-pixel text-lg text-glow-green mb-2">1. Select a Unit</h3>
                    {game && game.inventory.length > 0 ? (
                        <div className="h-48 overflow-y-auto bg-black/20 p-2 border border-border-dark grid grid-cols-4 gap-2">
                           {game.inventory.map((unit, index) => (
                                <UnitCard 
                                    key={`${unit.id}-${index}`}
                                    unit={unit}
                                    onClick={() => setSelectedUnit({unit, index})}
                                    isSelected={selectedUnit?.index === index}
                                />
                           ))}
                        </div>
                    ) : (
                        <p className="text-text-dark text-center py-8">Your inventory is empty.</p>
                    )}
                </div>

                <div className="my-4">
                    <h3 className="font-pixel text-lg text-glow-green mb-2">2. Set Price</h3>
                     <div className="flex items-center gap-2 bg-black/20 p-2 border border-border-dark">
                        <img src={BALANCE_ICON} alt="Souls" className="w-6 h-6" />
                        <input 
                            type="number"
                            className="admin-input flex-grow text-2xl"
                            placeholder="0"
                            value={price || ''}
                            onChange={e => setPrice(parseInt(e.target.value) || 0)}
                        />
                     </div>
                </div>

                 <button 
                    className="btn btn-green w-full"
                    disabled={!selectedUnit || price <= 0 || isLoading}
                    onClick={handleCreateListing}
                 >
                    {isLoading ? 'CREATING...' : 'Create Listing'}
                 </button>
            </div>
        </div>
    );
};

export default CreateListingModal;