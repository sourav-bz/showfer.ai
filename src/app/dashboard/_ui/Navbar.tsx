"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

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
        <NavItem icon="home" label="Home" href="/dashboard" isExpanded={isExpanded} isActive={pathname === "/dashboard"} />
        <NavItem
          icon="playground"
          label="Playground"
          href="/dashboard/playground"
          isActive={pathname === "/dashboard/playground"}
          isExpanded={isExpanded}
        />
        <NavItem icon="assistant" label="Assistant" href="/dashboard/assistant" isExpanded={isExpanded} isActive={pathname === "/dashboard/assistant"} />
        <NavItem
          icon="chathistory"
          label="Chat History"
          href="/dashboard/chat-history"
          isActive={pathname === "/dashboard/chat-history"}
          isExpanded={isExpanded}
        />
        <NavItem icon="appearance" label="Appearance" href="/dashboard/appearance" isExpanded={isExpanded} isActive={pathname === "/dashboard/appearance"} />
        <NavItem icon="billing" label="Billing" href="/dashboard/billing" isExpanded={isExpanded} isActive={pathname === "/dashboard/billing"} />
        <NavItem icon="usage" label="Usage" href="/dashboard/usage" isExpanded={isExpanded} isActive={pathname === "/dashboard/usage"} />
        <NavItem
          icon="integrations"
          label="Integrations"
          href="/dashboard/integrations"
          isExpanded={isExpanded}
          isActive={pathname === "/dashboard/integrations"}
        />
      </div>
    </motion.div>
  );
}

function NavItem({
  icon,
  label,
  href,
  isActive = false,
  isExpanded,
}: {
  icon: string;
  label: string;
  href: string;
  isActive?: boolean;
  isExpanded: boolean;
}) {
  return (
    <Link href={href} className="block">
      <div
        className={`flex items-center px-4 py-2 rounded-md ${isActive
          ? "bg-purple-100 text-purple-600 font-medium"
          : "text-gray-600 font-normal hover:bg-gray-100"
          }`}
      >
        <Image
          src={`/dashboard/${icon}-${isActive ? "active" : "inactive"}.svg`}
          alt={label}
          width={20}
          height={20}
        />
        {isExpanded && <span className="ml-3">{label}</span>}
      </div>
    </Link>
  );
}
