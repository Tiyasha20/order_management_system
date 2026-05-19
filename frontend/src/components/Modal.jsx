import React from 'react';
import { Button } from './Button';

export const Modal = ({ title, message, onConfirm, onCancel, loading }) => (
  <div className="modalBackdrop" role="dialog" aria-modal="true">
    <div className="modal">
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="modalActions">
        <Button variant="secondary" onClick={onCancel}>Close</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>Confirm</Button>
      </div>
    </div>
  </div>
);
