import React from 'react';

export const Input = ({ label, error, helperText, className = '', ...props }) => (
  <label className={`field ${className}`}>
    <span>{label}</span>
    <input className={error ? 'invalid' : ''} {...props} />
    {helperText && !error && <small>{helperText}</small>}
    {error && <small className="errorText">{error}</small>}
  </label>
);
