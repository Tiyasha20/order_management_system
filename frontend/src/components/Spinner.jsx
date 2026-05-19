import React from 'react';

export const Spinner = ({ overlay = false }) => (
  <span className={overlay ? 'spinnerOverlay' : 'spinnerInline'}>
    <span className="spinner" />
  </span>
);
