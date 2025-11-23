import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { supabase } from '../../lib/supabase';
import { Unit } from '../../types';

interface Listing {
    id: string;
    seller_id: number;
    seller_username: string;
    asking_price: number;
    unit_data: Unit;
}

interface MakeOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    listing: Listing | null;
    userBalance: number;
    userId: number;
    username: string;
}

const MakeOfferModal: React.FC<MakeOfferModalProps> = ({ isOpen, onClose, listing, userBalance, userId, username }) => {
    const [offerAmount, setOfferAmount] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!listing) return null;

    const handleOffer = async () => {
        const amount = parseInt(offerAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('Пожалуйста, введите корректную сумму');
            return;
        }

        if (amount > userBalance) {
            setError('У вас недостаточно душ для этого предложения');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (supabase) {
                const { error: dbError } = await supabase
                    .from('offers')
                    .insert({
                        listing_id: listing.id,
                        buyer_id: userId,
                        buyer_username: username,
                        offer_amount: amount,
                        status: 'pending'
                    });

                if (dbError) throw dbError;

                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setOfferAmount('');
                }, 1500);
            } else {
                setError('Ошибка подключения к базе данных');
            }
        } catch (err) {
            console.error('Error making offer:', err);
            setError('Не удалось отправить предложение');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 350,
                bgcolor: '#1c1917', // stone-900
                border: '2px solid #44403c', // stone-700
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                outline: 'none'
            }}>
                {success ? (
                    <div className="text-center py-6">
                        <Typography variant="h5" className="font-rust text-green-500 mb-2">ПРЕДЛОЖЕНИЕ ОТПРАВЛЕНО!</Typography>
                        <Typography className="text-stone-400">Продавец получит уведомление.</Typography>
                    </div>
                ) : (
                    <>
                        <Typography variant="h5" className="font-rust text-orange-500 mb-4 text-center">
                            СДЕЛАТЬ ПРЕДЛОЖЕНИЕ
                        </Typography>

                        <div className="flex items-center gap-3 mb-4 bg-stone-950 p-2 rounded border border-stone-800">
                            <img src={listing.unit_data.image} alt={listing.unit_data.name} className="w-12 h-12 object-contain" />
                            <div>
                                <Typography className="font-rust text-white text-sm">{listing.unit_data.name}</Typography>
                                <Typography className="text-xs text-stone-500">Цена: {listing.asking_price} 👻</Typography>
                            </div>
                        </div>

                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Введите сумму..."
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            type="number"
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#44403c' },
                                    '&:hover fieldset': { borderColor: '#f97316' },
                                    '&.Mui-focused fieldset': { borderColor: '#f97316' },
                                }
                            }}
                        />

                        {error && (
                            <Typography className="text-red-500 text-xs mb-3 text-center">{error}</Typography>
                        )}

                        <div className="flex justify-between items-center mb-4 text-xs text-stone-500">
                            <span>Ваш баланс:</span>
                            <span className={userBalance < parseInt(offerAmount || '0') ? 'text-red-500' : 'text-green-500'}>
                                {userBalance.toLocaleString()} 👻
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={onClose}
                                sx={{
                                    color: '#a8a29e',
                                    borderColor: '#57534e',
                                    '&:hover': { borderColor: '#78716c', color: '#d6d3d1' }
                                }}
                            >
                                ОТМЕНА
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleOffer}
                                disabled={isSubmitting || !offerAmount}
                                sx={{
                                    bgcolor: '#ea580c',
                                    '&:hover': { bgcolor: '#c2410c' },
                                    fontFamily: 'var(--font-rust)'
                                }}
                            >
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'ОТПРАВИТЬ'}
                            </Button>
                        </div>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default MakeOfferModal;
