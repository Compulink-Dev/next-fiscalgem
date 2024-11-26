import { Gem } from 'lucide-react'
import React from 'react'

function Title() {
    return (
        <div className="flex items-center">
            <p className="text-2xl font-bold text-green-700">Fiscal</p>
            <Gem className='text-green-700' />
        </div>
    )
}

export default Title