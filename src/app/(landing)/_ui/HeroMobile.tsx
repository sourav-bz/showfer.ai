"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PersonalityName from "./PersonalityName";
import { PopupButton } from "react-calendly";

export default function HeroMobile() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/hero/personality-1-friendly.svg",
    "/hero/personality-2-trustworthy.svg",
    "/hero/personality-3-playful.svg",
    "/hero/personality-4-innovative.svg",
    "/hero/personality-5-creative.svg",
    "/hero/personality-6-rugged.svg",
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
    <div>
      <div
        className="flex flex-col items-center justify-center bg-white rounded-lg px-[24px] py-[24px]"
        style={{ height: "78vh" }}
      >
        <div className="flex flex-wrap items-center text-[34px] font-[600] mb-[33px]">
          <div className="inline-flex flex-wrap items-center justify-center">
            <Image
              src="/hero/ai.svg"
              alt="AI"
              width={25}
              height={28}
              className="mr-2 flex-shrink-0"
            />
            <span className="text-[#6d67e4] inline-block">mascot</span>
            {" for your brand".split(" ").map((word, index) => (
              <span key={index} className="text-black inline-block ml-1">
                {word}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-2 flex flex-wrap items-center justify-center w-full text-[18px] text-[#8F93A5] leading-[35px]">
          <span className="inline-block mr-2">Give a</span>
          <PersonalityName isMobile />
          {" personality to your website with Showfer.ai"
            .split(" ")
            .map((word, index) => (
              <span key={index} className="inline-block ml-1">
                {word}
              </span>
            ))}
        </div>
        <div className="relative flex-grow w-full">
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
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <Image
                  src={images[currentImage]}
                  alt={`Image ${currentImage + 1}`}
                  width={600}
                  height={600}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center justify-center w-full bg-white rounded-lg mt-4 p-4">
        <a
          href="/signup"
          className="px-5 py-2.5 bg-[#6d67e4] rounded-md justify-center items-center gap-2.5 flex text-white mr-4"
        >
          Early access
        </a>
        <a className="px-5 py-2.5 bg-[#f0f2f7] rounded-md justify-center items-center gap-2.5 flex text-[#6d67e4]">
          <PopupButton
            url="https://calendly.com/showfer-support/demo"
            text="Schedule a demo"
            rootElement={document.body}
          />
        </a>
      </div>
    </div>
  );
}
