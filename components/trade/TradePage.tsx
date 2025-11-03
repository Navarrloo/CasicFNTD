import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../lib/supabase';
import { GameContext } from '../../App';
import { Listing } from '../../types';
import ListingCard from './ListingCard';
import CreateListingModal from './CreateListingModal';

type TradeTab = 'market' | 'my_listings';

const TradePage: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TradeTab>('market');
    const game = useContext(GameContext);

    const fetchListings = async () => {
        setIsLoading(true);
        if (!supabase) return;

        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching listings:', error);
            game?.showToast('Error fetching market data', 'error');
        } else {
            setListings(data as Listing[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const TabButton: React.FC<{label: string, tabName: TradeTab}> = ({ label, tabName }) => (
      <button 
        onClick={() => setActiveTab(tabName)}
        className={`stats-tab ${activeTab === tabName ? 'active' : ''}`}
      >
        {label}
      </button>
    );

    const myListings = listings.filter(l => l.seller_id === game?.userProfile?.id);
    const marketListings = listings.filter(l => l.seller_id !== game?.userProfile?.id);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-glow-cyan animate-pulse text-xl">LOADING MARKETPLACE...</p>
                </div>
            );
        }

        const listingsToDisplay = activeTab === 'market' ? marketListings : myListings;

        if (listingsToDisplay.length === 0) {
            return (
                <div className="flex-grow flex items-center justify-center text-center py-10 px-4 bg-black/20 border-2 border-dashed border-border-dark">
                    <div>
                        <p className="text-text-dark font-pixel text-sm">
                            {activeTab === 'market' ? 'No units for sale right now.' : 'You have no active listings.'}
                        </p>
                        <p className="text-text-dark/50 mt-2 text-sm">
                            {activeTab === 'market' ? 'Check back later!' : 'Create a listing to sell a unit.'}
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex-grow overflow-y-auto pr-2 min-h-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                    {listingsToDisplay.map(listing => (
                        <ListingCard key={listing.id} listing={listing} onAction={fetchListings} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="p-2 animate-fadeIn h-full flex flex-col">
                <div className="container-glow flex flex-col flex-grow">
                    <div className="flex-shrink-0 p-2 border-b-2 border-border-dark">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="font-pixel text-2xl text-glow-cyan">Marketplace</h1>
                            <button className="btn btn-green" onClick={() => setIsModalOpen(true)}>
                                Create Listing
                            </button>
                        </div>
                        <div className="flex gap-2">
                           <TabButton label="Market" tabName="market" />
                           <TabButton label="My Listings" tabName="my_listings" />
                        </div>
                    </div>
                    
                    {renderContent()}

                </div>
            </div>
            <CreateListingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onListingCreated={fetchListings}
            />
        </>
    );
};

export default TradePage;
