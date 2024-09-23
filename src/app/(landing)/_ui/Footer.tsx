import React from "react";
import Link from "next/link";
import { VscGlobe } from "react-icons/vsc";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 p-4 mt-auto">
      <div className="w-full flex flex-col items-center">
        <Image
          src="/brand-logo/dark.svg"
          alt="Showfer.ai Logo"
          width={120}
          height={30}
          className="mb-6 sm:mb-[30px]" // Adjusted margin for mobile
        />
        {/* Updated flex layout and text size for mobile */}
        <div className="flex flex-wrap justify-center text-black text-sm sm:text-[16px] mb-6 sm:mb-[30px]">
          <a href="/terms-and-conditions" className="mx-2 my-1 sm:mr-[50px]">
            Terms & Conditions
          </a>
          <a href="/privacy-policy" className="mx-2 my-1 sm:mr-[50px]">
            Privacy
          </a>
          <a href="/terms-and-conditions" className="mx-2 my-1 sm:mr-[50px]">
            Refund Policy
          </a>
          <a href="/contact-us" className="mx-2 my-1">
            Contact Us
          </a>
        </div>
      </div>

      {/* Updated layout for mobile */}
      <div className="mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 p-3">
        <div className="flex space-x-4 text-[#8F93A5] mb-2 sm:mb-0">
          <span>© Showfer.ai 2024 . All rights reserved.</span>
        </div>
        <div className="flex items-center">
          <span className="mr-1">
            <VscGlobe className="text-[16px] sm:text-[20px]" />{" "}
            {/* Adjusted icon size */}
          </span>
          <select className="bg-transparent border-none text-[#8F93A5] focus:outline-none font-normal text-xs sm:text-sm">
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
