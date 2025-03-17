// components/WhyChooseUs.js
import { motion } from "framer-motion";

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl font-semibold text-gray-800 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Why Choose Us?
        </motion.h2>
        <div className="flex flex-wrap justify-center md:space-x-8">
          {[
            "Customizable Solutions",
            "Seamless Integration",
            "Expert Support",
          ].map((title, index) => (
            <motion.div
              key={index}
              className="w-full md:w-1/3 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="bg-gradient-to-r from-green-400 via-green-500 to-green-800 text-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-all">
                <h3 className="text-2xl font-semibold">{title}</h3>
                <p className="mt-2">
                  {title === "Customizable Solutions"
                    ? "Tailored to fit your business needs and scalable as you grow."
                    : title === "Seamless Integration"
                    ? "Easily integrate with your existing systems for a smooth workflow."
                    : "Our dedicated support team is here to assist you at every step."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
