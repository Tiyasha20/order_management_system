import React from 'react';

export const Toast = ({ toasts }) => (
  <div className="toastStack">
    {toasts.map((toast) => (
      <div className={`toast ${toast.type}`} key={toast.id}>{toast.message}</div>
    ))}
  </div>
);
