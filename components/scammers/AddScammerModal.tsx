import React, { useState, useRef } from 'react';
import { addScammer, uploadScammerProofs, ScammerFormData } from '../../utils/scammers';

interface AddScammerModalProps {
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddScammerModal: React.FC<AddScammerModalProps> = ({ userId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ScammerFormData>({
    roblox_username: '',
    telegram_nickname: '',
    telegram_username: '',
    reason: '',
    description: '',
    damage_amount: undefined,
    status: 'verified'
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'damage_amount' ? (value ? parseInt(value) : undefined) : value
    }));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} не является изображением`);
        return false;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} слишком большой (макс. 5MB)`);
        return false;
      }
      return true;
    });

    // Limit to 5 images total
    const remainingSlots = 5 - selectedFiles.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);

    if (filesToAdd.length < newFiles.length) {
      alert('Можно загрузить максимум 5 фото');
    }

    // Create preview URLs
    const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));

    setSelectedFiles(prev => [...prev, ...filesToAdd]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.roblox_username.trim()) {
      alert('Укажите Roblox username');
      return;
    }
    if (!formData.reason.trim()) {
      alert('Укажите причину');
      return;
    }
    if (selectedFiles.length === 0) {
      alert('Загрузите хотя бы одно доказательство');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images
      const imageUrls = await uploadScammerProofs(selectedFiles);

      // Add scammer to database
      await addScammer(formData, imageUrls, userId);

      // Cleanup preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));

      // Success
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding scammer:', error);
      alert('Ошибка при добавлении скамера. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-red-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 50px rgba(239, 68, 68, 0.3)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-gray-800/80 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-pixel font-bold text-white">
            Добавить скамера
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Заполните информацию о скамере и загрузите доказательства
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Roblox Username */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Roblox Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="roblox_username"
              value={formData.roblox_username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
              placeholder="Введите Roblox username"
              required
            />
          </div>

          {/* Telegram Nickname */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Telegram Nickname
            </label>
            <input
              type="text"
              name="telegram_nickname"
              value={formData.telegram_nickname}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
              placeholder="Имя в Telegram (опционально)"
            />
          </div>

          {/* Telegram Username */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Telegram Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
              <input
                type="text"
                name="telegram_username"
                value={formData.telegram_username}
                onChange={handleInputChange}
                className="w-full pl-8 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="username (без @)"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Причина <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
              placeholder="Краткая причина скама"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Подробное описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors resize-none"
              placeholder="Детальное описание ситуации (опционально)"
            />
          </div>

          {/* Damage Amount */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Сумма ущерба (₽)
            </label>
            <input
              type="number"
              name="damage_amount"
              value={formData.damage_amount || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
              placeholder="Сумма в рублях (опционально)"
              min="0"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Статус
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
            >
              <option value="verified">Подтвержден</option>
              <option value="pending">На проверке</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Доказательства <span className="text-red-400">*</span>
            </label>
            
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => selectedFiles.length < 5 && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
              } ${selectedFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-300 font-pixel mb-1">
                {selectedFiles.length >= 5 
                  ? 'Максимум 5 фото' 
                  : 'Перетащите фото или нажмите для выбора'
                }
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF до 5MB ({selectedFiles.length}/5)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                disabled={selectedFiles.length >= 5}
              />
            </div>

            {/* Preview */}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-pixel uppercase rounded-lg transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-pixel uppercase rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Загрузка...</span>
                </>
              ) : (
                'Добавить'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScammerModal;

