'use client'
import React, { useState } from 'react'
import Title from './Title'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

function Header() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleMouseEnter = () => {
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        setDropdownOpen(false);
    };

    return (
        <header className="w-full bg-gray-50 text-green-900 py-4 px-8">
            <div className=" mx-auto flex items-center justify-between">
                <Link href={'/'}>
                    <Title />
                </Link>
                <nav>
                    <ul className=" text-sm flex items-center space-x-4">
                        <li>
                            <Link href={'/solutions'}>Our Solutions</Link>
                        </li>
                        <li>
                            <Link href={'/pricing'}>Pricing</Link>
                        </li>
                        <li
                            className="relative"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                                Resources
                                {dropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            {dropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                                    <ul className="py-2">
                                        <li>
                                            <Link href="/components/resources/tickets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Tickets
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/components/resources/inquiries" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Enquiries
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                        <li>
                            <Link href={'/contact'}>Contact Us</Link>
                        </li>
                        <Button className='bg-green-600 hover:bg-green-900'>
                            <Link href={'/dashboard'}>
                                Get Started
                            </Link>
                        </Button>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header