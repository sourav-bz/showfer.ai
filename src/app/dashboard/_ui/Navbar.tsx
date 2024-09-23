"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
const navigationTabs = [
  { icon: "home", label: "Home", href: "/dashboard/home" },
  { icon: "playground", label: "Playground", href: "/dashboard/playground" },
  { icon: "assistant", label: "Assistant", href: "/dashboard/assistant" },
  {
    icon: "chathistory",
    label: "Chat History",
    href: "/dashboard/chat-history",
  },
  { icon: "appearance", label: "Appearance", href: "/dashboard/appearance" },
  { icon: "billing", label: "Billing", href: "/dashboard/billing" },
  { icon: "usage", label: "Usage", href: "/dashboard/usage" },
  {
    icon: "integrations",
    label: "Integrations",
    href: "/dashboard/integrations",
  },
];

export default function Navbar({
  setActiveItem,
  activeItem,
  isExpanded,
  setIsExpanded,
}: {
  setActiveItem: (item: string) => void;
  activeItem: string;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    setActiveItem(
      navigationTabs.find((tab) => tab.href === pathname)?.label || "Home"
    );
  }, [pathname]);

  return (
    <motion.div
      className="bg-white h-full rounded-md py-4 pl-4 w-60"
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
        {navigationTabs.map((tab) => (
          <NavItem
            key={tab.label}
            icon={tab.icon}
            label={tab.label}
            href={tab.href}
            isExpanded={isExpanded}
            setActiveItem={setActiveItem}
            activeItem={activeItem}
          />
        ))}
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
        className={`flex items-center px-4 py-2 rounded-md ${
          activeItem === label
            ? "bg-purple-100 text-purple-600 font-medium"
            : "text-gray-600 font-normal hover:bg-gray-100"
        }`}
      >
        <Image
          src={`/dashboard/${icon}-${
            activeItem === label ? "active" : "inactive"
          }.svg`}
          alt={label}
          width={20}
          height={20}
        />
        {isExpanded && <span className="ml-3">{label}</span>}
      </div>
    </Link>
  );
}
