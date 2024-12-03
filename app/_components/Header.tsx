import React from 'react'
import Title from './Title'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function Header() {
    return (
        <header className="w-full bg-gray-50 text-green-900 py-4 px-8">
            <div className=" mx-auto flex items-center justify-between">
                <Title />
                <nav>
                    <ul className=" text-sm flex items-center space-x-4">
                        <li>
                            <Link href={'/'}>Our Solutions</Link>
                        </li>
                        <li>
                            <Link href={'/'}>Pricing</Link>
                        </li>
                        <li>
                            <Link href={'/'}>Resources</Link>
                        </li>
                        <li>
                            <Link href={'/'}>Contact Us</Link>
                        </li>
                        <Button className='bg-green-600 hover:bg-green-900'>
                            <Link href={'/receipt'}>
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