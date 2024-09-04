import React, { useState } from "react";
import Lottie from "lottie-react";
import BotWindow from "./BotWindow";
import orbAnimation from "../../../../../public/playground/lottie/orb.json";
import voiceAnimation from "../../../../../public/playground/lottie/voiceanimation.json";
import voiceOrb from "../../../../../public/playground/lottie/voiceOrb.json";
import AnimatedOrb from "./AnimatedOrb";

const Bot = ({ mobile }: { mobile?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div
      className={`absolute flex flex-col items-end ${
        mobile ? "bottom-10 right-6" : "bottom-20 right-4"
      }`}
    >
      {isOpen && <BotWindow mobile={mobile} toggleChat={toggleChat} />}
      {!mobile ? (
        <button onClick={toggleChat}>
          <AnimatedOrb width={mobile ? 40 : 50} height={mobile ? 40 : 50} />
        </button>
      ) : isOpen ? null : (
        <button onClick={toggleChat}>
          <AnimatedOrb width={mobile ? 40 : 50} height={mobile ? 40 : 50} />
        </button>
      )}
    </div>
  );
};

export default Bot;
