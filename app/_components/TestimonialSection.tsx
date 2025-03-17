"use client";
import { motion } from "framer-motion";
import React from "react";

function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "Fiscal Gem transformed our business operations! Their real-time reporting is a game changer.",
      author: "John Doe",
      role: "CEO, BusinessCorp",
    },
    {
      quote:
        "Their support team is amazing. They guided us every step of the way!",
      author: "Jane Smith",
      role: "Finance Manager, Retailify",
    },
    {
      quote:
        "Compliance has never been easier. Highly recommend for businesses of all sizes.",
      author: "Sarah Wilson",
      role: "Founder, StartupCo",
    },
  ];

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <motion.div
        className="max-w-7xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-600 italic mb-4 text-sm">
                &quot;{testimonial.quote}&quot;
              </p>
              <p className="text-gray-800 font-semibold">
                {testimonial.author}
              </p>
              <p className="text-gray-500 text-xs">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default TestimonialSection;
