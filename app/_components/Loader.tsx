import React from 'react'
import { Loader } from 'lucide-react';

function Spin() {
    return (
        <div className="flex gap-2 items-center text-green-600 text-sm">
            <Loader size={18} className='animate-spin' />
            <p>Loading...</p>
        </div>
    )
}

export default Spin