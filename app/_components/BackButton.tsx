'use client'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function BackButton() {
    const router = useRouter()

    return (
        <div>
            <Button
                onClick={() => router.back()}
                className='bg-green-900 hover:bg-green-500 flex gap-2'>
                <ChevronLeft />
                <div className=""> Back</div>
            </Button>
        </div>
    )
}

export default BackButton