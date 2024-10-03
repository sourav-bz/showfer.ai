// pages/api/proxy.js
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(url);
    console.log("url: ", url, response.status);

    return NextResponse.json({
      content: response.data,
      contentType: response.headers["content-type"],
      status: response.status,
      headers: response.headers,
    });
  } catch (error: any) {
    console.error("Proxy error:", error.response?.data || error.message);
    return NextResponse.json({
      error: "Failed to fetch the requested URL",
      message: error.message,
      originalUrl: url,
    });
  }
}
