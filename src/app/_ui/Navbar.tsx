import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white p-3 shadow-sm mb-4 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <Link
          href="/"
          className="flex items-center justify-center w-full sm:w-auto sm:mb-0"
        >
          <Image
            src="./brand-logo/dark.svg"
            alt="Showfer.ai Logo"
            width={120}
            height={30}
            className="w-[100px] h-[30px] sm:w-[120px] sm:h-[30px]"
          />
        </Link>
        <div className="justify-end items-center gap-[15px] flex">
          {/* <div className="px-5 py-2.5 bg-[#f0f2f7] rounded-md justify-center items-center gap-2.5 flex">
            <div className="text-[#6d67e4] text-sm font-medium tracking-tight">
              Sign in
            </div>
          </div>
          <div className="px-5 py-2.5 bg-[#6d67e4] rounded-md justify-center items-center gap-2.5 flex">
            <div className="text-white text-sm font-medium tracking-tight">
              Schedule a demo
            </div>
          </div> */}
          <div className="hidden sm:flex px-5 py-2.5 bg-[#6d67e4] rounded-md justify-center items-center gap-2.5">
            <div className="text-white text-sm font-medium tracking-tight">
              Coming soon
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
