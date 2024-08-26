import React from "react";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 rounded-lg h-full">
      <div className="h-full mx-auto px-4 sm:px-6 lg:px-8 py-24 flex justify-between items-center">
        <div className="">
          <div className="flex">
            <Image
              src="/hero/ai.svg"
              alt="AI"
              width={40}
              height={40}
              className="mr-4"
            />
            <div className="text-[48px] font-[600]">
              <span className="text-[#6d67e4]">Mascot</span> for your brand
            </div>
          </div>
          <div className="mt-6 text-xl text-[#8F93A5] font-[400]">
            Give a{" "}
            <div
              className="
              h-[39px] 
              px-2.5 
              py-[5px] 
              origin-top-left 
              rotate-[-8deg] 
              bg-white 
              rounded-md 
              justify-center 
              items-center 
              gap-2.5 
              inline-flex mr-2 
              shadow-[0px_0px_19.8px_0px_rgba(31,28,70,0.11),0px_0px_15px_0px_rgba(52,47,127,0.00),0px_0px_13px_0px_rgba(52,47,127,0.01),0px_0px_11px_0px_rgba(52,47,127,0.05),0px_0px_8px_0px_rgba(52,47,127,0.09),0px_0px_5px_0px_rgba(52,47,127,0.10)]"
            >
              <div className="text-[#eaaf3b] text-xl font-medium leading-[29.23px]">
                friendly
              </div>
            </div>{" "}
            personality to your website
          </div>
          <div className="mt-20 space-x-4 flex">
            <a
              href="#schedule-demo"
              className="px-5 py-2.5 bg-[#6d67e4] rounded-md justify-center items-center gap-2.5 flex text-white"
            >
              Schedule a demo
            </a>
            <a
              href="#sign-up"
              className="px-5 py-2.5 bg-[#f0f2f7] rounded-md justify-center items-center gap-2.5 flex text-[#6d67e4]"
            >
              Sign up for free
            </a>
          </div>
        </div>
        <div className="hidden md:block">
          <Image
            src="/hero/mascot-1.png"
            alt="AI Mascot"
            width={550}
            height={550}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
