import React from "react";
import Navbar from "../_ui/Navbar";
import Image from "next/image";

export default function PrivacyPolicy() {
  return (
    <main className="flex flex-col min-h-screen h-screen p-4">
      <Navbar />
      <div className="bg-white text-gray-900 rounded-lg h-full">
        <div className="h-full mx-auto px-24 py-24 flex flex-col items-center">
          <div className="text-5xl mb-[45px]">Privacy Policy</div>
        </div>
      </div>
    </main>
  );
}
