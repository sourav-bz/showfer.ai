"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import styled from "styled-components";
import PreviewWindow from "./PreviewWindow";
import { useRouter } from "next/navigation";

const ColorPickerInput = styled.input`
  position: absolute;
  top: -16px;
  left: -30px;
  z-index: 10;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: none;
    border-radius: 50%;
  }
`;

export default function PersonalitySettings() {
  const [selectedTab, setSelectedTab] = useState("Personality");
  const characters = [
    { id: 1, name: "Dr. Aman", avatar: "/personality/trustworthy-bg.jpg" },
    { id: 2, name: "Imogen", avatar: "/personality/creative-bg.jpg" },
    { id: 3, name: "Conrad", avatar: "/personality/friendly-bg.jpg" },
    { id: 4, name: "Edison", avatar: "/personality/innovative-bg.jpg" },
    { id: 5, name: "Buddy", avatar: "/personality/playful-bg.jpg" },
    { id: 6, name: "Griffin", avatar: "/personality/rugged-bg.jpg" },
    // Add more characters as needed
  ];
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [selectedVisualizer, setSelectedVisualizer] = useState("Orb");
  const [selectedDimensions, setSelectedDimensions] = useState("2D");
  const [primaryColor, setPrimaryColor] = useState("#6D67E4");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      <main className="flex-grow flex">
        <div className="w-2/3 relative  flex flex-col items-center justify-center">
          <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#E3E4EC] to-transparent"></div>

          <div>
            <h1 className="text-[24px] font-medium mb-[50px] flex items-center">
              <Image
                src="/icons/back.svg"
                alt="Back"
                width={24}
                height={24}
                className="mr-2 cursor-pointer"
                onClick={() => router.back()}
              />
              Let&apos;s create your brand&apos;s personality.
            </h1>

            <div className="flex items-center">
              <div className="mb-[35px] bg-[#F0F2F7] rounded-[10px] p-[5px]">
                {["Personality", "Voice"].map((tab) => (
                  <button
                    key={tab}
                    className={`w-[145px] py-[10px] rounded-[10px] mr-2 ${
                      selectedTab === tab
                        ? "bg-[#6D67E4] text-white"
                        : "text-gray-500"
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {selectedTab === "Personality" && (
              <div className="w-[600px]">
                <div className="mb-[35px] flex items-center">
                  <label className="block mb-2 font-medium mr-4">
                    Choose Character
                  </label>
                  <Menu
                    as="div"
                    className="relative inline-block text-left w-[200px] ml-auto"
                  >
                    <MenuButton className="inline-flex w-full items-center justify-between gap-2 rounded-[15px] bg-[#F0F2F7] py-[12px] px-[12px] text-sm text-black shadow-sm hover:bg-[#E1E3E8]">
                      <span className="flex items-center">
                        <Image
                          src={selectedCharacter.avatar}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded-full mr-2"
                        />
                        {selectedCharacter.name}
                      </span>
                      <ChevronDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </MenuButton>

                    <MenuItems className="absolute left-0 z-20 mt-2 w-[200px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {characters.map((character) => (
                        <MenuItem key={character.id}>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700"
                              } group flex w-full items-center px-4 py-2 text-sm`}
                              onClick={() => setSelectedCharacter(character)}
                            >
                              <Image
                                src={character.avatar}
                                alt=""
                                width={24}
                                height={24}
                                className="rounded-full mr-3"
                              />
                              {character.name}
                            </button>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>

                <div className="flex items-center mb-[30px]">
                  <label className="block font-medium">Voice Visualizer</label>
                  <div className="flex items-center ml-auto w-[200px] bg-[#F0F2F7] rounded-[15px] p-[5px] h-[50px]">
                    {["Orb", "Mascot"].map((tab) => (
                      <div key={tab} className="flex-1">
                        <button
                          className={`w-full py-[8px] px-[20px] rounded-[15px] ${
                            selectedVisualizer === tab
                              ? "bg-white text-[#6D67E4]"
                              : "text-[#8F93A5]"
                          }`}
                          onClick={() => setSelectedVisualizer(tab)}
                        >
                          {tab}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center mb-[30px]">
                  <label className="block font-medium">
                    Character Dimensions
                  </label>
                  <div className="flex items-center ml-auto w-[200px] bg-[#F0F2F7] rounded-[15px] p-[5px] h-[50px]">
                    {["2D", "3D"].map((tab) => (
                      <div key={tab} className="flex-1">
                        <button
                          className={`w-full py-[8px] px-[20px] rounded-[15px] ${
                            selectedDimensions === tab
                              ? "bg-white text-[#6D67E4]"
                              : "text-[#8F93A5]"
                          }`}
                          onClick={() => setSelectedDimensions(tab)}
                        >
                          {tab}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="block font-medium">Primary color</label>
                  <div className="ml-auto flex items-center bg-[#F0F2F7] rounded-[15px] p-2 w-[200px] h-[50px]">
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20 bg-transparent text-center"
                    />
                    <div className="ml-auto relative">
                      <ColorPickerInput
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedTab === "Voice" && (
              <div className="w-[600px]">
                <div className="flex items-center mb-[30px]">
                  <label className="block mb-2">Choose voice</label>
                  <Menu
                    as="div"
                    className="relative inline-block text-left w-[200px] ml-auto"
                  >
                    <MenuButton className="inline-flex w-full items-center justify-between gap-2 rounded-[15px] bg-[#F0F2F7] py-[12px] px-[15px] text-sm text-black shadow-sm hover:bg-[#E1E3E8]">
                      <span className="flex items-center">
                        {selectedCharacter.name}
                      </span>
                      <ChevronDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </MenuButton>

                    <MenuItems className="absolute left-0 z-20 mt-2 w-[200px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {characters.map((character) => (
                        <MenuItem key={character.id}>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700"
                              } group flex w-full items-center px-4 py-2 text-sm`}
                              onClick={() => setSelectedCharacter(character)}
                            >
                              {character.name}
                            </button>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>

                <div className="mb-[30px]">
                  <label className="block mb-2">Speed</label>
                  <div className="">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Slow</span>
                      <span className="text-sm text-gray-500 ml-auto">
                        Fast
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mb-[30px]">
                  <label className="block mb-2">Stability</label>
                  <div className="">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        More variable
                      </span>
                      <span className="text-sm text-gray-500 ml-auto">
                        More stable
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-1/3 p-8 flex items-center justify-center">
          <div className="bg-[#F0F2F7] rounded-lg px-4 pt-4">
            <div className="font-medium mb-4">Preview</div>
            <PreviewWindow />
          </div>
        </div>
      </main>

      <footer className="p-6 flex justify-end mt-auto">
        <Link
          href="/onboarding/training"
          className="bg-[#6D67E4] text-white px-6 py-2 rounded-[10px] flex items-center"
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              d="M10.5198 5.32L13.7298 8.53L15.6998 10.49C16.5298 11.32 16.5298 12.67 15.6998 13.5L10.5198 18.68C9.83977 19.36 8.67977 18.87 8.67977 17.92V12.31V6.08C8.67977 5.12 9.83977 4.64 10.5198 5.32Z"
              fill="white"
            />
          </svg>
        </Link>
      </footer>
    </div>
  );
}
