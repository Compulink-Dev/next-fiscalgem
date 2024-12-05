// components/PricingCard.js
// import { motion } from 'framer-motion';

import { Button } from "@/components/ui/button";

const PricingCard = ({ plan, onSelect }: any) => {
    return (
        <div
            className="bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
        //   onClick={() => onSelect(plan)}
        //   whileHover={{ scale: 1.05 }}
        //   whileTap={{ scale: 0.95 }}
        >
            <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{plan.name}</h3>
                <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg font-semibold text-gray-700">USD</span>
                    <span className="text-5xl font-bold text-green-600">{plan.price}</span>
                </div>
                <p className="text-sm text-gray-700 mb-6">{plan.duration}</p>
                <p className="text-xs text-gray-600 mb-8">{plan.description}</p>
                <ul className="text-left text-sm text-gray-600 space-y-3 mb-6">
                    {plan.features.map((feature: any, idx: any) => (
                        <li key={idx} className="flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 text-green-600 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12l5 5L19 7" />
                            </svg>
                            <p className="text-sm"> {feature}</p>
                        </li>
                    ))}
                </ul>
                <Button className="bg-green-600  hover:bg-green-800 transition-colors">
                    {plan.cta}
                </Button>
            </div>
        </div>
    );
};

export default PricingCard;
