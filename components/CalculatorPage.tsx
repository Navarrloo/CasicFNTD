import React, { useState, useEffect } from 'react';
import { UNITS, BALANCE_ICON } from './constants';
import { Unit, Rarity } from '../types';
import UnitCard from './shared/UnitCard';
import { supabase } from '../lib/supabase';

interface SelectedUnit {
    unit: Unit;
    count: number;
}

interface CalculatorPageProps {
    isCalculatorAdmin?: boolean;
}

const CalculatorPage: React.FC<CalculatorPageProps> = ({ isCalculatorAdmin = false }) => {
    const [yourOffer, setYourOffer] = useState<SelectedUnit[]>([]);
    const [theirOffer, setTheirOffer] = useState<SelectedUnit[]>([]);
    const [prices, setPrices] = useState<Record<number, number>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSide, setSelectedSide] = useState<'your' | 'their'>('your');

    // Admin state
    const [editMode, setEditMode] = useState(false);
    const [editedPrices, setEditedPrices] = useState<Record<number, number>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Initial prices based on rarity (fallback)
    const getBasePrice = (rarity: Rarity) => {
        switch (rarity) {
            case Rarity.Common: return 10;
            case Rarity.Uncommon: return 50;
            case Rarity.Rare: return 150;
            case Rarity.Epic: return 500;
            case Rarity.Mythic: return 2000;
            case Rarity.Secret: return 10000;
            case Rarity.Nightmare: return 50000;
            case Rarity.Hero: return 100000;
            case Rarity.Legendary: return 500000;
            default: return 0;
        }
    };

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        if (supabase) {
            const { data, error } = await supabase
                .from('unit_prices')
                .select('*');

            if (!error && data) {
                const priceMap: Record<number, number> = {};
                data.forEach((p: any) => {
                    priceMap[p.unit_id] = p.price;
                });
                setPrices(priceMap);
                setEditedPrices(priceMap);
            }
        }
    };

    const handlePriceChange = (unitId: number, newPrice: number) => {
        setEditedPrices(prev => ({ ...prev, [unitId]: newPrice }));
    };

    const savePrices = async () => {
        if (!supabase || !isCalculatorAdmin) return;
        setIsSaving(true);

        const updates = Object.entries(editedPrices).map(([unitId, price]) => ({
            unit_id: parseInt(unitId),
            price: price
        }));

        const { error } = await supabase
            .from('unit_prices')
            .upsert(updates, { onConflict: 'unit_id' });

        if (error) {
            console.error("Failed to save prices", error);
            alert("Failed to save prices");
        } else {
            setPrices(editedPrices);
            setEditMode(false);
            alert("Prices saved successfully!");
        }
        setIsSaving(false);
    };

    const addToOffer = (unit: Unit, side: 'your' | 'their') => {
        const setter = side === 'your' ? setYourOffer : setTheirOffer;
        setter(prev => {
            const existing = prev.find(u => u.unit.id === unit.id);
            if (existing) {
                return prev.map(u => u.unit.id === unit.id ? { ...u, count: u.count + 1 } : u);
            }
            return [...prev, { unit, count: 1 }];
        });
    };

    const removeFromOffer = (unitId: number, side: 'your' | 'their') => {
        const setter = side === 'your' ? setYourOffer : setTheirOffer;
        setter(prev => prev.filter(u => u.unit.id !== unitId));
    };

    const updateCount = (unitId: number, delta: number, side: 'your' | 'their') => {
        const setter = side === 'your' ? setYourOffer : setTheirOffer;
        setter(prev => prev.map(u => {
            if (u.unit.id === unitId) {
                const newCount = Math.max(1, u.count + delta);
                return { ...u, count: newCount };
            }
            return u;
        }));
    };

    const getTotalValue = (offer: SelectedUnit[]) => {
        return offer.reduce((total, item) => {
            const price = prices[item.unit.id] || getBasePrice(item.unit.rarity);
            return total + (price * item.count);
        }, 0);
    };

    const yourTotal = getTotalValue(yourOffer);
    const theirTotal = getTotalValue(theirOffer);
    const difference = theirTotal - yourTotal;
    const percentDiff = yourTotal > 0 ? (difference / yourTotal) * 100 : 0;

    let verdict: 'WIN' | 'FAIR' | 'LOSE' = 'FAIR';
    let verdictColor = 'text-yellow-500';
    if (percentDiff > 10) {
        verdict = 'WIN';
        verdictColor = 'text-green-500';
    } else if (percentDiff < -10) {
        verdict = 'LOSE';
        verdictColor = 'text-red-500';
    }

    const filteredUnits = UNITS.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderOfferList = (offer: SelectedUnit[], side: 'your' | 'their', title: string) => (
        <div className="flex-1 flex flex-col bg-stone-900/50 border border-stone-800 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-stone-800 bg-stone-900">
                <div className="flex justify-between items-center">
                    <span className="font-rust text-orange-500 uppercase">{title}</span>
                    <span className="font-rust text-xl text-white">{getTotalValue(offer).toLocaleString()}</span>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-3 custom-scrollbar">
                {offer.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-stone-600 font-rust text-sm">
                        ДОБАВЬТЕ ЮНИТЫ
                    </div>
                ) : (
                    <div className="space-y-2">
                        {offer.map(({ unit, count }) => (
                            <div key={unit.id} className="flex items-center bg-stone-950 p-2 rounded border border-stone-800">
                                <img src={unit.image} alt={unit.name} className="w-10 h-10 object-contain mr-2" />
                                <div className="flex-grow min-w-0">
                                    <div className="font-rust text-xs text-white truncate">{unit.name}</div>
                                    <div className="text-xs text-orange-400 flex items-center gap-1">
                                        <img src={BALANCE_ICON} alt="Souls" className="w-3 h-3" />
                                        {(prices[unit.id] || getBasePrice(unit.rarity)).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mr-2">
                                    <button
                                        onClick={() => updateCount(unit.id, -1, side)}
                                        className="w-5 h-5 bg-stone-800 text-stone-400 rounded hover:bg-stone-700 text-xs"
                                    >
                                        -
                                    </button>
                                    <span className="font-rust w-4 text-center text-xs">{count}</span>
                                    <button
                                        onClick={() => updateCount(unit.id, 1, side)}
                                        className="w-5 h-5 bg-stone-800 text-stone-400 rounded hover:bg-stone-700 text-xs"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFromOffer(unit.id, side)}
                                    className="text-red-500 hover:text-red-400 text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-stone-800">
                <button
                    onClick={() => side === 'your' ? setYourOffer([]) : setTheirOffer([])}
                    className="w-full py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-400 font-rust rounded transition-colors text-sm"
                >
                    ОЧИСТИТЬ
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col p-4 overflow-hidden">
            <div className="flex-shrink-0 mb-4 text-center relative">
                <h1 className="text-4xl font-rust text-orange-500 mb-2 tracking-tighter">КАЛЬКУЛЯТОР W/F/L</h1>
                <p className="text-stone-500 font-rust text-sm uppercase">WIN · FAIR · LOSE</p>

                {isCalculatorAdmin && (
                    <div className="absolute right-0 top-0">
                        {editMode ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={savePrices}
                                    disabled={isSaving}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded font-rust text-xs"
                                >
                                    {isSaving ? 'SAVING...' : 'SAVE PRICES'}
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-rust text-xs"
                                >
                                    CANCEL
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-orange-500 border border-orange-500/50 rounded font-rust text-xs"
                            >
                                EDIT PRICES
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Verdict Display */}
            <div className="flex-shrink-0 mb-4 bg-stone-900/50 border border-stone-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                        <div className="text-stone-400 font-rust text-xs mb-1">ВЫ ОТДАЕТЕ</div>
                        <div className="font-rust text-2xl text-orange-500">{yourTotal.toLocaleString()}</div>
                    </div>
                    <div className="text-center flex-1">
                        <div className={`font-rust text-5xl ${verdictColor} animate-pulse`}>{verdict}</div>
                        <div className="text-stone-400 text-sm mt-1">
                            {percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%
                        </div>
                    </div>
                    <div className="text-center flex-1">
                        <div className="text-stone-400 font-rust text-xs mb-1">ВЫ ПОЛУЧАЕТЕ</div>
                        <div className="font-rust text-2xl text-green-500">{theirTotal.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex gap-4 min-h-0">
                {/* Left: Unit Selector */}
                <div className="w-1/3 flex flex-col bg-stone-900/50 border border-stone-800 rounded-lg overflow-hidden">
                    <div className="p-3 border-b border-stone-800">
                        <input
                            type="text"
                            placeholder="ПОИСК ЮНИТОВ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-white font-rust text-xs focus:border-orange-500 outline-none"
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => setSelectedSide('your')}
                                className={`flex-1 py-1.5 rounded font-rust text-xs ${selectedSide === 'your' ? 'bg-orange-600 text-white' : 'bg-stone-800 text-stone-400'}`}
                            >
                                → ВАШ СПИСОК
                            </button>
                            <button
                                onClick={() => setSelectedSide('their')}
                                className={`flex-1 py-1.5 rounded font-rust text-xs ${selectedSide === 'their' ? 'bg-green-600 text-white' : 'bg-stone-800 text-stone-400'}`}
                            >
                                → ИХ СПИСОК
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto p-3 grid grid-cols-2 gap-2 custom-scrollbar">
                        {filteredUnits.map(unit => (
                            <div
                                key={unit.id}
                                onClick={() => !editMode && addToOffer(unit, selectedSide)}
                                className={`cursor-pointer transform transition-transform ${!editMode ? 'hover:scale-105' : ''}`}
                            >
                                <UnitCard unit={unit} />
                                <div className="mt-1 text-center">
                                    {editMode ? (
                                        <input
                                            type="number"
                                            value={editedPrices[unit.id] || prices[unit.id] || getBasePrice(unit.rarity)}
                                            onChange={(e) => handlePriceChange(unit.id, parseInt(e.target.value) || 0)}
                                            className="w-full bg-black border border-orange-500 text-white text-xs text-center p-1 rounded"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <span className="text-xs font-rust text-orange-400">
                                            {(prices[unit.id] || getBasePrice(unit.rarity)).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle & Right: Your Offer and Their Offer */}
                <div className="flex-1 flex gap-4">
                    {renderOfferList(yourOffer, 'your', 'ВАШЕ ПРЕДЛОЖЕНИЕ')}
                    {renderOfferList(theirOffer, 'their', 'ИХ ПРЕДЛОЖЕНИЕ')}
                </div>
            </div>
        </div>
    );
};

export default CalculatorPage;
