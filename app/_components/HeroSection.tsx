"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";

function HeroSection() {
  return (
    <section className="relative flex items-center justify-center text-center min-h-screen overflow-hidden bg-gradient-to-br from-green-700 via-green-900 to-green-700 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,100,0,0.4)_0%,_rgba(0,0,0,0)_100%)] animate-pulse" />

      <div className="relative z-10 max-w-3xl px-6">
        {/* Animated Heading */}
        <motion.h2
          className="text-5xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Empower Your Business with <br />
          <span className="text-green-300">Smart Fiscal Solutions</span>
        </motion.h2>

        {/* Animated Subtext */}
        <motion.p
          className="text-xl md:text-2xl mb-8 opacity-80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Manage your fiscal devices and tax compliance effortlessly.
        </motion.p>

        {/* Animated Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button className="bg-green-500 hover:bg-green-700 px-6 py-3 text-lg font-medium shadow-lg transition-all duration-300">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
