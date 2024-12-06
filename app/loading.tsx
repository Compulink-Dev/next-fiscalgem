import React from 'react'
import Title from './_components/Title'
import { Loader } from 'lucide-react'

function Loading() {
    return (
        <div className='w-screen h-screen flex items-center justify-center bg-green-900 text-white'>
            <div className="">
                <Title />
                <Loader size={20} className='animate-spin' />
            </div>
        </div>
    )
}

export default Loading