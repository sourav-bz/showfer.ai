import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const fetchUserData = async (assistantId: string) => {
  const supabase = createClientComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const userId = user.id;

    // Fetch personality settings
    const { data: personalityData, error: personalityError } = await supabase
      .from("personality_settings")
      .select("*")
      .eq("user_id", userId)
      .eq("assistant_id", assistantId)
      .single();

    let personalitySettings = null;
    if (personalityData) {
      personalitySettings = personalityData;
    } else if (personalityError) {
      console.error("Error fetching personality settings:", personalityError);
    }

    // Fetch assistant ID
    const { data: assistantData, error: assistantError } = await supabase
      .from("assistant_settings")
      .select("openai_assistant_id")
      .eq("user_id", userId)
      .eq("id", assistantId)
      .single();

    let openaiAssistantId = null;
    if (assistantData) {
      openaiAssistantId = assistantData.openai_assistant_id;
    } else if (assistantError) {
      console.error("Error fetching assistant ID:", assistantError);
    }

    return { userId, personalitySettings, openaiAssistantId };
  }

  return { userId: null, personalitySettings: null, openaiAssistantId: null };
};
