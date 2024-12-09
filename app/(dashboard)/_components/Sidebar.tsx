'use client'
import Title from '@/app/_components/Title';
import { DoorClosed, DoorOpen, FolderSearch, FolderTree, Server } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import InvoiceDropdown from './InvoiceDropDown';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

function Sidebar() {
    const pathname = usePathname();

    // Helper function to determine if a route is active
    const isActive = (path: string) => pathname === path;

    return (
        <div className="p-4 border-r border-green-700 h-screen w-42 flex flex-col justify-between">
            {/* Top Section */}
            <div>
                <Link href={'/dashboard'} className="flex items-center w-full pl-4 mb-6">
                    <Title />
                </Link>
                <div className="flex flex-col gap-4 text-green-900">
                    <Button
                        asChild
                        variant={isActive('/dashboard') ? undefined : 'outline'}
                        className={isActive('/dashboard') ? 'bg-green-700 text-white' : ''}
                    >
                        <Link href={'/dashboard'} className="flex items-center justify-between">
                            <DoorOpen />
                            <p>Open Day</p>
                        </Link>
                    </Button>
                    <InvoiceDropdown />
                    <Button
                        asChild
                        variant={isActive('/dashboard/storage') ? undefined : 'outline'}
                        className={isActive('/dashboard/storage') ? 'bg-green-700 text-white' : ''}
                    >
                        <Link href={'/dashboard/storage'} className="flex items-center justify-between">
                            <FolderTree />
                            <p className="text-sm">Storage</p>
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant={isActive('/dashboard/saved') ? undefined : 'outline'}
                        className={isActive('/dashboard/saved') ? 'bg-green-700 text-white' : ''}
                    >
                        <Link href={'/dashboard/saved'} className="flex items-center justify-between">
                            <FolderSearch />
                            <p>Saved</p>
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant={isActive('/dashboard/device') ? undefined : 'outline'}
                        className={isActive('/dashboard/device') ? 'bg-green-700 text-white' : ''}
                    >
                        <Link href={'/dashboard/device'} className="flex items-center justify-between">
                            <Server />
                            <p>Device</p>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Bottom Section */}
            <Button
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-green-900 hover:text-white text-green-900 cursor-pointer"
                onClick={() => {
                    if (confirm('Are you sure you want to sign out?')) {
                        signOut({ callbackUrl: '/' });
                    }
                }}
                title="Sign out"
            >
                <DoorClosed size={14} />
                <p className="text-sm">Signout</p>
            </Button>
        </div>
    );
}

export default Sidebar;
