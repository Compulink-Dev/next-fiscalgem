import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function HeroSection() {
    return (
        <section className="text-center py-40 bg-green-800 text-white">
            <div className="">
                <h2 className="text-4xl font-semibold mb-4">Empower Your Business with Smart Fiscal Solutions</h2>
                <p className="text-xl mb-6">Manage your fiscal devices and tax compliance effortlessly.</p>
                <Button
                    className='bg-green-500 hover:bg-green-900'
                >
                    <Link href={'/dashboard'}>
                        Get Started
                    </Link>
                </Button>
            </div>
        </section>
    )
}

export default HeroSection