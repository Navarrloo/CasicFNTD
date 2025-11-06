import React, { useState, useEffect, useContext, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { GameContext } from '../../App';
import { Listing, Rarity } from '../../types';
import ListingCard from './ListingCard';
import CreateListingModal from './CreateListingModal';
import FiltersBar from './FiltersBar';
import { useRealtimeListings } from '../../hooks/useRealtimeListings';

type TradeTab = 'market' | 'my_listings';

const TradePage: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TradeTab>('market');
    const [search, setSearch] = useState<string>('');
    const [rarity, setRarity] = useState<Rarity | 'All'>('All');
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [sort, setSort] = useState<'date_desc' | 'price_asc' | 'price_desc'>('date_desc');
    const [page, setPage] = useState<number>(1);
    const pageSize = 24;
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

    useRealtimeListings(supabase, fetchListings);

    const resetFilters = () => {
        setSearch('');
        setRarity('All');
        setMinPrice('');
        setMaxPrice('');
        setSort('date_desc');
        setPage(1);
    };

    useEffect(() => {
        setPage(1);
    }, [search, rarity, minPrice, maxPrice, sort, activeTab]);

    const TabButton: React.FC<{label: string, tabName: TradeTab}> = ({ label, tabName }) => (
      <button 
        onClick={() => setActiveTab(tabName)}
        className={`stats-tab ${activeTab === tabName ? 'active' : ''}`}
      >
        {label}
      </button>
    );

    const myListings = useMemo(() => listings.filter(l => l.seller_id === game?.userProfile?.id), [listings, game?.userProfile?.id]);
    const marketListings = useMemo(() => listings.filter(l => l.seller_id !== game?.userProfile?.id), [listings, game?.userProfile?.id]);

    const filteredSortedPaged = useMemo(() => {
        const source = activeTab === 'market' ? marketListings : myListings;
        const searchLower = search.trim().toLowerCase();
        let result = source.filter(l => {
            const matchesName = searchLower === '' || l.unit_data.name.toLowerCase().includes(searchLower);
            const matchesRarity = rarity === 'All' || l.unit_data.rarity === rarity;
            const priceOkMin = minPrice === '' || l.asking_price >= minPrice;
            const priceOkMax = maxPrice === '' || l.asking_price <= maxPrice;
            return matchesName && matchesRarity && priceOkMin && priceOkMax;
        });
        if (sort === 'date_desc') {
            result = result.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (sort === 'price_asc') {
            result = result.slice().sort((a, b) => a.asking_price - b.asking_price);
        } else if (sort === 'price_desc') {
            result = result.slice().sort((a, b) => b.asking_price - a.asking_price);
        }
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const pageItems = result.slice(start, end);
        return { items: pageItems, total: result.length };
    }, [marketListings, myListings, activeTab, search, rarity, minPrice, maxPrice, sort, page]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-glow-cyan animate-pulse text-xl">LOADING MARKETPLACE...</p>
                </div>
            );
        }

        const listingsToDisplay = filteredSortedPaged.items;

        if (filteredSortedPaged.total === 0) {
            return (
                <div className="flex-grow flex items-center justify-center text-center py-10 px-4 bg-black/20 border-2 border-dashed border-border-dark">
                    <div>
                        <p className="text-text-dark font-pixel text-sm">
                            {activeTab === 'market' ? 'No units matching filters.' : 'No listings matching filters.'}
                        </p>
                        <p className="text-text-dark/50 mt-2 text-sm">
                            Try changing filters or reset them.
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
                {filteredSortedPaged.total > page * pageSize && (
                    <div className="mt-3 flex justify-center">
                        <button className="btn btn-yellow" onClick={() => setPage(p => p + 1)}>Load more</button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="p-4 animate-fadeIn h-full flex flex-col">
                <div className="container-glow flex flex-col flex-grow">
                    <div className="flex-shrink-0 p-4 border-b-2 border-border-light">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="font-pixel text-3xl text-glow-cyan">MARKETPLACE</h1>
                            <button className="btn btn-green" onClick={() => setIsModalOpen(true)}>
                                Create Listing
                            </button>
                        </div>
                        <div className="flex gap-2">
                           <TabButton label="Market" tabName="market" />
                           <TabButton label="My Listings" tabName="my_listings" />
                        </div>
                        <div className="mt-3">
                            <FiltersBar 
                                search={search}
                                setSearch={setSearch}
                                rarity={rarity}
                                setRarity={setRarity}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                setMinPrice={setMinPrice}
                                setMaxPrice={setMaxPrice}
                                sort={sort}
                                setSort={setSort}
                                onReset={resetFilters}
                            />
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
