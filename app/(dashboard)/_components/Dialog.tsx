// components/ui/dialog.tsx
import React from 'react';

export const Dialog: React.FC<{ open: boolean; onOpenChange: () => void; children: React.ReactNode }> = ({
    open,
    onOpenChange,
    children,
}) => (
    <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        onClick={onOpenChange}
    >
        <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    </div>
);

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="space-y-4">{children}</div>
);

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mb-4">{children}</div>
);

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-lg font-semibold text-green-700">{children}</h2>
);

export const DialogFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-6 flex justify-end space-x-2">{children}</div>
);
