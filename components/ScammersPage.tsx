import React, { useState, useEffect } from 'react';
import { Scammer } from '../types';
import { getScammers } from '../utils/scammers';
import ScammerCard from './scammers/ScammerCard';
import ScammerDetailModal from './scammers/ScammerDetailModal';
import AddScammerModal from './scammers/AddScammerModal';
import ReportScammerModal from './scammers/ReportScammerModal';

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
    <div className="h-full overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-800 to-black pb-24 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-pixel font-bold text-white mb-2">
              🛡️ Список скамеров
            </h1>
            <p className="text-gray-400 font-pixel text-sm">
              База данных подтвержденных скамеров
            </p>
          </div>
          <div className="flex gap-3">
            {!isAdmin && (
              <button
                onClick={() => setShowReportModal(true)}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-pixel uppercase rounded-lg transition-colors shadow-lg shadow-yellow-500/30"
              >
                ⚠️ Пожаловаться
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-pixel uppercase rounded-lg transition-colors shadow-lg shadow-red-500/30"
              >
                + Добавить
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            placeholder="Поиск по Roblox или Telegram username..."
            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 font-pixel">Статус:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 font-pixel text-sm rounded-lg transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setStatusFilter('verified')}
                className={`px-4 py-2 font-pixel text-sm rounded-lg transition-colors ${
                  statusFilter === 'verified'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white'
                }`}
              >
                Подтвержден
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 font-pixel text-sm rounded-lg transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white'
                }`}
              >
                На проверке
              </button>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-400 font-pixel">Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white font-pixel text-sm focus:border-red-500/50 focus:outline-none transition-colors"
            >
              <option value="newest">Новые</option>
              <option value="oldest">Старые</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 rounded-lg p-4">
            <div className="text-3xl font-pixel font-bold text-red-400 mb-1">
              {scammers.length}
            </div>
            <div className="text-xs text-gray-400 font-pixel uppercase">
              Всего записей
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 rounded-lg p-4">
            <div className="text-3xl font-pixel font-bold text-red-400 mb-1">
              {scammers.filter(s => s.status === 'verified').length}
            </div>
            <div className="text-xs text-gray-400 font-pixel uppercase">
              Подтверждено
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-3xl font-pixel font-bold text-yellow-400 mb-1">
              {scammers.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-400 font-pixel uppercase">
              На проверке
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-red-500 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-gray-400 font-pixel">Загрузка...</p>
            </div>
          </div>
        ) : filteredScammers.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-20 h-20 mx-auto mb-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-400 font-pixel text-lg mb-2">
              Ничего не найдено
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? 'Попробуйте изменить поисковый запрос'
                : 'Скамеров пока нет в базе данных'}
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
    </div>
  );
};

export default ScammersPage;

