import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, thread_id, assistant_id } = await req.json();

    // Create a new thread if thread_id is not provided
    const thread = thread_id
      ? await openai.beta.threads.retrieve(thread_id)
      : await openai.beta.threads.create();

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant_id,
    });

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Retrieve the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantResponse = messages.data[0].content[0];

    // Return the full response
    return NextResponse.json({
      response: assistantResponse.text,
      thread_id: thread.id,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
