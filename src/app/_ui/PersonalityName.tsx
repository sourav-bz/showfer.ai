import { Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";

const PersonalityName: React.FC = () => {
  const personalities = [
    { name: "friendly", color: "#EAAF3B" },
    { name: "trustworthy", color: "#709291" },
    { name: "playful", color: "#DA884B" },
    { name: "innovative", color: "#4A959B" },
    { name: "creative", color: "#EAAF3B" },
    { name: "rugged", color: "#C8924D" },
  ];

  const [currentPersonality, setCurrentPersonality] = useState(0);
  const [isShowing, setIsShowing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPersonality((prev) => (prev + 1) % personalities.length); // Half of the interval for smooth transition
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
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
      <Transition
        show={isShowing}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`text-xl font-medium leading-[29.23px]`}
          style={{ color: personalities[currentPersonality].color }}
        >
          {personalities[currentPersonality].name}
        </div>
      </Transition>
    </div>
  );
};

export default PersonalityName;
