'use client'
import Title from '@/app/_components/Title'
import { DoorOpen, FolderInput, FolderSearch, FolderTree, FolderUp, Server } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import GetConfigButton from './GetConfig'
import { Button } from '@/components/ui/button'
import GetStatusButton from './GetStatus'
import { usePathname } from 'next/navigation'
import InvoiceDropdown from './InvoiceDropDown'

function Sidebar() {
    const pathname = usePathname();

    // Helper function to determine if a route is active
    const isActive = (path: string) => pathname === path;

    return (
        <div className=' p-4 border-r border-green-700 h-screen w-42 flex flex-col  gap-6'>
            <Link href={'/dashboard'} className="flex items-center w-full pl-4">
                <Title />
            </Link>
            <div className="flex flex-col gap-4 text-green-900">
                <Button
                    asChild
                    variant={isActive('/dashboard') ? undefined : 'outline'}
                    className={isActive('/dashboard') ? 'bg-green-700 text-white' : ''}
                >
                    <Link href={'/dashboard'} className="flex items-center gap-4">
                        <DoorOpen />
                        <p className="">Open Day</p>
                    </Link>
                </Button>
                <InvoiceDropdown />
                <Button
                    asChild
                    variant={isActive('/dashboard/storage') ? undefined : 'outline'}
                    className={isActive('/dashboard/storage') ? 'bg-green-700 text-white' : ''}
                >
                    <Link href={'/dashboard/storage'} className="flex gap-6 items-center">
                        <FolderTree />
                        <p className="text-sm">Storage</p>
                    </Link>
                </Button>
                <Button
                    asChild
                    variant={isActive('/dashboard/saved') ? undefined : 'outline'}
                    className={isActive('/dashboard/saved') ? 'bg-green-700 text-white' : ''}
                >
                    <Link href={'/dashboard/saved'} className="flex items-center gap-8">
                        <FolderSearch />
                        <p className="">Saved</p>
                    </Link>
                </Button>
                <Button
                    asChild
                    variant={isActive('/dashboard/device') ? undefined : 'outline'}
                    className={isActive('/dashboard/device') ? 'bg-green-700 text-white' : ''}
                >
                    <Link href={'/dashboard/device'} className="flex items-center gap-8">
                        <Server />
                        <p className="">Device</p>
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default Sidebar