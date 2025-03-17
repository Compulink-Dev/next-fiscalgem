import React from "react";
import Sidebar from "../_components/Sidebar";
import Header from "../_components/Header";

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="w-42">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 flex-grow overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
