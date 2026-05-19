import React from 'react';

export const Table = ({ headers, rows, empty = 'No records found' }) => (
  <div className="tableWrap">
    <table>
      <thead>
        <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
      </thead>
      <tbody>
        {rows.length ? rows : (
          <tr>
            <td colSpan={headers.length} className="empty">{empty}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
