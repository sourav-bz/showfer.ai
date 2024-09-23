"use client";
import CircularProgress from "@/app/_ui/CircularProgress";
import IconSVG from "@/app/_ui/IconSvg";
import Image from "next/image";
import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const UsageCard = ({ title, used, total, percentage }) => (
  <div
    className={`bg-[#F0F2F7] p-[30px] rounded-[10px] flex-1 ${
      title === "Messages usage" ? "mr-[15px]" : ""
    }`}
  >
    <div className="flex justify-between items-center">
      <div className="flex flex-col flex-1">
        <div className="text-sm text-gray-500 mb-[10px]">This month</div>
        <div className="flex items-center mb-[28px]">
          <IconSVG
            className="mr-2"
            name={title === "Messages usage" ? "message-text" : "voice"}
            color="#6D67E4"
          />
          <h3 className="text-lg font-medium">{title}</h3>
        </div>

        <span className="text-[24px] font-semibold">
          {used}/{total}
        </span>
      </div>
      <div className="w-[127px] h-[127px]">
        <CircularProgress percentage={percentage} />
      </div>
    </div>
  </div>
);

const ConversationItem = ({ name, message, time, unread }) => (
  <div className="flex items-center py-[14px]">
    <div className="w-10 h-10 rounded-full bg-gray-200 mr-2.5"></div>
    <div className="flex-1">
      <div className="font-medium text-sm">{name}</div>
      <div className="text-xs text-gray-600">{message}</div>
    </div>
    <div className="flex flex-col items-center justify-center">
      <div className="text-xs text-gray-400">{time}</div>
      {unread && (
        <div className="bg-purple-500 text-white rounded-full w-5 h-5 flex justify-center items-center text-xs ml-auto">
          {unread}
        </div>
      )}
    </div>
  </div>
);

export default function Page() {
  return (
    <div className="p-[15px] bg-white rounded-[10px] h-full overflow-hidden flex flex-col">
      {/* Activation message */}
      <div className="bg-[#6D67E4] h-[64px] text-white p-4 rounded-lg flex items-center mb-[15px]">
        <Image
          src="/icons/integrations.svg"
          alt="Integrations"
          width={24}
          height={24}
          className="mr-2"
        />
        <span className="text-sm">
          Your account is activated successfully, now you can embed the Showfer
          chatbot in your website
        </span>
        <button className="bg-white ml-auto w-[135px] text-purple-500 py-[9px] rounded hover:bg-gray-100 transition-colors">
          Integrate Now
        </button>
      </div>

      {/* Usage statistics */}
      <div className="flex mb-[15px] h-auto">
        <UsageCard
          title="Messages usage"
          used={4854}
          total={10000}
          percentage={47}
        />
        <UsageCard
          title="Voice usage"
          used={8994}
          total={10000}
          percentage={92}
        />
      </div>

      {/* Recent Conversations and Personality */}
      <div className="flex flex-1 min-h-0">
        {/* Recent Conversations */}
        <div className="flex-1 bg-[#F0F2F7] p-5 rounded-lg mr-[15px] flex flex-col">
          <h2 className="text-sm text-gray-500 mb-[10px]">
            Recent Conversations
          </h2>
          <div className="flex-grow overflow-y-auto">
            <ConversationItem
              name="Anonymous"
              message="For more details you c..."
              time="1 min ago"
            />
            <ConversationItem
              name="Diana"
              message="How to use this site?"
              time="10 min ago"
              unread={2}
            />
            <ConversationItem name="Swarop" message="Okay!!" time="3h ago" />
            <ConversationItem
              name="Sandy"
              message="Thankyou for the help."
              time="6h ago"
              unread={4}
            />
            <ConversationItem
              name="Steve"
              message="well done!"
              time="1 day ago"
            />
            <ConversationItem name="Richard" message="" time="1 day ago" />
          </div>
        </div>

        {/* Personality */}
        <div
          className="flex-1 bg-[#Fff] p-5 rounded-lg flex flex-col"
          style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)" }}
        >
          <h2 className="text-sm text-gray-500 mb-[10px]">Personality</h2>
          <div className="flex flex-grow">
            <div className="flex flex-col justify-center w-1/2">
              <div className="text-sm text-gray-500">Selected Character</div>
              <div className="text-lg font-medium mb-[15px]">Mr. Aman</div>
              <div className="text-sm text-gray-500">Voice Visualizer</div>
              <div className="text-lg font-medium mb-[15px]">Mascot</div>
              <div className="text-sm text-gray-500">Character Dimensions</div>
              <div className="text-lg font-medium mb-[15px]">3D</div>
              <div className="text-sm text-gray-500">Emotion</div>
              <div className="text-lg font-medium mb-[15px]">Curiosity</div>
            </div>
            <div className="w-1/2 bg-[url('/personality/friendly.png')] bg-cover bg-center "></div>
          </div>
          <div className="text-right">
            <a
              href="/dashboard/appearance"
              className="text-[#6D67E4] hover:underline"
            >
              Edit Personality &gt;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
