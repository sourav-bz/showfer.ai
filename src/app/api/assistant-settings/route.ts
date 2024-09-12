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
    const assistantSettings = await request.json();
    console.log("Received assistant settings:", assistantSettings);
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let result;

    if (request.method === "PUT") {
      result = await supabase
        .from("assistant_settings")
        .update({
          ...assistantSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assistantSettings.id)
        .select();
    } else if (request.method === "POST") {
      // Insert new record
      result = await supabase
        .from("assistant_settings")
        .insert({
          user_id: session.user.id,
          ...assistantSettings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();
    } else {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    if (result.error) {
      console.log("Error saving settings:", result.error);
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    console.log("Settings saved successfully:", result.data);

    return NextResponse.json(
      { message: "Settings saved successfully", data: result.data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in assistant-settings API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Ensure the authenticated user is requesting their own data
    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("assistant_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No matching row found, return null for the assistant
        return NextResponse.json({ assistant: null });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ assistant: data });
  } catch (error) {
    console.error("Error fetching assistant settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
