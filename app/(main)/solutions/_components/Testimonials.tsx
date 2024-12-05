// components/Testimonials.js
const Testimonials = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8">What Our Clients Say</h2>
                <div className="flex overflow-x-auto space-x-8">
                    <div className="w-72 p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-all">
                        <p className="text-gray-600">"Fiscal Gem has revolutionized our business processes. The tools are intuitive and make our operations much smoother."</p>
                        <p className="mt-4 font-semibold text-gray-800">John Doe</p>
                        <p className="text-gray-500">CEO, Company X</p>
                    </div>
                    <div className="w-72 p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-all">
                        <p className="text-gray-600">"Their support team is always available to solve any issues. The integration with our system was seamless."</p>
                        <p className="mt-4 font-semibold text-gray-800">Jane Smith</p>
                        <p className="text-gray-500">Operations Manager, Company Y</p>
                    </div>
                    <div className="w-72 p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-all">
                        <p className="text-gray-600">"A game-changer for our reporting and analytics. I highly recommend their services to anyone looking to grow."</p>
                        <p className="mt-4 font-semibold text-gray-800">Mark Brown</p>
                        <p className="text-gray-500">Financial Analyst, Company Z</p>
                    </div>
                    <div className="w-72 p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-all">
                        <p className="text-gray-600">"Working with Fiscal Gem has significantly improved our team's productivity. Their tools are invaluable!"</p>
                        <p className="mt-4 font-semibold text-gray-800">Emily White</p>
                        <p className="text-gray-500">Project Manager, Company A</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
