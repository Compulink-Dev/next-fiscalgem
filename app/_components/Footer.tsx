"use client";
import React from "react";
import { Facebook, Twitter, Linkedin, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Title from "./Title";

function Footer() {
  return (
    <footer className="bg-green-900 text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title />
          <p className="text-sm text-gray-300">
            Leading the way in fiscal compliance and automation.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="#features" className="hover:text-green-400">
                Features
              </a>
            </li>
            <li>
              <a href="#benefits" className="hover:text-green-400">
                Benefits
              </a>
            </li>
            <li>
              <a href="#testimonials" className="hover:text-green-400">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-green-400">
                Contact
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-xl font-bold mb-3">Contact Us</h2>
          <p className="flex items-center justify-center md:justify-start space-x-2">
            <Mail size={18} /> <span>info@fiscalgem.com</span>
          </p>
          <p className="flex items-center justify-center md:justify-start space-x-2 mt-2">
            <Phone size={18} /> <span>+(263) 24 249 4407</span>
          </p>
        </motion.div>
      </div>

      {/* Social Media */}
      <motion.div
        className="flex justify-center space-x-6 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <a href="#" className="hover:text-green-400">
          <Facebook size={24} />
        </a>
        <a href="#" className="hover:text-green-400">
          <Twitter size={24} />
        </a>
        <a href="#" className="hover:text-green-400">
          <Linkedin size={24} />
        </a>
      </motion.div>

      {/* Copyright */}
      <p className="text-center text-gray-400 text-sm mt-6">
        &copy; 2025 Fiscal Gem. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
