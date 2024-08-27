import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PersonalityName: React.FC = () => {
  const personalities = [
    { name: "friendly", color: "#EAAF3B" },
    { name: "trustworthy", color: "#709291" },
    { name: "playful", color: "#DA884B" },
    { name: "innovative", color: "#4A959B" },
    { name: "creative", color: "#EAAF3B" },
    { name: "rugged", color: "#C8924D" },
  ];

  const cardVariants = {
    hidden: { opacity: 0, x: -50, y: 0, rotate: -8 },
    visible: { opacity: 1, x: 0, y: 0, rotate: -8 },
    exit: {
      opacity: 0,
      x: 50,
      y: 50,
      rotate: -8,
      transition: {
        duration: 0.5,
        ease: [0.45, 0, 0.55, 1],
      },
    },
  };

  const [currentPersonality, setCurrentPersonality] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPersonality((prev) => (prev + 1) % personalities.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block align-middle mr-2" style={{ height: "39px" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentPersonality}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.5,
          }}
          className="
            inline-block
            px-2.5 
            py-[5px] 
            bg-white 
            rounded-md 
            whitespace-nowrap
            shadow-[0px_0px_19.8px_0px_rgba(31,28,70,0.11),0px_0px_15px_0px_rgba(52,47,127,0.00),0px_0px_13px_0px_rgba(52,47,127,0.01),0px_0px_11px_0px_rgba(52,47,127,0.05),0px_0px_8px_0px_rgba(52,47,127,0.09),0px_0px_5px_0px_rgba(52,47,127,0.10)]"
          style={{ transform: "rotate(-8deg)" }}
        >
          <span
            className="text-xl font-medium leading-[29.23px]"
            style={{ color: personalities[currentPersonality].color }}
          >
            {personalities[currentPersonality].name}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default PersonalityName;
