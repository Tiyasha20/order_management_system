import React from 'react';
import { Spinner } from './Spinner';

export const Button = ({ children, variant = 'primary', loading = false, className = '', ...props }) => (
  <button className={`btn ${variant} ${className}`} disabled={loading || props.disabled} {...props}>
    {loading && <Spinner />}
    {children}
  </button>
);
