// components/CallToAction.js
import Link from 'next/link';

const CallToAction = () => {
    return (
        <section className="bg-green-800 text-white py-16 text-center">
            <h2 className="text-4xl font-semibold mb-6">Ready to Take Your Business to the Next Level?</h2>
            <p className="text-lg mb-8">Sign up now and start experiencing the benefits of a modern, secure, and efficient platform designed for growth.</p>
            <Link href="/contact">
                <button className="bg-white text-green-800 py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                    Contact Sales
                </button>
            </Link>
        </section>
    );
};

export default CallToAction;
