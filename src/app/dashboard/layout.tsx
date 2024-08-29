import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Make sure to import your Footer component
import Navbar from "./_ui/Navbar";
import Header from "./_ui/Header";
import Playground from "./playground/page";

const inter = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Showfer.ai - AI mascot for your brand",
  description: "Give a personality to your brand with Showfer.ai",
  icons: {
    icon: "/icon.ico",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${inter.className} flex flex-col min-h-screen bg-[#F0F2F7]`}
    >
      <div className="grid grid-cols-12 gap-2 h-screen p-4">
        <div className="col-span-2 h-full rounded-md">
          <Navbar />
        </div>
        <div className="col-span-10 h-full rounded-md">
          <div className="grid grid-row-12 gap-2 h-full">
            <div className="row-span-1">
              <Header />
            </div>
            <div className="row-span-11 rounded-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
