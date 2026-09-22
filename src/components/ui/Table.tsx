import React from 'react';

export interface TableProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Table: React.FC<TableProps> = ({ children, className = '', style }) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto', ...style }}>
      <table className={`ct-table ${className}`}>{children}</table>
    </div>
  );
};

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <thead className={className}>{children}</thead>;

export const TableBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <tbody className={className}>{children}</tbody>;

export const TableRow: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({ children, className = '', onClick, style }) => (
  <tr
    onClick={onClick}
    style={{
      cursor: onClick ? 'pointer' : undefined,
      ...style,
    }}
    className={className}
  >
    {children}
  </tr>
);

export const TableHeaderCell: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  align?: 'left' | 'center' | 'right';
}> = ({ children, className = '', style, align = 'left' }) => (
  <th style={{ textAlign: align, ...style }} className={className}>
    {children}
  </th>
);

export const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  align?: 'left' | 'center' | 'right';
}> = ({ children, className = '', style, align = 'left' }) => (
  <td style={{ textAlign: align, ...style }} className={className}>
    {children}
  </td>
);
