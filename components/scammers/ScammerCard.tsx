import React from 'react';
import { Scammer } from '../../types';

interface ScammerCardProps {
  scammer: Scammer;
  onClick: () => void;
}

const ScammerCard: React.FC<ScammerCardProps> = ({ scammer, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = () => {
    if (scammer.status === 'verified') {
      return (
        <span className="px-3 py-1 text-xs font-pixel uppercase bg-red-500/20 text-red-400 border border-red-500/40 rounded-md">
          ✓ Подтвержден
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-pixel uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded-md">
        На проверке
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm border-2 border-red-500/30 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/20 hover:scale-[1.02]"
      style={{
        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.15)'
      }}
    >
      {/* Header with status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-pixel font-bold text-white mb-1">
            {scammer.roblox_username}
          </h3>
          <div className="text-sm text-gray-400 font-pixel">
            Roblox Username
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Telegram Info */}
      {(scammer.telegram_nickname || scammer.telegram_username) && (
        <div className="mb-3 space-y-1">
          {scammer.telegram_nickname && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              <span className="text-sm text-gray-300">{scammer.telegram_nickname}</span>
            </div>
          )}
          {scammer.telegram_username && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              <span className="text-sm text-blue-400">@{scammer.telegram_username}</span>
            </div>
          )}
        </div>
      )}

      {/* Reason */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 font-pixel uppercase mb-1">Причина</div>
        <p className="text-sm text-gray-200 line-clamp-2">{scammer.reason}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
        <div className="flex items-center gap-2">
          {scammer.proof_images && scammer.proof_images.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{scammer.proof_images.length}</span>
            </div>
          )}
          {scammer.damage_amount && (
            <div className="flex items-center gap-1 text-xs text-red-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{scammer.damage_amount.toLocaleString()}</span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 font-pixel">
          {formatDate(scammer.created_at)}
        </div>
      </div>
    </div>
  );
};

export default ScammerCard;

