import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Unit } from '../../types';

interface Offer {
    id: string;
    listing_id: string;
    buyer_id: number;
    buyer_username: string;
    offer_amount: number;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    listing: {
        id: string;
        unit_data: Unit;
        asking_price: number;
        seller_username: string;
        seller_id: number;
    };
}

interface OffersListProps {
    userId: number;
}

const OffersList: React.FC<OffersListProps> = ({ userId }) => {
    const [sentOffers, setSentOffers] = useState<Offer[]>([]);
    const [receivedOffers, setReceivedOffers] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'received' | 'sent'>('received');

    const fetchOffers = async () => {
        setIsLoading(true);
        if (!supabase) return;

        try {
            // Fetch Sent Offers
            const { data: sentData, error: sentError } = await supabase
                .from('offers')
                .select('*, listing:listings(*)')
                .eq('buyer_id', userId)
                .order('created_at', { ascending: false });

            if (sentError) throw sentError;
            setSentOffers(sentData as any);

            // Fetch Received Offers
            // We need offers where the listing's seller_id is the current user
            const { data: receivedData, error: receivedError } = await supabase
                .from('offers')
                .select('*, listing:listings!inner(*)')
                .eq('listing.seller_id', userId)
                .order('created_at', { ascending: false });

            if (receivedError) throw receivedError;
            setReceivedOffers(receivedData as any);

        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, [userId]);

    const handleAction = async (offerId: string, action: 'accept' | 'reject' | 'cancel') => {
        if (!supabase) return;

        if (action === 'accept') {
            const { error } = await supabase.rpc('accept_offer', {
                offer_id_param: offerId,
                seller_user_id: userId
            });

            if (error) {
                console.error('Error accepting offer:', error);
                alert(`Не удалось принять предложение: ${error.message}`);
                return;
            } else {
                alert('Предложение принято! Юнит передан.');
                fetchOffers();
                return;
            }
        }

        // action cannot be 'accept' here due to early return above
        const newStatus = 'rejected';

        // If cancelling own offer, delete it
        if (action === 'cancel') {
            const { error } = await supabase
                .from('offers')
                .delete()
                .eq('id', offerId);
            if (!error) fetchOffers();
            return;
        }

        // Reject logic (for seller rejecting)
        const { error } = await supabase
            .from('offers')
            .update({ status: newStatus })
            .eq('id', offerId);

        if (!error) {
            fetchOffers();
        }
    };

    const OfferCard = ({ offer, isReceived }: { offer: Offer, isReceived: boolean }) => (
        <div className="bg-stone-900/50 border border-stone-700 rounded-lg p-4 flex items-center justify-between mb-3 hover:border-stone-600 transition-colors">
            <div className="flex items-center gap-4">
                <img src={offer.listing.unit_data.image} alt={offer.listing.unit_data.name} className="w-12 h-12 object-contain" />
                <div>
                    <h3 className="font-rust text-white text-sm">{offer.listing.unit_data.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                        <span>{isReceived ? `От: @${offer.buyer_username}` : `Кому: @${offer.listing.seller_username}`}</span>
                        <span className="w-1 h-1 bg-stone-600 rounded-full"></span>
                        <span>Цена: {offer.listing.asking_price.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className="text-xs text-stone-500 font-rust uppercase">СУММА ПРЕДЛОЖЕНИЯ</div>
                    <div className="text-orange-500 font-rust text-lg">{offer.offer_amount.toLocaleString()} 👻</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${offer.status === 'pending' ? 'bg-yellow-900/20 text-yellow-500 border border-yellow-900/50' :
                        offer.status === 'accepted' ? 'bg-green-900/20 text-green-500 border border-green-900/50' :
                            'bg-red-900/20 text-red-500 border border-red-900/50'
                        }`}>
                        {offer.status === 'pending' ? 'ОЖИДАЕТ' : offer.status === 'accepted' ? 'ПРИНЯТО' : 'ОТКЛОНЕНО'}
                    </span>

                    {offer.status === 'pending' && (
                        <div className="flex gap-2">
                            {isReceived ? (
                                <>
                                    <button
                                        onClick={() => handleAction(offer.id, 'accept')}
                                        className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded font-rust transition-colors"
                                    >
                                        ПРИНЯТЬ
                                    </button>
                                    <button
                                        onClick={() => handleAction(offer.id, 'reject')}
                                        className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded font-rust transition-colors"
                                    >
                                        ОТКЛОНИТЬ
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleAction(offer.id, 'cancel')}
                                    className="bg-stone-700 hover:bg-stone-600 text-stone-300 text-xs px-3 py-1 rounded font-rust transition-colors"
                                >
                                    ОТМЕНИТЬ
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col">
            <div className="flex gap-4 mb-6 border-b border-stone-800 pb-2">
                <button
                    onClick={() => setActiveSection('received')}
                    className={`pb-2 font-rust text-sm uppercase tracking-wider transition-all relative ${activeSection === 'received' ? 'text-orange-500' : 'text-stone-500 hover:text-stone-300'
                        }`}
                >
                    ПОЛУЧЕННЫЕ
                    {receivedOffers.filter(o => o.status === 'pending').length > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                            {receivedOffers.filter(o => o.status === 'pending').length}
                        </span>
                    )}
                    {activeSection === 'received' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></span>}
                </button>
                <button
                    onClick={() => setActiveSection('sent')}
                    className={`pb-2 font-rust text-sm uppercase tracking-wider transition-all relative ${activeSection === 'sent' ? 'text-orange-500' : 'text-stone-500 hover:text-stone-300'
                        }`}
                >
                    ОТПРАВЛЕННЫЕ
                    {activeSection === 'sent' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></span>}
                </button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <p className="font-rust text-orange-500 animate-pulse">ЗАГРУЗКА ПРЕДЛОЖЕНИЙ...</p>
                    </div>
                ) : activeSection === 'received' ? (
                    receivedOffers.length === 0 ? (
                        <div className="text-center py-10 text-stone-500 font-rust">НЕТ ПОЛУЧЕННЫХ ПРЕДЛОЖЕНИЙ</div>
                    ) : (
                        receivedOffers.map(offer => <OfferCard key={offer.id} offer={offer} isReceived={true} />)
                    )
                ) : (
                    sentOffers.length === 0 ? (
                        <div className="text-center py-10 text-stone-500 font-rust">НЕТ ОТПРАВЛЕННЫХ ПРЕДЛОЖЕНИЙ</div>
                    ) : (
                        sentOffers.map(offer => <OfferCard key={offer.id} offer={offer} isReceived={false} />)
                    )
                )}
            </div>
        </div>
    );
};

export default OffersList;
