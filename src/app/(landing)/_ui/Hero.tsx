"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import PersonalityName from "./PersonalityName";
import { IoCheckbox } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import loaderAnimation from "../../../../public/loader/loader-logo.json";
import { useLandingStore } from "../_store/landingStore";
import dynamic from "next/dynamic";

const DynamicPopupButton = dynamic(
  () => import("react-calendly").then((mod) => mod.PopupButton),
  { ssr: false }
);

const Hero: React.FC = () => {
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
          const img = new window.Image();
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
            // reject(error);
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
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const interval = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [isLoaded, images.length]);

  const imageVariants = {
    hidden: { opacity: 0, x: "100%", scale: 0.5 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: "100%", scale: 0.5 },
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        {/* {isMounted && typeof document !== "undefined" && (
          <div className="w-[400px] h-[400px]">
            <Lottie animationData={loaderAnimation} loop={true} />
          </div>
        )} */}
        <Image
          src="./brand-logo/dark.svg"
          alt="Showfer.ai Logo"
          width={320}
          height={50}
          className="mb-8"
        />
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 rounded-lg h-full">
      <div className="h-full mx-auto px-6 py-12 flex w-full">
        <div className="w-[60%] px-[40px]">
          <div className="flex flex-col h-full justify-center">
            <div className="flex text-[48px] font-[600] flex-wrap mb-[15px] max-w-[650px]">
              {"Drive your Sales using an".split(" ").map((word, index) => (
                <span key={index} className="ml-2">
                  {word}
                </span>
              ))}
              <Image
                src="/hero/ai.svg"
                alt="AI"
                width={40}
                height={40}
                className="ml-2"
              />
              <span className="text-[#6d67e4] ml-4">Mascot</span>
            </div>
            <div className="mt-6 text-xl text-[#8F93A5] font-[400] max-w-[650px] mb-[76px]">
              <div className="mb-2 flex items-center flex-wrap leading-[35px]">
                <span className="mr-2">Give a</span>
                <PersonalityName isMobile={false} />
                {" personality to your website with Showfer.ai where AI brings personality to your digital experience."
                  .split(" ")
                  .map((word, index) => (
                    <span key={index} className="ml-1">
                      {word}
                    </span>
                  ))}
              </div>
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
                href="/signup"
                className="px-5 py-2.5 bg-[#6d67e4] rounded-md justify-center items-center gap-2.5 flex text-white"
              >
                Early access
              </a>
              <a className="px-5 py-2.5 bg-[#f0f2f7] rounded-md justify-center items-center gap-2.5 flex text-[#6d67e4]">
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
        </div>
        <div className="relative h-full w-[40%]">
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
              <div className="w-full h-full flex items-center overflow-hidden">
                <Image
                  src={images[currentImage]}
                  alt={`Image ${currentImage + 1}`}
                  width={700}
                  height={700}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Hero;
