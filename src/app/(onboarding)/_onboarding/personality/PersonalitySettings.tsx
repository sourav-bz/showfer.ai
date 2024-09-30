import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import styled from "styled-components";
import { characters, usePersonalityStore } from "./store";

export const ColorPickerInput = styled.input`
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
  const {
    character,
    visualizer,
    dimensions,
    setCharacter,
    setVisualizer,
    setDimensions,
  } = usePersonalityStore();

  return (
    <div className="w-[600px]">
      <div className="mb-[35px] flex items-center">
        <label className="block mb-2 font-medium mr-4">Choose Character</label>
        <Menu
          as="div"
          className="relative inline-block text-left w-[200px] ml-auto"
        >
          <MenuButton className="inline-flex w-full items-center justify-between gap-2 rounded-[15px] bg-[#F0F2F7] py-[12px] px-[12px] text-sm text-black shadow-sm hover:bg-[#E1E3E8]">
            <span className="flex items-center">
              <Image
                src={character.avatar}
                alt=""
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
              {character.name}
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
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex w-full items-center px-4 py-2 text-sm`}
                    onClick={() => setCharacter(character)}
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
                  visualizer === tab
                    ? "bg-white text-[#6D67E4]"
                    : "text-[#8F93A5]"
                }`}
                onClick={() => setVisualizer(tab)}
              >
                {tab}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center mb-[30px]">
        <label className="block font-medium">Character Dimensions</label>
        <div className="flex items-center ml-auto w-[200px] bg-[#F0F2F7] rounded-[15px] p-[5px] h-[50px]">
          {["2D", "3D"].map((tab) => (
            <div key={tab} className="flex-1">
              <button
                className={`w-full py-[8px] px-[20px] rounded-[15px] ${
                  dimensions === tab
                    ? "bg-white text-[#6D67E4]"
                    : "text-[#8F93A5]"
                }`}
                onClick={() => setDimensions(tab)}
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
            value={character.primaryColor}
            onChange={(e) =>
              setCharacter({
                ...character,
                primaryColor: e.target.value,
              })
            }
            className="w-20 bg-transparent text-center"
          />
          <div className="ml-auto relative">
            <ColorPickerInput
              type="color"
              value={character.primaryColor}
              onChange={(e) =>
                setCharacter({
                  ...character,
                  primaryColor: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
