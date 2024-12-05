// components/SolutionCard.js
// import { motion } from 'framer-motion';

const SolutionCard = ({ solution, onClick }: any) => {
    return (
        <div
            className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer overflow-hidden"
        //   onClick={() => onClick(solution)}
        //   whileHover={{ scale: 1.05 }}
        //   whileTap={{ scale: 0.95 }}
        >
            <img src={solution.imgSrc} alt={solution.name} className="w-full h-56 object-cover rounded-t-lg transition-transform duration-300" />
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{solution.name}</h3>
                <p className="text-gray-600 mt-2">{solution.description}</p>
            </div>
        </div>
    );
}

export default SolutionCard;
