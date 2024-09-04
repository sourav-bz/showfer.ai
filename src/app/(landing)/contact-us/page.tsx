import React from "react";
import Image from "next/image";
import Navbar from "../_ui/Navbar";

export default function ContactUs() {
  return (
    <main className="flex flex-col min-h-screen h-screen p-4">
      <Navbar />
      <div className="bg-white text-gray-900 rounded-lg h-full">
        <div className="h-full mx-auto px-24 py-24 flex flex-col items-center">
          <div className="text-5xl mb-[45px]">Contact us</div>
          <div
            className="rounded-md p-[45px] w-[500px] flex flex-col items-center"
            style={{
              boxShadow: `0px 307px 86px 0px rgba(115, 113, 148, 0.00), 0px 197px 79px 0px rgba(115, 113, 148, 0.01), 0px 111px 66px 0px rgba(115, 113, 148, 0.05), 0px 49px 49px 0px rgba(115, 113, 148, 0.09), 0px 12px 27px 0px rgba(115, 113, 148, 0.10);`,
            }}
          >
            <Image
              src="/brand-logo/dark.svg"
              alt="AI"
              width={136}
              height={23}
              className="mb-[75px]"
            />
            <div className="text-center mb-[80px]">
              You can contact us at any time directly at{" "}
              <span className="text-[#6D67E4]">support@showfer.ai</span> .We
              would love to clarify your doubts.
            </div>

            <a
              href="mailto:support@showfer.ai"
              className="bg-[#6D67E4] w-full text-center text-white p-[10px] rounded-md text-[16px] inline-block"
            >
              Email us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
