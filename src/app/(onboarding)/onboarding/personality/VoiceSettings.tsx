import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { usePersonalityStore, fetchAvailableVoices, Voice } from "./store";

const VoiceSettings = ({ availableVoices }: { availableVoices: Voice[] }) => {
  const { voice, setVoice } = usePersonalityStore();

  return (
    <div className="w-[600px]">
      <div className="flex items-center mb-4">
        <label className="block mb-2">Choose voice</label>
        <Menu
          as="div"
          className="relative inline-block text-left w-[300px] ml-auto"
        >
          <MenuButton className="inline-flex w-full items-center justify-between gap-2 rounded-[15px] bg-[#F0F2F7] py-[12px] px-[15px] text-sm text-black shadow-sm hover:bg-[#E1E3E8]">
            <span className="flex items-center">
              {voice ? voice.name : "Select a voice"}
            </span>
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </MenuButton>

          <MenuItems className="absolute left-0 z-20 mt-2 w-[200px] h-[300px] overflow-y-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {availableVoices.map((v) => (
              <MenuItem key={v.id}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } flex w-full px-4 py-2 text-sm text-left`}
                    onClick={() => setVoice(v)}
                  >
                    {v.name}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>
      <div className="text-sm text-gray-500 mb-[30px]">
        {voice?.description}
      </div>

      <div className="mb-[30px]">
        <label className="block mb-2">Speed</label>
        <div className="">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Slow</span>
            <span className="text-sm text-gray-500 ml-auto">Fast</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={voice.speed}
            onChange={(e) =>
              setVoice({ ...voice, speed: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="mb-[30px]">
        <label className="block mb-2">Stability</label>
        <div className="">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">More variable</span>
            <span className="text-sm text-gray-500 ml-auto">More stable</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={voice.stability}
            onChange={(e) =>
              setVoice({ ...voice, stability: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceSettings;
