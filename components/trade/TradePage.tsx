import React, { useState, useEffect, useContext, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { GameContext } from '../../App';
import { Listing, Rarity } from '../../types';
import ListingCard from './ListingCard';
import CreateListingModal from './CreateListingModal';
import FiltersBar from './FiltersBar';
import { useRealtimeListings } from '../../hooks/useRealtimeListings';

import MakeOfferModal from './MakeOfferModal';
import OffersList from './OffersList';

type TradeTab = 'market' | 'my_listings' | 'offers';

const TradePage: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [selectedListingForOffer, setSelectedListingForOffer] = useState<Listing | null>(null);
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

    const handleMakeOffer = (listing: Listing) => {
        setSelectedListingForOffer(listing);
        setIsOfferModalOpen(true);
    };

    const TabButton: React.FC<{ label: string, tabName: TradeTab }> = ({ label, tabName }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-6 py-2 font-rust text-sm uppercase tracking-wider transition-all border-b-2 ${activeTab === tabName
                ? 'text-orange-500 border-orange-500 bg-orange-500/10'
                : 'text-stone-500 border-transparent hover:text-stone-300 hover:border-stone-700'
                }`}
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
        if (activeTab === 'offers') {
            return <OffersList userId={game?.userProfile?.id || 0} />;
        }

        if (isLoading) {
            return (
                <div className="flex-grow flex items-center justify-center">
                    <p className="font-rust text-orange-500 animate-pulse text-xl">ЗАГРУЗКА ДАННЫХ...</p>
                </div>
            );
        }

        const listingsToDisplay = filteredSortedPaged.items;

        if (filteredSortedPaged.total === 0) {
            return (
                <div className="flex-grow flex items-center justify-center text-center py-10 px-4 bg-stone-900/30 border-2 border-dashed border-stone-800 rounded-lg">
                    <div>
                        <p className="text-stone-500 font-rust text-sm uppercase">
                            {activeTab === 'market' ? 'ЮНИТЫ НЕ НАЙДЕНЫ.' : 'НЕТ АКТИВНЫХ ОБЪЯВЛЕНИЙ.'}
                        </p>
                        <p className="text-stone-600 mt-2 text-xs">
                            ПОПРОБУЙТЕ ИЗМЕНИТЬ ФИЛЬТРЫ ИЛИ ЗАЙДИТЕ ПОЗЖЕ.
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex-grow overflow-y-auto pr-2 min-h-0 custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                    {listingsToDisplay.map(listing => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            onAction={fetchListings}
                            onMakeOffer={handleMakeOffer}
                        />
                    ))}
                </div>
                {filteredSortedPaged.total > page * pageSize && (
                    <div className="mt-6 flex justify-center">
                        <button
                            className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-rust px-6 py-2 border border-stone-600 transition-all uppercase tracking-wider text-sm"
                            onClick={() => setPage(p => p + 1)}
                        >
                            ЗАГРУЗИТЬ ЕЩЕ
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="p-4 animate-fadeIn h-full flex flex-col">
                <div className="flex flex-col flex-grow bg-stone-950/50 rounded-lg border border-stone-800 overflow-hidden">
                    <div className="flex-shrink-0 p-4 border-b border-stone-800 bg-stone-900/80">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="font-rust text-3xl text-orange-500 tracking-tighter">ТОРГОВАЯ ПЛОЩАДКА</h1>
                            <button
                                className="bg-orange-600 hover:bg-orange-500 text-black font-bold px-4 py-2 uppercase tracking-wider shadow-lg shadow-orange-900/20 transition-all text-sm flex items-center gap-2"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <span className="text-lg leading-none">+</span> СОЗДАТЬ ОБЪЯВЛЕНИЕ
                            </button>
                        </div>
                        <div className="flex gap-2 mb-4 border-b border-stone-800">
                            <TabButton label="РЫНОК" tabName="market" />
                            <TabButton label="МОИ ОБЪЯВЛЕНИЯ" tabName="my_listings" />
                            <TabButton label="ПРЕДЛОЖЕНИЯ" tabName="offers" />
                        </div>
                        {activeTab !== 'offers' && (
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
                        )}
                    </div>

                    <div className="p-4 flex-grow flex flex-col min-h-0 bg-stone-950/30">
                        {renderContent()}
                    </div>

                </div>
            </div>
            <CreateListingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onListingCreated={fetchListings}
            />
            <MakeOfferModal
                isOpen={isOfferModalOpen}
                onClose={() => setIsOfferModalOpen(false)}
                listing={selectedListingForOffer}
                userBalance={game?.balance || 0}
                userId={game?.userProfile?.id || 0}
                username={game?.userProfile?.username || 'User'}
            />
        </>
    );
};

export default TradePage;
