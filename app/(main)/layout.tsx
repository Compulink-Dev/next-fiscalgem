import type { Metadata } from "next";;
import { Toaster } from "react-hot-toast";
import Header from "../_components/Header";
import Footer from "../_components/Footer";



export const metadata: Metadata = {
  title: "FiscalGem",
  description: "FiscalGem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      {/* Header */}
      <Header />
      {children}
      {/* Footer */}
      <Footer />
      <Toaster />
    </div>
  );
}
