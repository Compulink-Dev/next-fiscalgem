import React from 'react'

function PartnerSection() {
    const partners = ["Partner1.png", "Partner2.png", "Partner3.png", "Partner4.png"];

    return (
        <section id="partners" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Our Trusted Partners</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {partners.map((partner, index) => (
                        <div key={index}>
                            <img
                                src={`/images/${partner}`}
                                alt={`Logo of ${partner}`}
                                className="mx-auto h-16"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PartnerSection