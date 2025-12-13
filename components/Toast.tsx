import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-stone-800'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-white" />,
    error: <AlertCircle className="w-5 h-5 text-white" />,
    info: <Info className="w-5 h-5 text-white" />
  };

  return createPortal(
    <div className="fixed top-24 right-4 md:right-10 z-[100] animate-slideInRight">
      <div className={`${bgColors[type]} text-neutral-50 px-6 py-4 rounded-xl shadow-[0px_10px_40px_rgba(0,0,0,0.1)] flex items-center gap-3 min-w-[300px] border border-white/10`}>
        {icons[type]}
        <p className="font-medium text-base font-['Inter'] flex-1 leading-5">{message}</p>
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <X size={20} className="text-white" />
        </button>
      </div>
    </div>,
    document.body
  );
};