import React from 'react'

function BenefitsSection() {
    const benefits = [
        { title: "Save Time", description: "Automate manual fiscal processes." },
        { title: "Ensure Compliance", description: "Stay updated with tax regulations." },
        { title: "Boost Efficiency", description: "Streamline operations and reporting." },
    ];

    return (
        <section id="benefits" className="py-16 bg-blue-50">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Why Choose Fiscal Gem?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                        >
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">{benefit.title}</h3>
                            <p className="text-gray-600 text-sm">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default BenefitsSection;