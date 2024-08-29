"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ setActiveItem, activeItem }: { setActiveItem: (item: string) => void, activeItem: string }) {
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
            src="/brand-logo/dark.svg"
            alt="Showfer.ai Logo"
            width={120}
            height={30}
          />
        ) : null}
        <Image
          src={"/dashboard/expander.svg"}
          alt="expander"
          width={30}
          height={30}
          className={`ml-auto cursor-pointer`}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      <div className="mt-8 space-y-4 pr-4">
        <NavItem icon="home" label="Home" href="/dashboard" isExpanded={isExpanded} setActiveItem={setActiveItem} activeItem={activeItem} />
        <NavItem
          icon="playground"
          label="Playground"
          href="/dashboard/playground"
          isExpanded={isExpanded}
          setActiveItem={setActiveItem}
          activeItem={activeItem}
        />
        <NavItem icon="assistant" label="Assistant" href="/dashboard/assistant" isExpanded={isExpanded} setActiveItem={setActiveItem} activeItem={activeItem} />
        <NavItem
          icon="chathistory"
          label="Chat History"
          href="/dashboard/chat-history"
          isExpanded={isExpanded}
          setActiveItem={setActiveItem}
          activeItem={activeItem}
        />
        <NavItem icon="appearance" label="Appearance" href="/dashboard/appearance" isExpanded={isExpanded} setActiveItem={setActiveItem} activeItem={activeItem} />
        <NavItem icon="billing" label="Billing" href="/dashboard/billing" isExpanded={isExpanded} setActiveItem={setActiveItem} activeItem={activeItem} />
        <NavItem icon="usage" label="Usage" href="/dashboard/usage" isExpanded={isExpanded} setActiveItem={setActiveItem} activeItem={activeItem} />
        <NavItem
          icon="integrations"
          label="Integrations"
          href="/dashboard/integrations"
          isExpanded={isExpanded}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
      </div>
    </motion.div>
  );
}

function NavItem({
  icon,
  label,
  href,
  isExpanded,
  activeItem,
  setActiveItem,
}: {
  icon: string;
  label: string;
  href: string;
  isExpanded: boolean;
  activeItem: string;
  setActiveItem: (item: string) => void;
}) {
  return (
    <Link href={href} className="block" onClick={() => setActiveItem(label)}>
      <div
        className={`flex items-center px-4 py-2 rounded-md ${activeItem === label
          ? "bg-purple-100 text-purple-600 font-medium"
          : "text-gray-600 font-normal hover:bg-gray-100"
          }`}
      >
        <Image
          src={`/dashboard/${icon}-${activeItem === label ? "active" : "inactive"}.svg`}
          alt={label}
          width={20}
          height={20}
        />
        {isExpanded && <span className="ml-3">{label}</span>}
      </div>
    </Link>
  );
}
