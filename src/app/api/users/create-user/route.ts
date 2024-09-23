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

  const { name, websiteUrl } = await request.json();

  // Create a new user in the users table
  const { data: newUser, error: createError } = await supabase
    .from("users")
    .insert({
      id: session.user.id,
      name: name,
      email: session.user.email,
      website_url: websiteUrl,
      verified: true,
      early_access_approved: false,
      pro_user: false,
      onboarding_status: "pending",
      // created_at and updated_at will be automatically handled by Supabase
    })
    .select()
    .single();

  if (createError) {
    console.error("Error creating user:", createError);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }

  return NextResponse.json({ user: newUser });
}
