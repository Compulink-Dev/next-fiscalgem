'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { FolderUp, FolderInput, Folder } from 'lucide-react';
import Link from 'next/link';
import { useIsActive } from './IsActive';

const InvoiceDropdown = () => {
    const isActivePaths = ['/dashboard/invoices', '/dashboard/receipts'];
    const isActive = useIsActive(isActivePaths); // Use the custom hook

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={isActive ? undefined : 'outline'}
                    className={isActive ? 'bg-green-700 text-white outline-none flex gap-9' : 'flex gap-8'}
                >
                    <Folder />
                    <span>Invoice</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link
                        href="/dashboard/invoices"
                        className={`flex items-center gap-6 hover:text-green-600`}
                    >
                        <FolderUp />
                        <p className="text-sm">Upload</p>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        href="/dashboard/receipts"
                        className={`flex items-center gap-6 mt-4 hover:text-green-600`}
                    >
                        <FolderInput />
                        <p className="text-sm">Receipt</p>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default InvoiceDropdown;
