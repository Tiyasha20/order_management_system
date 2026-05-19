import React from 'react';

export const Badge = ({ status }) => <span className={`badge ${status?.toLowerCase()}`}>{status}</span>;
