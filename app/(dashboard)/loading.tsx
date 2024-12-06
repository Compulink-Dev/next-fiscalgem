import React from 'react'
import { Loader } from 'lucide-react'
import Title from '../_components/Title'

function Loading() {
    return (
        <div className='w-screen h-screen flex items-center justify-center bg-green-900 text-white'>
            <div className="">
                <Title />
                <Loader size={20} className='animate-spin text-center' />
            </div>
        </div>
    )
}

export default Loading