// components/Testimonials.js
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "Fiscal Gem has revolutionized our business processes. The tools are intuitive and make our operations much smoother.",
    name: "John Doe",
    role: "CEO, Company X",
  },
  {
    text: "Their support team is always available to solve any issues. The integration with our system was seamless.",
    name: "Jane Smith",
    role: "Operations Manager, Company Y",
  },
  {
    text: "A game-changer for our reporting and analytics. I highly recommend their services to anyone looking to grow.",
    name: "Mark Brown",
    role: "Financial Analyst, Company Z",
  },
  {
    text: "Working with Fiscal Gem has significantly improved our team's productivity. Their tools are invaluable!",
    name: "Emily White",
    role: "Project Manager, Company A",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl font-semibold text-gray-800 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Our Clients Say
        </motion.h2>
        <div className="flex overflow-x-auto space-x-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="w-72 p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <p className="text-gray-600">"{testimonial.text}"</p>
              <p className="mt-4 font-semibold text-gray-800">
                {testimonial.name}
              </p>
              <p className="text-gray-500 text-xs">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
