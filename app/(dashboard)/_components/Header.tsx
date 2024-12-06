'use client'
import { Bell, Search, User } from 'lucide-react';
import React from 'react';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

function Header() {
    return (
        <div className='w-full bg-green-900 shadow-lg p-4 flex items-center justify-between'>
            <div className="border rounded flex items-center gap-2 px-2 py-1 text-sm text-white">
                <Search size={14} />
                <input
                    className='border-none outline-none bg-transparent text-white placeholder:text-gray-300'
                    placeholder='Search...'
                />
            </div>
            <div className="flex gap-2 text-white items-center">
                <Bell size={16} />
                <div
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-green-900 cursor-pointer"
                    onClick={() => {
                        if (toast('Are you sure you want to sign out?')) {
                            signOut({ callbackUrl: '/' });
                        }
                    }}
                    title="Sign out"
                >
                    <User size={16} />
                </div>
            </div>
        </div>
    );
}

export default Header;
