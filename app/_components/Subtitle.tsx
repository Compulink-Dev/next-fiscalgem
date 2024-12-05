import React from 'react'

function Subtitle({ name }: { name: string }) {
    return (
        <div>
            <p className="text-lg font-bold text-green-700">{name}</p>
        </div>
    )
}

export default Subtitle