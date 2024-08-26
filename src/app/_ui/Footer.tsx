import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 p-4 mt-auto">
      <div className="mx-auto flex justify-between items-center text-sm text-gray-600 p-3">
        <div className="flex space-x-4">
          <span>©2024 Showfer.ai, Inc.</span>
          <Link href="/privacy" className="hover:text-gray-800">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-800">
            Terms
          </Link>
          <Link href="/about" className="hover:text-gray-800">
            About
          </Link>
        </div>
        <div className="flex items-center">
          <span className="mr-2">🌐</span>
          <select className="bg-transparent border-none text-gray-600 focus:outline-none">
            <option value="en">English</option>
            {/* Add more language options as needed */}
          </select>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
