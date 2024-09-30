import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  usePersonalityStore,
  fetchAvailableVoices,
  Voice,
  speedLevels,
  emotionLevels,
  emotions,
} from "./store";
import Slider from "./Slider";

const VoiceSettings = ({ availableVoices }: { availableVoices: Voice[] }) => {
  const {
    voice,
    setVoice,
    setSelectedSpeed,
    selectedEmotion,
    setSelectedEmotion,
    setSelectedEmotionLevel,
    selectedSpeed,
    emotionConfig,
  } = usePersonalityStore();

  useEffect(() => {
    console.log(emotionConfig);
  }, [emotionConfig]);

  return (
    <div className="w-[600px]">
      <div className="flex items-center mb-[30px]">
        <label className="block">Voice</label>
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

      <div className="mb-[70px]">
        <label className="block mb-2">Speed</label>
        <div className="">
          <Slider
            rtl={false}
            value={speedLevels.indexOf(selectedSpeed)}
            levelLabels={speedLevels}
            onChange={(values) => setSelectedSpeed(speedLevels[values[0]])}
          />
        </div>
      </div>

      <div className="flex items-center mb-[30px]">
        <label className="block">Emotions</label>
        <Menu
          as="div"
          className="relative inline-block text-left w-[300px] ml-auto"
        >
          <MenuButton className="inline-flex w-full items-center justify-between gap-2 rounded-[15px] bg-[#F0F2F7] py-[12px] px-[15px] text-sm text-black shadow-sm hover:bg-[#E1E3E8]">
            <span className="flex items-center">
              {selectedEmotion ? selectedEmotion : "Select an emotion"}
            </span>
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </MenuButton>

          <MenuItems className="absolute left-0 z-20 mt-2 w-[200px] h-[200px] overflow-y-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {emotions.map((e) => (
              <MenuItem key={e}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } flex w-full px-4 py-2 text-sm text-left`}
                    onClick={() => setSelectedEmotion(e)}
                  >
                    {e}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>

      {selectedEmotion ? (
        <div className="mb-[30px]">
          <label className="block mb-2">Emotion Level</label>
          <div className="">
            <Slider
              rtl={false}
              value={emotionLevels.indexOf(
                emotionConfig.find(
                  (config) => config.emotion === selectedEmotion
                )?.level || "none"
              )}
              levelLabels={emotionLevels}
              onChange={(values) =>
                setSelectedEmotionLevel(emotionLevels[values[0]])
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VoiceSettings;
