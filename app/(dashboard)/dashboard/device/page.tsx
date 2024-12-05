import React from 'react'
import ConfigButton from '../../_components/ConfigButton'
import StatusButton from '../../_components/StatusButton'
import { Separator } from '@/components/ui/separator'

function Device() {
    return (
        <div className="">
            <p className="text-lg font-bold text-green-700">Device Information</p>
            <Separator className='my-4 bg-green-700' />
            <div className='flex gap-4 text-green-700'>
                <ConfigButton />
                <StatusButton />
            </div>
        </div>
    )
}

export default Device