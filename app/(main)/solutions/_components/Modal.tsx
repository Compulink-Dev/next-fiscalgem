// components/Modal.js
const Modal = ({ solution, onClose }: any) => {
    if (!solution) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{solution.name}</h2>
                <p className="text-gray-700">{solution.details}</p>
                <div className="mt-4">
                    <button className="bg-green-600 hover:bg-green-900 text-white py-2 px-4 rounded mr-4" onClick={onClose}>
                        Close
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-900 text-white py-2 px-4 rounded">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
