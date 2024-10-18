// components/ItemTable.tsx
import React from 'react';

interface Item {
    code: string;
    description: string;
    quantity: number;
    price: number;
    vat: number;
}

interface Props {
    items: Item[];
    totalAmount: number;
    totalVat: number;
}

const ItemTable: React.FC<Props> = ({ items, totalAmount, totalVat }) => {
    return (
        <div className="container mx-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Code</th>
                        <th className="border border-gray-300 px-4 py-2">Description</th>
                        <th className="border border-gray-300 px-4 py-2">Quantity</th>
                        <th className="border border-gray-300 px-4 py-2">Price</th>
                        <th className="border border-gray-300 px-4 py-2">VAT</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className="text-center">
                            <td className="border border-gray-300 px-4 py-2">{item.code}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.price.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.vat.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2" colSpan={3}>Total Amount</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{totalAmount.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{totalVat.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ItemTable;
