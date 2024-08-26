import React from "react";
import Link from "next/link";
import { VscGlobe } from "react-icons/vsc";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 p-4 mt-auto">
      <div className="w-full flex flex-col items-center">
        <Image
          src="./brand-logo/dark.svg"
          alt="Showfer.ai Logo"
          width={120}
          height={30}
          className="mb-[30px]"
        />
        <div className="flex text-black text-[16px] mb-[30px]">
          <a href="/terms-and-conditions" className="mr-[50px]">
            Terms & Conditions
          </a>
          <a href="/privay-policy" className="mr-[50px]">
            Privacy
          </a>
          <a href="/refund-policy" className="mr-[50px]">
            Refund Policy
          </a>
          <a href="/contact-us">Contact Us</a>
        </div>
      </div>

      <div className="mx-auto flex justify-between items-center text-sm text-gray-600 p-3">
        <div className="flex space-x-4 text-[#8F93A5]">
          <span>© Showfer.ai 2024 . All rights reserved.</span>
        </div>
        <div className="flex items-center">
          <span className="mr-1">
            <VscGlobe className="text-[20px]" />
          </span>
          <select className="bg-transparent border-none text-[#8F93A5] focus:outline-none font-normal">
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
