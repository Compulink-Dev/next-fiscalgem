import React from 'react'
import Sidebar from './_components/Sidebar';
import Header from './_components/Header';

function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='flex w-full h-screen' >
            <div className="w-42">
                <Sidebar />
            </div>
            <main className="flex-1 flex flex-col">
                <Header />
                <div className="p-4 flex-grow overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout