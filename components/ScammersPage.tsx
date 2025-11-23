import React, { useState, useEffect } from 'react';
import { Scammer } from '../types';
import { getScammers } from '../utils/scammers';
import ScammerCard from './scammers/ScammerCard';
import ScammerDetailModal from './scammers/ScammerDetailModal';
import AddScammerModal from './scammers/AddScammerModal';
import ReportScammerModal from './scammers/ReportScammerModal';

import CheckScammerModal from './scammers/CheckScammerModal';

interface ScammersPageProps {
  userId: number;
  isAdmin: boolean;
}

const ScammersPage: React.FC<ScammersPageProps> = ({ userId, isAdmin }) => {
  const [scammers, setScammers] = useState<Scammer[]>([]);
  const [filteredScammers, setFilteredScammers] = useState<Scammer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedScammer, setSelectedScammer] = useState<Scammer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);

  // Load scammers
  const loadScammers = async () => {
    setIsLoading(true);
    try {
      const data = await getScammers({ status: statusFilter, sortBy });
      setScammers(data);
      setFilteredScammers(data);
    } catch (error) {
      console.error('Error loading scammers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadScammers();
  }, [statusFilter, sortBy]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredScammers(scammers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = scammers.filter(
        scammer =>
          scammer.roblox_username.toLowerCase().includes(query) ||
          scammer.telegram_username?.toLowerCase().includes(query) ||
          scammer.telegram_nickname?.toLowerCase().includes(query)
      );
      setFilteredScammers(filtered);
    }
  }, [searchQuery, scammers]);

  const handleAddSuccess = () => {
    loadScammers();
  };

  const handleDeleteSuccess = () => {
    loadScammers();
    setSelectedScammer(null);
  };

  return (
    <div className="h-full overflow-y-auto bg-stone-950/80 pb-24 px-4 custom-scrollbar">
      {/* Header */}
      <div className="max-w-6xl mx-auto pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-rust font-bold text-orange-500 mb-2 tracking-tighter">
              БАЗА СКАМЕРОВ
            </h1>
            <p className="text-stone-400 font-rust text-sm uppercase">
              ПРОВЕРЕННЫЙ СПИСОК ИЗВЕСТНЫХ СКАМЕРОВ
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCheckModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold font-rust uppercase rounded-sm transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ПРОВЕРИТЬ
            </button>
            {!isAdmin && (
              <button
                onClick={() => setShowReportModal(true)}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-black font-bold font-rust uppercase rounded-sm transition-colors shadow-lg shadow-yellow-900/20"
              >
                ⚠️ ПОЖАЛОВАТЬСЯ
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold font-rust uppercase rounded-sm transition-colors shadow-lg shadow-red-900/20"
              >
                + ДОБАВИТЬ
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ПОИСК ПО ROBLOX ИЛИ TELEGRAM..."
            className="w-full pl-12 pr-4 py-4 bg-stone-900/50 border border-stone-700 rounded-sm text-stone-200 placeholder-stone-600 focus:border-orange-500 focus:outline-none transition-colors font-rust text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500 font-rust uppercase">СТАТУС:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 font-rust text-sm rounded-sm transition-colors uppercase ${statusFilter === 'all'
                  ? 'bg-stone-700 text-white border border-stone-500'
                  : 'bg-stone-900/50 text-stone-500 border border-stone-800 hover:text-stone-300'
                  }`}
              >
                ВСЕ
              </button>
              <button
                onClick={() => setStatusFilter('verified')}
                className={`px-4 py-2 font-rust text-sm rounded-sm transition-colors uppercase ${statusFilter === 'verified'
                  ? 'bg-red-900/50 text-red-400 border border-red-500/50'
                  : 'bg-stone-900/50 text-stone-500 border border-stone-800 hover:text-stone-300'
                  }`}
              >
                ПОДТВЕРЖДЕНО
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 font-rust text-sm rounded-sm transition-colors uppercase ${statusFilter === 'pending'
                  ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/50'
                  : 'bg-stone-900/50 text-stone-500 border border-stone-800 hover:text-stone-300'
                  }`}
              >
                НА ПРОВЕРКЕ
              </button>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-stone-500 font-rust uppercase">СОРТИРОВКА:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-4 py-2 bg-stone-900/50 border border-stone-700 rounded-sm text-stone-300 font-rust text-sm focus:border-orange-500 focus:outline-none transition-colors uppercase"
            >
              <option value="newest">НОВЫЕ</option>
              <option value="oldest">СТАРЫЕ</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-stone-900/50 border border-stone-700 rounded-sm p-4">
            <div className="text-3xl font-rust font-bold text-stone-200 mb-1">
              {scammers.length}
            </div>
            <div className="text-xs text-stone-500 font-rust uppercase tracking-wider">
              ВСЕГО ЗАПИСЕЙ
            </div>
          </div>
          <div className="bg-red-900/10 border border-red-900/30 rounded-sm p-4">
            <div className="text-3xl font-rust font-bold text-red-500 mb-1">
              {scammers.filter(s => s.status === 'verified').length}
            </div>
            <div className="text-xs text-red-400/70 font-rust uppercase tracking-wider">
              ПОДТВЕРЖДЕНО
            </div>
          </div>
          <div className="bg-yellow-900/10 border border-yellow-900/30 rounded-sm p-4">
            <div className="text-3xl font-rust font-bold text-yellow-500 mb-1">
              {scammers.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-xs text-yellow-400/70 font-rust uppercase tracking-wider">
              НА ПРОВЕРКЕ
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-orange-500 font-rust animate-pulse">ЗАГРУЗКА БАЗЫ...</p>
            </div>
          </div>
        ) : filteredScammers.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-stone-800 rounded-lg bg-stone-900/20">
            <p className="text-stone-500 font-rust text-lg mb-2 uppercase">
              ЗАПИСЕЙ НЕ НАЙДЕНО
            </p>
            <p className="text-stone-600 text-sm font-rust">
              {searchQuery
                ? 'ПОПРОБУЙТЕ ДРУГОЙ ЗАПРОС'
                : 'БАЗА ДАННЫХ ПУСТА'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScammers.map((scammer) => (
              <ScammerCard
                key={scammer.id}
                scammer={scammer}
                onClick={() => setSelectedScammer(scammer)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedScammer && (
        <ScammerDetailModal
          scammer={selectedScammer}
          isAdmin={isAdmin}
          onClose={() => setSelectedScammer(null)}
          onDelete={handleDeleteSuccess}
          onUpdate={loadScammers}
        />
      )}

      {/* Add Modal (Admin) */}
      {showAddModal && (
        <AddScammerModal
          userId={userId}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* Report Modal (Users) */}
      {showReportModal && (
        <ReportScammerModal
          userId={userId}
          onClose={() => setShowReportModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* Check Modal */}
      {showCheckModal && (
        <CheckScammerModal
          onClose={() => setShowCheckModal(false)}
        />
      )}
    </div>
  );
};

export default ScammersPage;

