import React from 'react';
import { Rarity } from '../../types';

interface FiltersBarProps {
    search: string;
    setSearch: (v: string) => void;
    rarity: Rarity | 'All';
    setRarity: (v: Rarity | 'All') => void;
    minPrice: number | '';
    maxPrice: number | '';
    setMinPrice: (v: number | '') => void;
    setMaxPrice: (v: number | '') => void;
    sort: 'date_desc' | 'price_asc' | 'price_desc';
    setSort: (v: 'date_desc' | 'price_asc' | 'price_desc') => void;
    onReset: () => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ search, setSearch, rarity, setRarity, minPrice, maxPrice, setMinPrice, setMaxPrice, sort, setSort, onReset }) => {
    const inputClass = "w-full bg-stone-950 border border-stone-700 text-stone-300 px-3 py-2 text-sm font-rust focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-stone-600 transition-all";

    return (
        <div className="bg-stone-900/50 border border-stone-800 p-3 flex flex-col gap-3 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="SEARCH UNIT..."
                    className={inputClass}
                />

                <select
                    value={rarity}
                    onChange={e => setRarity((e.target.value as Rarity | 'All'))}
                    className={inputClass}
                >
                    <option value={'All'}>ALL RARITIES</option>
                    {Object.values(Rarity).map(r => (
                        <option key={r} value={r}>{r.toUpperCase()}</option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        placeholder="MIN"
                        value={minPrice === '' ? '' : String(minPrice)}
                        onChange={e => setMinPrice(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                        className={inputClass}
                    />
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        placeholder="MAX"
                        value={maxPrice === '' ? '' : String(maxPrice)}
                        onChange={e => setMaxPrice(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                        className={inputClass}
                    />
                </div>

                <select
                    value={sort}
                    onChange={e => setSort(e.target.value as any)}
                    className={inputClass}
                >
                    <option value="date_desc">NEWEST</option>
                    <option value="price_asc">PRICE ↑</option>
                    <option value="price_desc">PRICE ↓</option>
                </select>

                <button
                    className="bg-stone-700 hover:bg-stone-600 text-stone-200 font-rust text-sm px-4 py-2 border border-stone-600 hover:border-stone-500 transition-all uppercase tracking-wider"
                    onClick={onReset}
                >
                    RESET
                </button>
            </div>
        </div>
    );
};

export default FiltersBar;


