import time
from supabase_operations import get_new_entries, store_scraped_data, update_status

def process_entries(entries):
    urls = [entry['domain'] for entry in entries]
    results = scrape_urls(urls)

    for url, filename, content in results:
        entry = next(entry for entry in entries if entry['domain'] == url)
        if filename and content:
            store_scraped_data(url, filename, content)
            update_status(entry['id'], "completed")
            print(f"Completed scraping {url}")
        else:
            update_status(entry['id'], "error")
            print(f"Error scraping {url}")

def main():
    while True:
        new_entries = get_new_entries()
        
        if new_entries:
            print(f"Found {len(new_entries)} new entries to process.")
            process_entries(new_entries)
        else:
            print("No new entries to process.")
        
        print("Waiting for 60 seconds before checking for new entries...")
        time.sleep(60)

if __name__ == "__main__":
    main()