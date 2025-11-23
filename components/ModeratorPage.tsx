import React, { useState, useEffect } from 'react';
import { UNITS } from './constants';
import { supabase } from '../lib/supabase';
import { Rarity } from '../types';

const ModeratorPage: React.FC = () => {
    const [prices, setPrices] = useState<Record<number, number>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');

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
            }
        }
    };

    const handleSave = async (unitId: number) => {
        const newPrice = parseInt(editValue);
        if (isNaN(newPrice) || newPrice < 0) return;

        if (supabase) {
            const { error } = await supabase
                .from('unit_prices')
                .upsert({ unit_id: unitId, price: newPrice });

            if (!error) {
                setPrices(prev => ({ ...prev, [unitId]: newPrice }));
                setEditingId(null);
            } else {
                alert('Failed to save price');
            }
        }
    };

    const startEdit = (unitId: number, currentPrice: number) => {
        setEditingId(unitId);
        setEditValue(currentPrice.toString());
    };

    const filteredUnits = UNITS.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col p-4 overflow-hidden bg-stone-950">
            <div className="flex-shrink-0 mb-6">
                <h1 className="text-3xl font-rust text-blue-500 mb-2 tracking-tighter">MODERATOR PANEL</h1>
                <p className="text-stone-500 font-rust text-sm uppercase">MANAGE UNIT MARKET VALUES</p>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="SEARCH UNITS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md bg-stone-900 border border-stone-700 rounded p-2 text-white font-rust focus:border-blue-500 outline-none"
                />
            </div>

            <div className="flex-grow overflow-y-auto border border-stone-800 rounded-lg bg-stone-900/30 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-stone-900 sticky top-0 z-10">
                        <tr>
                            <th className="p-4 font-rust text-stone-400 border-b border-stone-800">UNIT</th>
                            <th className="p-4 font-rust text-stone-400 border-b border-stone-800">RARITY</th>
                            <th className="p-4 font-rust text-stone-400 border-b border-stone-800 text-right">CURRENT VALUE</th>
                            <th className="p-4 font-rust text-stone-400 border-b border-stone-800 text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUnits.map(unit => {
                            const price = prices[unit.id] || 0;
                            const isEditing = editingId === unit.id;

                            return (
                                <tr key={unit.id} className="border-b border-stone-800 hover:bg-stone-900/50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={unit.image} alt={unit.name} className="w-10 h-10 object-contain" />
                                            <span className="font-bold text-stone-200">{unit.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`
                      px-2 py-1 rounded text-xs font-bold uppercase
                      ${unit.rarity === Rarity.Common ? 'bg-stone-800 text-stone-400' : ''}
                      ${unit.rarity === Rarity.Uncommon ? 'bg-green-900 text-green-400' : ''}
                      ${unit.rarity === Rarity.Rare ? 'bg-blue-900 text-blue-400' : ''}
                      ${unit.rarity === Rarity.Epic ? 'bg-purple-900 text-purple-400' : ''}
                      ${unit.rarity === Rarity.Mythic ? 'bg-red-900 text-red-400' : ''}
                      ${unit.rarity === Rarity.Secret ? 'bg-yellow-900 text-yellow-400' : ''}
                    `}>
                                            {unit.rarity}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono text-lg">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="bg-stone-800 border border-blue-500 rounded px-2 py-1 w-32 text-right text-white outline-none"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="text-orange-400">{price.toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        {isEditing ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleSave(unit.id)}
                                                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded font-rust text-xs"
                                                >
                                                    SAVE
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="bg-stone-700 hover:bg-stone-600 text-stone-300 px-3 py-1 rounded font-rust text-xs"
                                                >
                                                    CANCEL
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => startEdit(unit.id, price)}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded font-rust text-xs"
                                            >
                                                EDIT
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ModeratorPage;
