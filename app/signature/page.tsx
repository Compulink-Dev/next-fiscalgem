import React from 'react'
import ReceiptForm from '../_components/ReceiptForm'
import Title from '../_components/Title'

function Signature() {
    return (
        <div className='flex flex-col gap-8 p-8 items-center'>
            <Title />
            <div className="">
                <ReceiptForm />
            </div>
        </div>
    )
}

export default Signature