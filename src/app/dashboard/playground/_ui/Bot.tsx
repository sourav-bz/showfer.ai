import React, { useState } from "react";
import Image from "next/image";
import BotWindow from "./BotWindow";

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="absolute bottom-[70px] right-4 flex flex-col items-end">
      {isOpen && <BotWindow />}
      <button onClick={toggleChat}>
        <Image
          src={"./playground/orb.svg"}
          width={50}
          height={50}
          alt="chat-icon"
        />
      </button>
    </div>
  );
};

export default Bot;
