import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Get the API key
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in .env file")

client = OpenAI(api_key=api_key)

# Create an Assistant
my_assistant = client.beta.assistants.create(
    name="Customer Support Chatbot",
    instructions="You are a customer support chatbot. Use your knowledge base to best respond to customer queries.",
    model="gpt-3.5-turbo",
    tools=[{"type": "file_search"}]
)
print(f"This is the assistant object: {my_assistant} \n")

# Create a vector store called "Customer Support Knowledge"
vector_store = client.beta.vector_stores.create(name="Customer Support Knowledge")

# Ready the files for upload to OpenAI
file_paths = ["knowledge.txt"]
file_streams = [open(path, "rb") for path in file_paths]

# Use the upload and poll SDK helper to upload the files, add them to the vector store,
# and poll the status of the file batch for completion.
file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
    vector_store_id=vector_store.id, files=file_streams
)

print(f"File batch status: {file_batch.status}")
print(f"File counts: {file_batch.file_counts}")

# Update the assistant with the vector store
my_assistant = client.beta.assistants.update(
    assistant_id=my_assistant.id,
    tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}},
)

# Create a Thread
my_thread = client.beta.threads.create()
print(f"This is the thread object: {my_thread} \n")

# Step 4: Add a Message to a Thread
my_thread_message = client.beta.threads.messages.create(
  thread_id=my_thread.id,
  role="user",
  content="What can I buy in your online store?"
)
print(f"This is the message object: {my_thread_message} \n")

# Step 5: Run the Assistant
my_run = client.beta.threads.runs.create(
  thread_id=my_thread.id,
  assistant_id=my_assistant.id,
  instructions="Please address the user as Rok Benko."
)
print(f"This is the run object: {my_run} \n")

# Step 6: Periodically retrieve the Run to check on its status to see if it has moved to completed
while my_run.status in ["queued", "in_progress"]:
    keep_retrieving_run = client.beta.threads.runs.retrieve(
        thread_id=my_thread.id,
        run_id=my_run.id
    )
    print(f"Run status: {keep_retrieving_run.status}")

    if keep_retrieving_run.status == "completed":
        print("\n")

        # Step 7: Retrieve the Messages added by the Assistant to the Thread
        all_messages = client.beta.threads.messages.list(
            thread_id=my_thread.id
        )

        print("------------------------------------------------------------ \n")

        print(f"User: {my_thread_message.content[0].text.value}")
        print(f"Assistant: {all_messages.data[0].content[0].text.value}")

        break
    elif keep_retrieving_run.status == "queued" or keep_retrieving_run.status == "in_progress":
        pass
    else:
        print(f"Run status: {keep_retrieving_run.status}")
        break