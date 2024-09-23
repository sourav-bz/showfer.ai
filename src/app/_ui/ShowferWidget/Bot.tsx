import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import BotWindow from "./BotWindow";
import OrbIcon from "./_ui/Orb/OrbIcon";

const Bot = ({ mobile }: { mobile?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [personalitySettings, setPersonalitySettings] = useState<any>(null);
  const [assistantId, setAssistantId] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);

        // Fetch personality settings
        const { data: personalityData, error: personalityError } =
          await supabase
            .from("personality_settings")
            .select("*")
            .eq("userId", user.id)
            .single();

        if (personalityData) {
          setPersonalitySettings(personalityData);
        } else if (personalityError) {
          console.error(
            "Error fetching personality settings:",
            personalityError
          );
        }

        // Fetch assistant ID
        const { data: assistantData, error: assistantError } = await supabase
          .from("assistant_settings")
          .select("openai_assistant_id")
          .eq("user_id", user.id)
          .single();

        if (assistantData) {
          setAssistantId(assistantData.openai_assistant_id);
        } else if (assistantError) {
          console.error("Error fetching assistant ID:", assistantError);
        }
      }
    };

    fetchUserData();
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col mt-auto items-end justify-end h-full">
      {isOpen && (
        <BotWindow
          mobile={mobile}
          toggleChat={toggleChat}
          assistantId={assistantId!}
          personalitySettings={personalitySettings}
        />
      )}
      {(!mobile || !isOpen) && (
        <button onClick={toggleChat}>
          <OrbIcon
            width={mobile ? 40 : 50}
            height={mobile ? 40 : 50}
            primaryColor={personalitySettings?.primaryColor}
          />
        </button>
      )}
    </div>
  );
};

export default Bot;
