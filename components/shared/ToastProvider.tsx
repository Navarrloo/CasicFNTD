import React from 'react';

interface ToastProviderProps {
    children: React.ReactNode;
    toast: { message: string, type: 'success' | 'error' } | null;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children, toast }) => {
    const isSuccess = toast?.type === 'success';
    const styles = {
        bg: isSuccess ? 'bg-accent-green' : 'bg-accent-red',
        text: isSuccess ? 'text-background-dark' : 'text-white',
        shadow: isSuccess ? 'shadow-accent-green' : 'shadow-accent-red'
    };

    return (
        <div className="relative h-full w-full">
            {children}
            {toast && (
                <div 
                    className={`fixed bottom-24 left-1/2 -translate-x-1/2 p-3 font-pixel text-lg z-[9999] border border-black/50 animate-fadeIn ${styles.bg} ${styles.text}`}
                    style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.5)', boxShadow: `0 0 15px ${styles.shadow}`}}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default ToastProvider;
