import React from "react";
import Navbar from "../_ui/Navbar";

export default function ContactUs() {
  return (
    <main className="flex flex-col min-h-screen h-screen p-4">
      <Navbar />
      <div className="bg-white text-gray-900 rounded-lg h-full">
        <div className="h-full mx-auto px-24 py-24 grid grid-cols-5">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Get in touch</h2>
            <p className="mb-2">
              We&apos;d love to hear from you! You can reach us at:
            </p>
            <a
              href="mailto:contact@example.com"
              className="text-blue-600 hover:text-blue-800 text-lg font-medium"
            >
              contact@example.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
