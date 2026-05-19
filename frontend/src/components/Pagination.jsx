import React from 'react';
import { Button } from './Button';

export const Pagination = ({ page, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <div className="pagination">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</Button>
      {pages.map((item) => (
        <button key={item} className={item === page ? 'page active' : 'page'} onClick={() => onPageChange(item)}>
          {item}
        </button>
      ))}
      <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
    </div>
  );
};
