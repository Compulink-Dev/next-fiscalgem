"use client";
import { ChartBar, Cog, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <motion.div
        className="max-w-7xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          Our Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<Cog size={40} className="text-green-600" />}
            title="Odoo Integration"
            description="Seamless fiscalization for Odoo systems."
          />
          <FeatureCard
            icon={<ChartBar size={40} className="text-green-600" />}
            title="Real-Time Reporting"
            description="Monitor and report compliance data instantly."
          />
          <FeatureCard
            icon={<Handshake size={40} className="text-green-600" />}
            title="Dedicated Support"
            description="24/7 expert support for all your fiscal needs."
          />
        </div>
      </motion.div>
    </section>
  );
}

const FeatureCard = ({ icon, title, description }: any) => (
  <motion.div
    className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
    whileHover={{ scale: 1.05 }}
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

export default FeaturesSection;
