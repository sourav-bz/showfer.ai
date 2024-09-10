import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return handleRequest(request);
}

export async function PUT(request: Request) {
  return handleRequest(request);
}

async function handleRequest(request: Request) {
  try {
    const personalitySettings = await request.json();
    console.log("Received personality settings:", personalitySettings);

    const supabase = createRouteHandlerClient({ cookies });

    // Get the current user's session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // Insert or update the personality settings in the database
    const { data, error } = await supabase
      .from("personality-settings")
      .upsert({
        userId: userId,
        ...personalitySettings,
      })
      .select();

    console.log("error:", error);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Settings saved successfully:", data);

    return NextResponse.json(
      { message: "Settings saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in personality-settings API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("personality-settings")
      .select("*")
      .eq("userId", session.user.id)
      .single();

    console.log("data:", data);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching personality settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
