import OpenAI from 'openai';

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

export async function POST(req: any) {
  const { message } = await req.json();

  const thread = await openai.beta.threads.create();

  const messageThread = await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: `${message}`
    }
  );

  // const run = await openai.beta.threads.runs.create(
  //   thread.id,
  //   { assistant_id: `asst_jBAwKYxYlnsLOFbfweGveOFV` }
  // );

  // We use the stream SDK helper to create a run with
// streaming. The SDK provides helpful event listeners to handle 
// the streamed response.
 
const run = openai.beta.threads.runs.stream(thread.id, {
    assistant_id: 'asst_jBAwKYxYlnsLOFbfweGveOFV'
  })
    .on('textCreated', (text) => process.stdout.write('\nassistant > '))
    .on('textDelta', (textDelta, snapshot) => process.stdout.write(textDelta.value))
    .on('toolCallCreated', (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
    .on('toolCallDelta', (toolCallDelta, snapshot) => {
      if (toolCallDelta.type === 'code_interpreter') {
        if (toolCallDelta.code_interpreter.input) {
          process.stdout.write(toolCallDelta.code_interpreter.input);
        }
        if (toolCallDelta.code_interpreter.outputs) {
          process.stdout.write("\noutput >\n");
          toolCallDelta.code_interpreter.outputs.forEach(output => {
            if (output.type === "logs") {
              process.stdout.write(`\n${output.logs}\n`);
            }
          });
        }
      }
    });

  return new Response(JSON.stringify({ error: 'Error fetching AI response' }), { status: 500 }); 

  // if (run.status === 'completed') {
  //   const messages = await openai.beta.threads.messages.list(
  //     run.thread_id
  //   );
  //   for (const message of messages.data.reverse()) {
  //     console.log(`${message.role} > ${message.content[0].text.value}`);
  //   }
  //   return new Response(JSON.stringify({ message: messages }), { status: 200 });
  // } else {
  //   console.log(run.status);
  //   return new Response(JSON.stringify({ error: 'Error fetching AI response' }), { status: 500 });
  // }

  // try {
  //   const response = await openai.chat.completions.create({
  //   messages: [{ role: 'user', content: message }],
  //   model: "gpt-3.5-turbo",
  // });
  //   const aiMessage = response.choices[0];
  //   return new Response(JSON.stringify({ message: aiMessage }), { status: 200 });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: 'Error fetching AI response' }), { status: 500 });
  // }
}
