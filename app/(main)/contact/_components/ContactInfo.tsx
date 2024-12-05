import { Clock, Mail, MapPinCheck, Phone } from "lucide-react";
import React from "react";


function ContactInfo() {
    return (
        <div className="bg-white p-8 text-gray-800 w-full">
            <h2 className="text-2xl font-semibold text-center mb-8">Contact Information</h2>
            <ul className="space-y-6 max-w-3xl mx-auto">
                <li className="flex items-start p-4 border-b border-gray-200">
                    <Phone className="text-green-600 mr-4 mt-1" />
                    <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600 text-sm">+123 456 7890</p>
                    </div>
                </li>
                <li className="flex items-start p-4 border-b border-gray-200">
                    <Mail className="text-green-600 mr-4 mt-1 " />
                    <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600 text-sm">contact@fiscalgem.com</p>
                    </div>
                </li>
                <li className="flex items-start p-4 border-b border-gray-200">
                    <MapPinCheck className="text-green-600 mr-4 mt-1 " />
                    <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600 text-sm">123 Fiscal Gem Street, Tech City</p>
                    </div>
                </li>
                <li className="flex items-start p-4">
                    <Clock className="text-green-600 mr-4 mt-1" />
                    <div>
                        <p className="font-medium">Business Hours</p>
                        <p className="text-gray-600 text-sm">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default ContactInfo;