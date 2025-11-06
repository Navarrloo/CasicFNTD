import React, { useState, useRef } from 'react';
import { addScammer, uploadScammerProofs, ScammerFormData } from '../../utils/scammers';

interface ReportScammerModalProps {
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const ReportScammerModal: React.FC<ReportScammerModalProps> = ({ userId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ScammerFormData>({
    roblox_username: '',
    telegram_nickname: '',
    telegram_username: '',
    reason: '',
    description: '',
    damage_amount: undefined,
    status: 'pending' // Всегда pending для обычных пользователей
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'damage_amount' ? (value ? parseInt(value) : undefined) : value
    }));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} не является изображением`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} слишком большой (макс. 5MB)`);
        return false;
      }
      return true;
    });

    const remainingSlots = 5 - selectedFiles.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);

    if (filesToAdd.length < newFiles.length) {
      alert('Можно загрузить максимум 5 фото');
    }

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
      console.log('Uploading images...');
      const imageUrls = await uploadScammerProofs(selectedFiles);
      console.log('Images uploaded:', imageUrls);
      
      console.log('Adding scammer to database...');
      await addScammer(formData, imageUrls, userId);
      console.log('Scammer added successfully');
      
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      alert('Жалоба успешно отправлена! Спасибо за помощь в борьбе со скамерами.');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error reporting scammer:', error);
      
      // Более детальное сообщение об ошибке
      let errorMessage = 'Ошибка при отправке жалобы.';
      
      if (error.message) {
        if (error.message.includes('storage')) {
          errorMessage = 'Ошибка загрузки фото. Убедитесь, что bucket создан в Supabase.';
        } else if (error.message.includes('permission') || error.message.includes('policy')) {
          errorMessage = 'Ошибка доступа. Проверьте права в Supabase.';
        } else {
          errorMessage = `Ошибка: ${error.message}`;
        }
      }
      
      alert(errorMessage + '\n\nПодробности в консоли (F12)');
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
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-yellow-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 50px rgba(234, 179, 8, 0.3)'
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
          <h2 className="text-2xl font-pixel font-bold text-white mb-2">
            ⚠️ Пожаловаться на скамера
          </h2>
          <p className="text-sm text-gray-400">
            Ваша жалоба будет отправлена на проверку администрации
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Roblox Username */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Roblox Username <span className="text-yellow-400">*</span>
            </label>
            <input
              type="text"
              name="roblox_username"
              value={formData.roblox_username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
              placeholder="Введите Roblox username скамера"
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
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
              placeholder="Имя в Telegram (если известно)"
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
                className="w-full pl-8 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
                placeholder="username (если известен)"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Причина <span className="text-yellow-400">*</span>
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
              placeholder="Например: не вернул 500 робуксов"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Подробное описание <span className="text-yellow-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors resize-none"
              placeholder="Опишите детально что произошло, когда, как связывались и т.д."
              required
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
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
              placeholder="Примерная сумма в рублях"
              min="0"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-pixel text-gray-300 mb-2">
              Доказательства <span className="text-yellow-400">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Скриншоты переписки, доказательства сделки и т.д.
            </p>
            
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => selectedFiles.length < 5 && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-yellow-500 bg-yellow-500/10'
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

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-gray-300">
                <p className="font-pixel text-blue-400 mb-1">Важно знать:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Ваша жалоба будет проверена администрацией</li>
                  <li>Предоставляйте только правдивую информацию</li>
                  <li>Загружайте четкие скриншоты доказательств</li>
                  <li>Ложные жалобы могут привести к блокировке</li>
                </ul>
              </div>
            </div>
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
              className="flex-1 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-pixel uppercase rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Отправка...</span>
                </>
              ) : (
                'Отправить жалобу'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportScammerModal;

