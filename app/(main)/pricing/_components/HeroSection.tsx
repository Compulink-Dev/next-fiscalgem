// components/HeroSection.js
import { Button } from '@/components/ui/button';
import React from 'react';

const HeroSection = () => {
    return (
        <section className="bg-green-500 text-white h-[70vh] py-20 flex items-center">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h1 className="text-5xl font-bold mb-4">Welcome to Our Pricing Page</h1>
                <p className="text-xl mb-8">
                    Find the perfect plan for your business, with flexible pricing and no hidden fees.
                </p>
                <Button className="bg-white text-green-500  hover:bg-gray-200 transition">
                    Explore Plans
                </Button>
            </div>
        </section>
    );
};

export default HeroSection;
