import Subtitle from '@/app/_components/Subtitle'
import { Separator } from '@/components/ui/separator'
import React from 'react'

function Saved() {
    return (
        <div>
            <Subtitle name={'Saved Invoices'} />
            <Separator className='my-4 bg-green-700' />
        </div>
    )
}

export default Saved