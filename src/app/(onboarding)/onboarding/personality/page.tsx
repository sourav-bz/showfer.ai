"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import PreviewWindow from "./PreviewWindow";
import VoiceSettings from "./VoiceSettings";
import PersonalitySettings from "./PersonalitySettings";
import { usePersonalityStore, fetchAvailableVoices, Voice } from "./store";
import Lottie from "lottie-react";
import spinnerAnimation from "../../../../../public/loader/spinner.json";

export default function Page() {
  const personalitySettings = usePersonalityStore();
  const { selectedTab, setSelectedTab } = personalitySettings;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);

  useEffect(() => {
    const fetchExistingSettings = async () => {
      try {
        const response = await fetch("/api/personality-settings");
        if (response.ok) {
          const existingSettings = await response.json();
          personalitySettings.setSettings(existingSettings);
        }

        // Fetch available voices and filter for English
        const allVoices = await fetchAvailableVoices();
        const englishVoices = allVoices.filter(
          (voice) => voice.language === "en"
        );

        setAvailableVoices(englishVoices);
        if (englishVoices.length > 0) {
          const { id, name, description, language, is_public } =
            englishVoices[0];
          personalitySettings.setVoice({
            id,
            name,
            description,
            language,
            is_public,
          });
        }
      } catch (error) {
        console.error("Error fetching existing settings or voices:", error);
      }
    };

    fetchExistingSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const method = personalitySettings.id ? "PUT" : "POST";

      // Create a new object with only the required fields
      const settingsToSave = {
        id: personalitySettings.id,
        character: personalitySettings.character,
        visualizer: personalitySettings.visualizer,
        dimensions: personalitySettings.dimensions,
        primaryColor: personalitySettings.character.primaryColor,
        voice: personalitySettings.voice,
        speed: personalitySettings.selectedSpeed,
        emotionConfig: personalitySettings.emotionConfig,
      };

      const response = await fetch("/api/personality-settings", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsToSave),
      });

      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Failed to save settings");
      }

      setIsLoading(false);
      // Navigate to the next page
      router.push("/onboarding/training");
    } catch (error) {
      setIsLoading(false);
      console.error("Error saving personality settings:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

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

            {selectedTab === "Personality" && <PersonalitySettings />}
            {selectedTab === "Voice" && (
              <VoiceSettings availableVoices={availableVoices} />
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
        <button
          onClick={handleSaveSettings}
          className="bg-[#6D67E4] text-white px-6 py-2 rounded-[10px] flex items-center"
        >
          {isLoading ? (
            <Lottie
              animationData={spinnerAnimation}
              style={{ width: 24, height: 24 }}
            />
          ) : (
            "Next"
          )}
          {/* ... SVG icon */}
        </button>
      </footer>
    </div>
  );
}
