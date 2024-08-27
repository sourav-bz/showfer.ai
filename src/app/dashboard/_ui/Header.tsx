"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { IoNotificationsOutline } from "react-icons/io5";
import Avvvatars from "avvvatars-react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [view, setView] = useState<"mobile" | "desktop">("desktop");

  return (
    <div className="h-full rounded-md">
      <div className="flex h-full justify-between items-center">
        <div className="text-2xl">Playground</div>
        <div className="flex-grow flex justify-center">
          <div className="flex bg-[#E3E4EC] p-1 rounded-md">
            <button
              className={`px-3 py-2 rounded-md ${
                view === "desktop" ? "bg-[#6D67E4] text-white" : ""
              } flex items-center`}
              onClick={() => setView("desktop")}
            >
              <Image
                src={`./playground/desktop-${
                  view === "desktop" ? "active" : "inactive"
                }.svg`}
                width={20}
                height={20}
                alt="mobile"
                className="mr-2"
              />
              Desktop
            </button>
            <button
              className={`px-3 py-2 rounded-md ${
                view === "mobile" ? "bg-[#6D67E4] text-white" : ""
              } flex items-center`}
              onClick={() => setView("mobile")}
            >
              <Image
                src={`./playground/mobile-${
                  view === "mobile" ? "active" : "inactive"
                }.svg`}
                width={20}
                height={20}
                alt="mobile"
                className="mr-2"
              />
              Mobile
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center">
          <div className="bg-white w-[40px] h-[40px] rounded-full mr-4 flex justify-center items-center">
            <IoNotificationsOutline size={24} />
          </div>
          <div className="mr-4">
            <Avvvatars
              value="best_user@gmail.com"
              style="shape"
              shadow={true}
              size={40}
            />
          </div>
          <div>
            <Menu>
              <MenuButton className="flex items-center text-[14px]">
                My account
                <ChevronDownIcon className="size-4 fill-black/60 ml-1" />
              </MenuButton>
              <MenuItems anchor="bottom">
                <MenuItem>
                  <a
                    className="block data-[focus]:bg-blue-100"
                    href="/settings"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a className="block data-[focus]:bg-blue-100" href="/support">
                    Support
                  </a>
                </MenuItem>
                <MenuItem>
                  <a className="block data-[focus]:bg-blue-100" href="/license">
                    License
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
