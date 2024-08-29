import React, { useState } from "react";
import Lottie from "lottie-react";
import BotWindow from "./BotWindow";
import orbAnimation from "../../../../../public/playground/lottie/orb.json";
import voiceAnimation from "../../../../../public/playground/lottie/voiceanimation.json";
import voiceOrb from "../../../../../public/playground/lottie/voiceOrb.json";
import AnimatedOrb from "./AnimatedOrb";

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="absolute bottom-[70px] right-4 flex flex-col items-end">
      {isOpen && <BotWindow />}
      <button onClick={toggleChat}>
        <AnimatedOrb width={50} height={50} />
      </button>
    </div>
  );
};

export default Bot;
