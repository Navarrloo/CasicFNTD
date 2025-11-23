import React, { useState } from 'react';
import { Scammer } from '../../types';
import { searchScammers } from '../../utils/scammers';

interface CheckScammerModalProps {
    onClose: () => void;
}

const CheckScammerModal: React.FC<CheckScammerModalProps> = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [result, setResult] = useState<'idle' | 'loading' | 'safe' | 'warning' | 'danger'>('idle');
    const [foundScammer, setFoundScammer] = useState<Scammer | null>(null);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setResult('loading');
        try {
            const scammers = await searchScammers(username);
            const match = scammers.find(s =>
                s.roblox_username.toLowerCase() === username.toLowerCase() ||
                s.telegram_username?.toLowerCase() === username.toLowerCase()
            );

            if (match) {
                setFoundScammer(match);
                setResult(match.status === 'verified' ? 'danger' : 'warning');
            } else {
                setFoundScammer(null);
                setResult('safe');
            }
        } catch (error) {
            console.error('Error checking user:', error);
            setResult('idle');
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative bg-stone-900 border-2 border-stone-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8 text-center">
                    <h2 className="text-2xl font-rust text-white mb-6">ПРОВЕРИТЬ ПОЛЬЗОВАТЕЛЯ</h2>

                    <form onSubmit={handleCheck} className="mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setResult('idle');
                                }}
                                placeholder="ВВЕДИТЕ НИКНЕЙМ..."
                                className="w-full bg-stone-800 border-2 border-stone-600 rounded-lg py-3 px-4 text-white font-rust text-center placeholder-stone-500 focus:border-orange-500 outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!username.trim() || result === 'loading'}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-500 text-black p-2 rounded-md transition-colors disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {result === 'loading' && (
                        <div className="py-8">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-stone-400 font-rust animate-pulse">ПОИСК В БАЗЕ...</p>
                        </div>
                    )}

                    {result === 'safe' && (
                        <div className="py-4 animate-fadeIn">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-rust text-green-500 mb-2">ЖАЛОБ НЕ НАЙДЕНО</h3>
                            <p className="text-stone-400 text-sm">
                                Пользователь <span className="text-white font-bold">{username}</span> не найден в базе скамеров.
                            </p>
                            <p className="text-stone-600 text-xs mt-4">
                                ВСЕГДА ИСПОЛЬЗУЙТЕ ГАРАНТА ДЛЯ КРУПНЫХ СДЕЛОК.
                            </p>
                        </div>
                    )}

                    {result === 'danger' && foundScammer && (
                        <div className="py-4 animate-fadeIn">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500 animate-pulse">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-rust text-red-500 mb-2">ПОДТВЕРЖДЕННЫЙ СКАМЕР!</h3>
                            <p className="text-stone-300 text-sm mb-4">
                                Пользователь <span className="text-white font-bold">{foundScammer.roblox_username}</span> является подтвержденным скамером.
                            </p>
                            <div className="bg-stone-800/50 p-4 rounded-lg text-left mb-4">
                                <p className="text-xs text-stone-500 font-rust uppercase mb-1">ПРИЧИНА:</p>
                                <p className="text-red-400 text-sm">{foundScammer.reason}</p>
                            </div>
                            <p className="text-red-500 font-bold text-sm uppercase">
                                НЕ ПРОВОДИТЕ СДЕЛКИ С ЭТИМ ПОЛЬЗОВАТЕЛЕМ!
                            </p>
                        </div>
                    )}

                    {result === 'warning' && foundScammer && (
                        <div className="py-4 animate-fadeIn">
                            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-500">
                                <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-rust text-yellow-500 mb-2">ЕСТЬ ЖАЛОБЫ</h3>
                            <p className="text-stone-300 text-sm mb-4">
                                На пользователя <span className="text-white font-bold">{foundScammer.roblox_username}</span> есть жалобы (на проверке).
                            </p>
                            <div className="bg-stone-800/50 p-4 rounded-lg text-left mb-4">
                                <p className="text-xs text-stone-500 font-rust uppercase mb-1">ПРИЧИНА ЖАЛОБЫ:</p>
                                <p className="text-yellow-400 text-sm">{foundScammer.reason}</p>
                            </div>
                            <p className="text-yellow-500 font-bold text-sm uppercase">
                                БУДЬТЕ ПРЕДЕЛЬНО ОСТОРОЖНЫ!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckScammerModal;
