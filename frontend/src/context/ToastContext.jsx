import React, { createContext, useContext, useMemo, useState } from 'react';
import { Toast } from '../components/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const push = (message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3000);
  };

  const value = useMemo(() => ({ success: (msg) => push(msg, 'success'), error: (msg) => push(msg, 'error') }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toasts={toasts} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
