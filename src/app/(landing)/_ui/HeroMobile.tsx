"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PersonalityName from "./PersonalityName";
import dynamic from "next/dynamic";
import Lottie from "lottie-react";
import loaderAnimation from "../../../../public/loader/loader-logo.json";
import { useLandingStore } from "../_store/landingStore";

const DynamicPopupButton = dynamic(
  () => import("react-calendly").then((mod) => mod.PopupButton),
  { ssr: false }
);

export default function HeroMobile() {
  const [currentImage, setCurrentImage] = useState(0);
  const { isLoaded, setIsLoaded } = useLandingStore();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const images = [
    "/hero/personality-1-friendly.svg",
    "/hero/personality-2-trustworthy.svg",
    "/hero/personality-3-playful.svg",
    "/hero/personality-4-innovative.svg",
    "/hero/personality-5-creative.svg",
    "/hero/personality-6-rugged.svg",
  ];

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      let loadedCount = 0;
      const imagePromises = images.map((src, index) => {
        return new Promise<void>((resolve, reject) => {
          const img = new window.Image(); // Use window.Image instead of Image
          img.src = src;
          img.onload = () => {
            loadedCount++;
            setLoadingProgress((loadedCount / images.length) * 100);
            // console.log(
            //   `Image ${index + 1} loaded. Progress: ${loadedCount}/${
            //     images.length
            //   }`
            // );
            resolve();
          };
          img.onerror = (error) => {
            // console.error(`Failed to load image ${index + 1}:`, src, error);
            reject(error);
          };
        });
      });

      try {
        await Promise.all(imagePromises);
        // console.log("All images loaded successfully");
        setIsLoaded(true);
      } catch (error) {
        // console.error("Failed to load all images:", error);
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const interval = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [isLoaded, images.length]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const imageVariants = {
    hidden: { opacity: 0, x: "100%", scale: 0.5 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: "100%", scale: 0.5 },
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {/* {isMounted && typeof document !== "undefined" && (
          <div className="w-[250px] h-[250px]">
            <Lottie animationData={loaderAnimation} loop={true} />
          </div>
        )} */}
        <Image
          src="./brand-logo/dark.svg"
          alt="Showfer.ai Logo"
          width={220}
          height={40}
          className="mb-4"
        />
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

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
          className="py-2.5 bg-[#6d67e4] rounded-md justify-center items-center gap-2.5 flex flex-1 text-white mr-4"
        >
          Early access
        </a>
        <a className="py-2.5 bg-[#f0f2f7] rounded-md justify-center items-center gap-2.5 flex flex-1 text-[#6d67e4]">
          {isMounted && typeof document !== "undefined" && (
            <DynamicPopupButton
              url="https://calendly.com/showfer-support/demo"
              text="Schedule a demo"
              rootElement={document.body}
            />
          )}
        </a>
      </div>
    </div>
  );
}
