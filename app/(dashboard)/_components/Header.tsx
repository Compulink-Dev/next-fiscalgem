import { Bell, Search, User } from 'lucide-react'
import React from 'react'

function Header() {
    return (
        <div className='w-full bg-green-900 shadow-lg p-4 flex items-center justify-between'>
            <div className="border rounded flex items-center gap-2 px-2 py-1 text-sm text-white">
                <Search size={14} />
                <input className='border-none outline-none bg-transparent' />
            </div>
            <div className="flex gap-2 text-white items-center">
                <Bell size={16} />
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-green-900">
                    <User size={16} />
                </div>
            </div>
        </div>
    )
}

export default Header