// components/PricingSection.js

import PricingCard from "./PricingCard";

const PricingSection = ({ onSelectPlan }: any) => {
    const plans = [
        {
            name: 'Enterprise',
            price: '24.99',
            duration: 'per month',
            description: 'For the ultimate experience, we have engineered a software that is reliable, secure, and efficient in data processing and reporting. Suitable for businesses that want to outperform the competition.',
            features: ['Advanced Reporting', 'Unlimited Users', '24/7 Priority Support', 'Custom Integrations'],
            cta: 'Sign Up Now',
        },
        {
            name: 'Pro',
            price: '14.99',
            duration: 'per month',
            description: 'A powerful plan designed for growing businesses, offering enhanced features for optimal performance and scalability.',
            features: ['Enhanced Reporting', '5 User Licenses', 'Priority Support', 'Basic Integrations'],
            cta: 'Get Started',
        },
        {
            name: 'Basic',
            price: '7.99',
            duration: 'per month',
            description: 'Perfect for small businesses or individuals, offering basic features to help you manage and track your data with ease.',
            features: ['Basic Reporting', '1 User License', 'Standard Support'],
            cta: 'Try for Free',
        },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">Choose Your Plan</h2>
                <p className=" text-gray-600 mb-12">Select the best plan that suits your business needs.</p>

                {/* Flexbox container for cards */}
                <div className="flex flex-wrap justify-center gap-8">
                    {plans.map((plan, idx) => (
                        <div key={idx} className="w-full sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4">
                            <PricingCard plan={plan} onSelect={onSelectPlan} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
