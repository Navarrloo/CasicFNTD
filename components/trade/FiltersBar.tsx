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
    return (
        <div className="bg-black/20 border border-border-dark p-2 flex flex-col gap-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search name"
                    className="admin-input"
                />

                <select
                    value={rarity}
                    onChange={e => setRarity((e.target.value as Rarity | 'All'))}
                    className="admin-input"
                >
                    <option value={'All'}>All rarities</option>
                    {Object.values(Rarity).map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        placeholder="Min"
                        value={minPrice === '' ? '' : String(minPrice)}
                        onChange={e => setMinPrice(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                        className="admin-input w-1/2"
                    />
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        placeholder="Max"
                        value={maxPrice === '' ? '' : String(maxPrice)}
                        onChange={e => setMaxPrice(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                        className="admin-input w-1/2"
                    />
                </div>

                <select
                    value={sort}
                    onChange={e => setSort(e.target.value as any)}
                    className="admin-input"
                >
                    <option value="date_desc">Newest</option>
                    <option value="price_asc">Price ↑</option>
                    <option value="price_desc">Price ↓</option>
                </select>

                <button className="btn btn-yellow" onClick={onReset}>Reset</button>
            </div>
        </div>
    );
};

export default FiltersBar;


