import React from 'react'
import Sidebar from './_components/Sidebar';
import Header from './_components/Header';

function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='flex w-full' >
            <div className="">
                <Sidebar />
            </div>
            <main className="flex-1">
                <Header />
                <div className="p-4">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout