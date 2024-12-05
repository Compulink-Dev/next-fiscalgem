// components/WhyChooseUs.js
const WhyChooseUs = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8">Why Choose Us?</h2>
                <div className="flex flex-wrap justify-center md:space-x-8">
                    <div className="w-full md:w-1/3 mb-8">
                        <div className="bg-gradient-to-r from-green-400 via-green-500 to-green-800 text-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all">
                            <h3 className="text-2xl font-semibold">Customizable Solutions</h3>
                            <p className="mt-2">Tailored to fit your business needs and scalable as you grow.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 mb-8">
                        <div className="bg-gradient-to-r from-green-400 via-green-500 to-green-800 text-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all">
                            <h3 className="text-2xl font-semibold">Seamless Integration</h3>
                            <p className="mt-2">Easily integrate with your existing systems for a smooth workflow.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 mb-8">
                        <div className="bg-green-700 text-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all">
                            <h3 className="text-2xl font-semibold">Expert Support</h3>
                            <p className="mt-2">Our dedicated support team is here to assist you at every step.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;