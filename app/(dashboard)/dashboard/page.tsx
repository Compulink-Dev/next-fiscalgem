'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Card } from '@/components/ui/card';

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function Dashboard() {
    // Sample data for the dashboard
    const stats = {
        totalReceipts: 120,
        submittedInvoices: 85,
        storedInvoices: 100,
        issuedInvoices: 95,
    };

    // Data for the bar chart
    const barChartData = {
        labels: ['Receipts', 'Submitted Invoices', 'Stored Invoices', 'Issued Invoices'],
        datasets: [
            {
                label: 'Count',
                data: [
                    stats.totalReceipts,
                    stats.submittedInvoices,
                    stats.storedInvoices,
                    stats.issuedInvoices,
                ],
                backgroundColor: ['#34D399', '#059669', '#F87171', '#059669'],
                borderColor: ['#059669', '#34D399', '#DC2626', '#34D399'],
                borderWidth: 1,
            },
        ],
    };

    // Bar chart options
    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Statistics Overview',
            },
        },
    };

    return (
        <div className="">
            <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Card className="p-4 flex flex-col items-center">
                    <p className="text-sm font-semibold">Receipts</p>
                    <p className="text-2xl font-bold text-green-600">{stats.totalReceipts}</p>
                </Card>
                <Card className="p-4 flex flex-col items-center">
                    <p className="text-sm font-semibold">Submitted Invoices</p>
                    <p className="text-2xl font-bold text-green-900">{stats.submittedInvoices}</p>
                </Card>
                <Card className="p-4 flex flex-col items-center">
                    <p className="text-sm font-semibold">Stored Invoices</p>
                    <p className="text-2xl font-bold text-red-600">{stats.storedInvoices}</p>
                </Card>
                <Card className="p-4 flex flex-col items-center">
                    <p className="text-sm font-semibold">Issued Invoices</p>
                    <p className="text-2xl font-bold text-green-700">{stats.issuedInvoices}</p>
                </Card>
            </div>

            {/* Bar Chart */}
            <div className=" bg-white shadow rounded-lg">
                <Bar data={barChartData} options={barChartOptions} />
            </div>
        </div>
    );
}

export default Dashboard;
