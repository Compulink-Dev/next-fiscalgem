import { Input } from '@/components/ui/input'
import { ChartArea, Search, User } from 'lucide-react'
import React from 'react'

function Header() {
    return (
        <div className='w-full bg-green-900 shadow-lg p-4 flex items-center justify-between'>
            <div className="border rounded flex items-center gap-2 p-2 text-sm text-white">
                <Search size={14} />
                <input className='border-none outline-none bg-transparent' />
            </div>
            <div className="flex gap-2 text-white">
                <ChartArea />
                <User />
            </div>
        </div>
    )
}

export default Header