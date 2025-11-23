import React, { useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';
import { SoundManager } from '../../utils/sounds';

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchase: (amount: number, cost: number) => Promise<void>;
}

const SOUL_PACKS = [
    { amount: 100, cost: 1, label: 'Starter Pack' },
    { amount: 500, cost: 5, label: 'Basic Pack' },
    { amount: 1200, cost: 10, label: 'Value Pack' },
    { amount: 3000, cost: 25, label: 'Pro Pack' },
    { amount: 7000, cost: 50, label: 'Elite Pack' },
    { amount: 15000, cost: 100, label: 'Ultimate Pack' },
];

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onPurchase }) => {
    const [loadingPack, setLoadingPack] = useState<number | null>(null);

    const handlePurchase = async (amount: number, cost: number, index: number) => {
        setLoadingPack(index);
        SoundManager.play('click');
        try {
            await onPurchase(amount, cost);
            SoundManager.play('win');
        } catch (error) {
            console.error('Purchase failed:', error);
            SoundManager.play('error');
        } finally {
            setLoadingPack(null);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="top-up-modal-title"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 600,
                bgcolor: '#1c1917', // stone-900
                border: '2px solid #f97316', // orange-500
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                outline: 'none',
            }}>
                <Typography id="top-up-modal-title" variant="h4" component="h2" sx={{
                    color: '#f97316',
                    fontFamily: 'Rust, sans-serif',
                    textAlign: 'center',
                    mb: 4,
                    textShadow: '0 0 10px rgba(249, 115, 22, 0.5)'
                }}>
                    SOUL STORE
                </Typography>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {SOUL_PACKS.map((pack, index) => (
                        <div key={index}>
                            <Box sx={{
                                border: '1px solid #44403c', // stone-700
                                borderRadius: 1,
                                p: 2,
                                textAlign: 'center',
                                bgcolor: '#0c0a09', // stone-950
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    borderColor: '#f97316',
                                }
                            }}>
                                <Typography variant="subtitle1" sx={{ color: '#a8a29e', fontFamily: 'Rust' }}>
                                    {pack.label}
                                </Typography>
                                <Typography variant="h5" sx={{ color: '#fff', my: 1, fontFamily: 'Rust' }}>
                                    {pack.amount.toLocaleString()} 👻
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={loadingPack !== null}
                                    onClick={() => handlePurchase(pack.amount, pack.cost, index)}
                                    sx={{
                                        bgcolor: '#ea580c', // orange-600
                                        '&:hover': { bgcolor: '#c2410c' },
                                        fontFamily: 'Rust',
                                        mt: 1
                                    }}
                                >
                                    {loadingPack === index ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        `$${pack.cost}`
                                    )}
                                </Button>
                            </Box>
                        </div>
                    ))}
                </div>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#57534e' }}>
                        SECURE PAYMENT • INSTANT DELIVERY
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
};

export default TopUpModal;
