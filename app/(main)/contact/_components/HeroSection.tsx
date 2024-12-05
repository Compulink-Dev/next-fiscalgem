import { Button } from "@/components/ui/button";
import React from "react";

function HeroSection() {
    return (
        <div className="bg-green-500 text-white py-40 px-4 min-h-1/2screen flex items-center">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-5xl font-bold mb-4">Get in Touch with Us</h1>
                <p className="text-lg mb-8">
                    Have questions or need assistance? We're here to help! Reach out to us anytime.
                </p>
                <Button
                    className="bg-white text-green-500 hover:bg-gray-200 transition-transform transform hover:scale-105"
                >
                    Contact Us
                </Button>
            </div>
        </div>
    );
}

export default HeroSection;