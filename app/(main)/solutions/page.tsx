'use client'
// pages/solutions.js
import React, { useState } from 'react';
import HeroSection from './_components/HeroSection';
import SolutionCard from './_components/SolutionCard';
import WhyChooseUs from './_components/Choice';
import Testimonials from './_components/Testimonials';
import Modal from './_components/Modal';


const Solutions = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSolution, setActiveSolution] = useState(null);

    const solutions = [
        { id: 1, name: 'Odoo', description: 'Open-source suite of business apps.', details: 'Odoo offers comprehensive modules...', imgSrc: '/images/odoo.png' },
        { id: 2, name: 'Palladium', description: 'Advanced business management tool.', details: 'Palladium offers project management...', imgSrc: '/images/palladium.png' },
        { id: 3, name: 'Excel Integration', description: 'Seamlessly connect Excel with fiscal solutions.', details: 'Easily import/export fiscal data...', imgSrc: '/images/excel.png' },
    ];

    const openModal = (solution: any) => {
        setActiveSolution(solution);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setActiveSolution(null);
    };

    return (
        <div>
            <HeroSection />
            <section className="py-16 bg-green-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Solutions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {solutions.map((solution) => (
                            <SolutionCard key={solution.id} solution={solution} onClick={openModal} />
                        ))}
                    </div>
                </div>
            </section>
            <WhyChooseUs />
            <Testimonials />
            <Modal solution={activeSolution} onClose={closeModal} />
        </div>
    );
};

export default Solutions;