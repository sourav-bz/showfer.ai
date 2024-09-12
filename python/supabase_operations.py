import os
from supabase import create_client, Client

# Supabase setup
url: str = "YOUR_SUPABASE_URL"
key: str = "YOUR_SUPABASE_KEY"
supabase: Client = create_client(url, key)

def get_new_entries():
    response = supabase.table("domains").select("*").eq("status", "pending").execute()
    return response.data

def store_scraped_data(domain, filename, content):
    folder_name = domain.replace("https://", "").replace("http://", "").replace("/", "_")
    os.makedirs(folder_name, exist_ok=True)
    with open(f"{folder_name}/{filename}", "w", encoding="utf-8") as f:
        f.write(content)

def update_status(id, status):
    supabase.table("domains").update({"status": status}).eq("id", id).execute()