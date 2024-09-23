import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Parse the request body to get the email
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Create a Supabase client with service role
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check if the user exists in the users table using the provided email
  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (userError) {
    console.error("Error checking user status:", userError);
    return NextResponse.json(
      { error: "Error checking user status" },
      { status: 500 }
    );
  }

  if (!user) {
    return NextResponse.json({ exists: false, early_access_approved: false });
  }

  return NextResponse.json({
    exists: true,
    early_access_approved: user.early_access_approved,
  });
}
