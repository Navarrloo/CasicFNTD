import React, { useState } from 'react';
import { Scammer } from '../../types';
import { deleteScammer, updateScammer } from '../../utils/scammers';

interface ScammerDetailModalProps {
  scammer: Scammer;
  isAdmin: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onUpdate?: () => void;
}

const ScammerDetailModal: React.FC<ScammerDetailModalProps> = ({ 
  scammer, 
  isAdmin, 
  onClose,
  onDelete,
  onUpdate
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (!isAdmin) return;
    
    setIsDeleting(true);
    try {
      await deleteScammer(scammer.id);
      onDelete?.();
      onClose();
    } catch (error) {
      console.error('Error deleting scammer:', error);
      alert('Ошибка при удалении записи');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleVerify = async () => {
    if (!isAdmin || scammer.status === 'verified') return;
    
    setIsVerifying(true);
    try {
      await updateScammer(scammer.id, { status: 'verified' });
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Error verifying scammer:', error);
      alert('Ошибка при подтверждении записи');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-red-500/40 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 50px rgba(239, 68, 68, 0.3)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-gray-800/80 hover:bg-gray-700 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-pixel font-bold text-white mb-2">
                {scammer.roblox_username}
              </h2>
              <div className="text-sm text-gray-400 font-pixel">
                Roblox Username
              </div>
            </div>
            {scammer.status === 'verified' ? (
              <span className="px-4 py-2 text-sm font-pixel uppercase bg-red-500/20 text-red-400 border border-red-500/40 rounded-lg">
                ✓ Подтвержден
              </span>
            ) : (
              <span className="px-4 py-2 text-sm font-pixel uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded-lg">
                На проверке
              </span>
            )}
          </div>

          {/* Telegram Info */}
          {(scammer.telegram_nickname || scammer.telegram_username) && (
            <div className="space-y-2 bg-gray-800/50 rounded-lg p-4">
              <div className="text-xs text-gray-400 font-pixel uppercase mb-2">
                Telegram
              </div>
              {scammer.telegram_nickname && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                  <span className="text-gray-200">{scammer.telegram_nickname}</span>
                </div>
              )}
              {scammer.telegram_username && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                  <span className="text-blue-400">@{scammer.telegram_username}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Reason */}
          <div>
            <div className="text-sm text-gray-400 font-pixel uppercase mb-2">
              Причина
            </div>
            <p className="text-gray-200 leading-relaxed bg-gray-800/50 rounded-lg p-4">
              {scammer.reason}
            </p>
          </div>

          {/* Description */}
          {scammer.description && (
            <div>
              <div className="text-sm text-gray-400 font-pixel uppercase mb-2">
                Подробное описание
              </div>
              <p className="text-gray-200 leading-relaxed bg-gray-800/50 rounded-lg p-4 whitespace-pre-wrap">
                {scammer.description}
              </p>
            </div>
          )}

          {/* Damage Amount */}
          {scammer.damage_amount && (
            <div>
              <div className="text-sm text-gray-400 font-pixel uppercase mb-2">
                Сумма ущерба
              </div>
              <div className="flex items-center gap-2 text-red-400 text-2xl font-pixel bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{scammer.damage_amount.toLocaleString()} ₽</span>
              </div>
            </div>
          )}

          {/* Proof Images Gallery */}
          {scammer.proof_images && scammer.proof_images.length > 0 && (
            <div>
              <div className="text-sm text-gray-400 font-pixel uppercase mb-3">
                Доказательства ({scammer.proof_images.length})
              </div>
              
              {/* Main Image */}
              <div className="relative mb-4 bg-black/50 rounded-lg overflow-hidden border-2 border-gray-700/50">
                <img
                  src={scammer.proof_images[selectedImageIndex]}
                  alt={`Proof ${selectedImageIndex + 1}`}
                  className="w-full h-auto max-h-96 object-contain"
                />
                
                {/* Navigation Arrows */}
                {scammer.proof_images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === 0 ? scammer.proof_images.length - 1 : prev - 1
                      )}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === scammer.proof_images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 px-3 py-1 bg-black/60 rounded-full text-white text-sm font-pixel">
                  {selectedImageIndex + 1} / {scammer.proof_images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {scammer.proof_images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {scammer.proof_images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImageIndex
                          ? 'border-red-500 ring-2 ring-red-500/50'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-700/50">
            <div className="text-xs text-gray-500 font-pixel">
              Добавлено: {formatDate(scammer.created_at)}
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="p-6 border-t border-gray-700/50 bg-gray-900/50 space-y-3">
            {/* Verify Button (only for pending) */}
            {scammer.status === 'pending' && (
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-pixel uppercase rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Подтверждение...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>✓ Подтвердить</span>
                  </>
                )}
              </button>
            )}

            {/* Delete Button */}
            {showDeleteConfirm ? (
              <div className="space-y-3">
                <div className="text-yellow-400 font-pixel text-sm">
                  ⚠️ Вы уверены? Это действие нельзя отменить.
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-pixel uppercase rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? 'Удаление...' : 'Да, удалить'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-pixel uppercase rounded-lg transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 font-pixel uppercase rounded-lg transition-colors"
              >
                🗑️ Удалить запись
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScammerDetailModal;

