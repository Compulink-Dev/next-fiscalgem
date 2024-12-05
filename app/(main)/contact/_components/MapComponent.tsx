import React from 'react'

function MapComponent({ locationUrl }: any) {
    return (
        <div className="w-full h-96">
            <iframe
                src={locationUrl}
                width={'100%'}
                height={'100%'}
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
            ></iframe>
        </div>
    )
}

export default MapComponent