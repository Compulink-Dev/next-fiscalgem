import Title from '@/app/_components/Title'
import { File, MessageCircle, MessageSquare, Save } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Sidebar() {
    return (
        <div className=' p-4 border-r border-green-700 h-full flex flex-col gap-6'>
            <Link href={'/dashboard'} className="">
                <Title />
            </Link>
            <div className="flex flex-col gap-4 text-green-900">
                <Link href={'/dashboard/invoices'} className="flex gap-2 items-center">
                    <MessageSquare />
                    <p className="text-sm">Invoice</p>
                </Link>
                <Link href={'/dashboard/receipts'} className="flex gap-2 items-center">
                    <MessageCircle />
                    <p className="text-sm">Receipt</p>
                </Link>
                <Link href={'/dashboard/invoices'} className="flex gap-2 items-center">
                    <File />
                    <p className="text-sm">Storage</p>
                </Link>
                <Link href={'/dashboard/receipts'} className="flex gap-2 items-center">
                    <Save />
                    <p className="text-sm">Saved</p>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar