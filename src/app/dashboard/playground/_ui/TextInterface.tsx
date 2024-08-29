import Image from "next/image";

export default function TextInterface() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto mb-4 p-4">
        <div className="bg-[#F0F2F7] p-2 rounded-xl rounded-bl-md mb-4 max-w-[80%] text-sm font-normal">
          Hi, how can I help you?
        </div>
        <div className="bg-[#6D67E4] p-2 rounded-xl rounded-br-md mb-4 max-w-[80%] ml-auto text-sm text-white font-normal">
          Can I talk to somebody?
        </div>
        <div className="bg-[#F0F2F7] p-2 rounded-xl rounded-bl-md mb-4 max-w-[80%] text-sm font-normal">
          Sure you can escalate to human by pressing (connect now)
        </div>
      </div>
      <div className="flex p-2 border-t border-[#E3E4EC]">
        <input
          type="text"
          placeholder="Ask whatever you want."
          className="flex-grow border-0 rounded-l-lg p-2 placeholder:text-sm focus:outline-none"
        />
        <Image
          src={"/playground/send.svg"}
          width={24}
          height={24}
          alt="send"
        />
      </div>
    </div>
  );
}
