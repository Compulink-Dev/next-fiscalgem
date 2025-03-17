"use client";
import { motion } from "framer-motion";
import React from "react";

function AboutSection() {
  return (
    <section id="about" className="py-16 bg-blue-50">
      <motion.div
        className="max-w-5xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          About Fiscal Gem
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          At Fiscal Gem, we specialize in providing modern, efficient solutions
          to streamline fiscal compliance and device operations for businesses
          of all sizes.
        </p>
      </motion.div>
    </section>
  );
}

export default AboutSection;
