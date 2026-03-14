import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X, HelpCircle } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);
  
  console.log('--- NOTIFICATION SYSTEM v2 ACTIVE ---');

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const askConfirm = useCallback((config) => {
    return new Promise((resolve) => {
      setConfirm({ ...config, resolve });
    });
  }, []);

  const handleConfirm = (value) => {
    if (confirm) {
      confirm.resolve(value);
      setConfirm(null);
    }
  };

  return (
    <NotificationContext.Provider value={{ showToast, askConfirm }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirm && (
          <ConfirmModal 
            {...confirm} 
            onConfirm={() => handleConfirm(true)} 
            onCancel={() => handleConfirm(false)} 
          />
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-purple-500" size={20} />,
  };

  const bgColors = {
    success: 'bg-green-50/90 border-green-100',
    error: 'bg-red-50/90 border-red-100',
    info: 'bg-purple-50/90 border-purple-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      className={`pointer-events-auto flex items-center gap-4 p-5 rounded-[1.5rem] border shadow-2xl backdrop-blur-md min-w-[320px] max-w-[400px] ${bgColors[type]}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 font-bold text-zinc-900 text-sm leading-tight">{message}</p>
      <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
        <X size={18} />
      </button>
    </motion.div>
  );
};

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_32px_128px_-12px_rgba(0,0,0,0.3)] w-full max-w-md overflow-hidden"
      >
        <div className="p-10 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 ${
             type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'
          }`}>
             {type === 'danger' ? <AlertCircle size={40} /> : <HelpCircle size={40} />}
          </div>
          <h3 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase mb-3">{title}</h3>
          <p className="text-zinc-500 font-medium leading-relaxed mb-10">{message}</p>
          
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm}
              className={`w-full py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest transition-all ${
                type === 'danger' ? 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-500/20' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-xl shadow-purple-500/20'
              }`}
            >
              🚀 {confirmText}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-5 rounded-[1.25rem] font-bold text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all uppercase text-xs tracking-widest"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
