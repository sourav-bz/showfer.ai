"use client";
import Image from "next/image";
import Bot from "./_ui/Bot";

export default function Playground() {
  return (
    <div className="rounded-md h-full overflow-hidden">
      <div className="relative mb-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Image
            src={"/dashboard/search.svg"}
            alt="search"
            height={24}
            width={24}
          />
        </div>
        <input
          type="text"
          name="price"
          id="price"
          className="block w-full rounded-md border-0 py-3 pl-12 pr-20 text-[#C0C4D2] placeholder:text-[#C0C4D2] "
          placeholder="Enter url here..."
        />
      </div>
      <div className="bg-white h-full rounded-md relative">
        <Bot />
      </div>
    </div>
  );
}
