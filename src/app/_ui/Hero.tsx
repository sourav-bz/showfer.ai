"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import PersonalityName from "./PersonalityName";
import { IoCheckbox } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

const Hero: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/hero/personality-1-friendly.png",
    "/hero/personality-2-trustworthy.png",
    "/hero/personality-3-playful.png",
    "/hero/personality-4-innovative.png",
    "/hero/personality-5-creative.png",
    "/hero/personality-6-rugged.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % 6);
    }, 3500); // Change image every 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  const imageVariants = {
    hidden: { opacity: 0, x: "100%", scale: 0.5 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: "100%", scale: 0.5 },
  };

  return (
    <div className="bg-white text-gray-900 rounded-lg h-full">
      <div className="h-full mx-auto px-24 py-24 grid grid-cols-5">
        <div className="col-span-3">
          <div className="flex flex-col h-full justify-center">
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
            <div className="text-[48px] font-[600] mb-[15px]">
              custom <span className="text-[#6d67e4]">AI</span> features
            </div>
            <div className="mt-6 text-xl text-[#8F93A5] font-[400] max-w-[700px] mb-[76px]">
              <div className="mb-2 flex items-center">
                <div className="mr-2">Give a </div>
                <PersonalityName />{" "}
                <div>personality to your website with Showfer.ai</div>
              </div>
              <div>where AI brings personality to your digital experience.</div>
            </div>
            <div className="mt-8 flex max-w-[700px] overflow flex-wrap">
              {[
                "Personalized onboarding",
                "Realistic Personalities",
                "Friendly pricing as you scale",
                "7 days free trail",
                "Cancel anytime",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 mr-[20px] py-[10px] mb-[10px]"
                >
                  <IoCheckbox className="h-5 w-5 text-[#6d67e4]" />
                  <span className="text-base text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-20 space-x-4 flex">
              <a
                href="#schedule-demo"
                className="px-5 py-2.5 bg-[#6d67e4] rounded-md justify-center items-center gap-2.5 flex text-white"
              >
                Coming soon
              </a>
            </div>
            {/* <div className="mt-20 space-x-4 flex">
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
            </div> */}
          </div>
        </div>
        <div className="hidden md:block col-span-2">
          <div className="flex flex-col h-full justify-center">
            <div className="relative flex items-center justify-center h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.5,
                  }}
                  className="absolute w-full h-[700px] rounded-lg overflow-hidden"
                >
                  <Image
                    src={images[currentImage]}
                    alt={`Image ${currentImage + 1}`}
                    width={600}
                    height={600}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
