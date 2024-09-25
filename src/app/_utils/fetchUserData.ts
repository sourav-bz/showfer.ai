import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const fetchUserData = async () => {
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
      .eq("userId", user.id)
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
      .eq("user_id", user.id)
      .single();

    let assistantId = null;
    if (assistantData) {
      assistantId = assistantData.openai_assistant_id;
    } else if (assistantError) {
      console.error("Error fetching assistant ID:", assistantError);
    }

    return { userId, personalitySettings, assistantId };
  }

  return { userId: null, personalitySettings: null, assistantId: null };
};
