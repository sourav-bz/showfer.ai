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
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const assistantId = searchParams.get("assistant");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    let query = supabase.from("personality_settings").upsert({
      user_id: userId,
      ...personalitySettings,
    });

    const { data, error } = await query.select();

    console.log("error:", error);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
    const { searchParams } = new URL(request.url);
    const assistantId = searchParams.get("assistant");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let query = supabase
      .from("personality_settings")
      .select("*")
      .eq("user_id", session.user.id);

    if (assistantId) {
      query = query.eq("assistant_id", assistantId);
    }

    const { data, error } = await query.single();

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
