"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      className="bg-white h-full rounded-md py-4 pl-4"
      animate={{ width: isExpanded ? "240px" : "80px" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex mt-[50px]">
        {isExpanded ? (
          <Image
            src="./brand-logo/dark.svg"
            alt="Showfer.ai Logo"
            width={120}
            height={30}
          />
        ) : null}
        <Image
          src={"./dashboard/expander.svg"}
          alt="expander"
          width={30}
          height={30}
          className={`ml-auto cursor-pointer`}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      <div className="mt-8 space-y-4 pr-4">
        <NavItem icon="home" label="Home" isExpanded={isExpanded} />
        <NavItem
          icon="playground"
          label="Playground"
          isActive={true}
          isExpanded={isExpanded}
        />
        <NavItem icon="assistant" label="Assistant" isExpanded={isExpanded} />
        <NavItem
          icon="chathistory"
          label="Chat History"
          isExpanded={isExpanded}
        />
        <NavItem icon="appearance" label="Appearance" isExpanded={isExpanded} />
        <NavItem icon="billing" label="Billing" isExpanded={isExpanded} />
        <NavItem icon="usage" label="Usage" isExpanded={isExpanded} />
        <NavItem
          icon="integrations"
          label="Integrations"
          isExpanded={isExpanded}
        />
      </div>
    </motion.div>
  );
}

function NavItem({
  icon,
  label,
  isActive = false,
  isExpanded,
}: {
  icon: string;
  label: string;
  isActive?: boolean;
  isExpanded: boolean;
}) {
  return (
    <div
      className={`flex items-center px-4 py-2 rounded-md ${
        isActive
          ? "bg-purple-100 text-purple-600 font-medium"
          : "text-gray-600 font-normal"
      }`}
    >
      <Image
        src={`./dashboard/${icon}-${isActive ? "active" : "inactive"}.svg`}
        alt={label}
        width={20}
        height={20}
      />
      {isExpanded && <span className="ml-3">{label}</span>}
    </div>
  );
}
