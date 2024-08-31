"use client";
import { Poppins } from "next/font/google"; // Make sure to import your Footer component
import Navbar from "./_ui/Navbar";
import Header from "./_ui/Header";
import { useState } from "react";

const inter = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [activeItem, setActiveItem] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`${inter.className} flex h-screen bg-[#F0F2F7]`}>
      <div
        className={`${
          isExpanded ? "w-64" : "w-20"
        } flex-shrink-0 pb-4 transition-all duration-300 ease-in-out`}
      >
        <Navbar
          setActiveItem={setActiveItem}
          activeItem={activeItem}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 p-4">
          <Header activeItem={activeItem} />
        </div>
        <div className="flex-1 p-4 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
