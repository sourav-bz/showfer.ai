import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { onboardingStatus } = await request.json();

  if (!onboardingStatus) {
    return NextResponse.json(
      { error: "Onboarding status is required" },
      { status: 400 }
    );
  }

  // Update the user's onboarding status in the users table
  const { data: updatedUser, error: updateError } = await supabase
    .from("users")
    .update({ onboarding_status: onboardingStatus })
    .eq("id", session.user.id)
    .select()
    .single();

  if (updateError) {
    console.error("Error updating user:", updateError);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }

  return NextResponse.json({ user: updatedUser });
}
