// components/ui/table.tsx
import React from 'react';

export const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">{children}</table>
    </div>
);

export const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <thead className="bg-gray-100 text-gray-700 text-left text-sm font-bold">{children}</thead>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <tbody className="text-gray-700 text-xs">{children}</tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <tr className="border-b">{children}</tr>
);

export const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <td className="px-4 py-2">{children}</td>
);
