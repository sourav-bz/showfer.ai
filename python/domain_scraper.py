import os
import time
from urllib.parse import urlparse, urljoin
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup, Comment
import concurrent.futures
from tqdm import tqdm
import requests
from PIL import Image
import pytesseract
from io import BytesIO
from supabase import create_client, Client
from dotenv import load_dotenv
import datetime

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    service = Service("/opt/homebrew/bin/chromedriver")
    return webdriver.Chrome(service=service, options=chrome_options)

def normalize_url(url, base_domain):
    if url.startswith('/'):
        return urljoin(base_domain, url)
    return url

def do_ocr(image_url):
    try:
        response = requests.get(image_url)
        img = Image.open(BytesIO(response.content))
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        return f"Error performing OCR: {str(e)}"

def scrape_page(url):
    driver = setup_driver()
    try:
        driver.get(url)
        time.sleep(5)
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')

        def extract_markdown(element, level=0):
            if element.name is None:
                return element.string.strip() if element.string else ""
            
            if element.name in ['script', 'style', 'svg', 'select']:
                return ""
            
            markdown = ""
            
            for comment in element.find_all(string=lambda text: isinstance(text, Comment)):
                comment.extract()
            
            if element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                markdown += "#" * int(element.name[1]) + " " + element.get_text().strip() + "\n\n"
            elif element.name == 'p':
                markdown += element.get_text().strip() + "\n\n"
            elif element.name == 'a':
                href = element.get('href', '')
                text = element.get_text().strip()
                markdown += f"[{text}]({href})\n\n"
            elif element.name == 'img':
                src = element.get('src', '')
                alt = element.get('alt', '')
                markdown += f"![{alt}]({src})\n\n"
                
                # Perform OCR on the image
                ocr_result = do_ocr(src)
                image_reports.append((src, ocr_result))
            elif element.name == 'ul':
                for li in element.find_all('li', recursive=False):
                    markdown += "- " + extract_markdown(li, level+1).strip() + "\n"
                markdown += "\n"
            elif element.name == 'ol':
                for i, li in enumerate(element.find_all('li', recursive=False), 1):
                    markdown += f"{i}. " + extract_markdown(li, level+1).strip() + "\n"
                markdown += "\n"
            else:
                for child in element.children:
                    if child.name is not None or (isinstance(child, str) and child.strip()):
                        child_content = extract_markdown(child, level+1)
                        if child_content.strip():
                            markdown += child_content + "\n\n"
            
            return markdown.strip()

        image_reports = []
        markdown_content = extract_markdown(soup.body)

        # Add image reports to the end of the markdown content
        if image_reports:
            markdown_content += "\n\n## Image OCR Report\n\n"
            for img_src, ocr_result in image_reports:
                markdown_content += f"### Image: {img_src}\n\n"
                markdown_content += f"OCR Result: {ocr_result}\n\n"

        return markdown_content

    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")
        return ""
    finally:
        driver.quit()

def save_scraped_content(domain, url, content):
    # Replace periods with hyphens in the domain name
    formatted_domain = domain.replace('.', '-')
    
    # Create the file path for Supabase storage
    filename = urlparse(url).path.strip('/').replace('/', '_') or 'index'
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"{filename}-{timestamp}.md"
    file_path = f"{formatted_domain}/{filename}"
    
    # Save the content to Supabase
    try:
        supabase.storage.from_("showfer").upload(file_path, content.encode('utf-8'))
        print(f"Successfully saved {file_path} to Supabase")
    except Exception as e:
        print(f"Error saving {file_path} to Supabase: {str(e)}")

def get_links_from_supabase(domain_name):
    load_dotenv()
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_API_KEY")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL or SUPABASE_API_KEY not found in .env file")

    supabase: Client = create_client(url, key)

    # Replace periods with hyphens in the domain name
    formatted_domain_name = domain_name.replace('.', '-')
    file_name = f"{formatted_domain_name}-links.md"
    bucket_name = "showfer"
    folder_name = "links"
    file_path = f"{folder_name}/{file_name}"

    try:
        # Check if the file exists
        file_info = supabase.storage.from_(bucket_name).list(folder_name)
        if not any(item['name'] == file_name for item in file_info):
            print(f"File '{file_name}' not found in '{bucket_name}/{folder_name}'")
            return []

        response = supabase.storage.from_(bucket_name).download(file_path)
        links = response.decode('utf-8').split('\n')
        return [link.strip() for link in links if link.strip()]
    except Exception as e:
        print(f"Error fetching links file from Supabase: {str(e)}")
        print(f"Attempted to fetch file: {file_path}")
        print(f"Bucket: {bucket_name}")
        return []

def main():
    load_dotenv()
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_API_KEY")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL or SUPABASE_API_KEY not found in .env file")

    global supabase
    supabase = create_client(url, key)

    domain = "https://mlada.in"
    domain_name = urlparse(domain).netloc

    # Fetch links from Supabase
    links = get_links_from_supabase(domain_name)

    if not links:
        print("No links found in the file. Exiting.")
        return

    print(f"Found {len(links)} links from Supabase")
    
    num_links = 10
    
    # Scrape all links if num_links is 0, otherwise limit to num_links
    links_to_scrape = links if num_links == 0 else links[:num_links]
    
    # Delete the existing folder before starting scraping
    formatted_domain = urlparse(domain).netloc.replace('.', '-')
    try:
        folder_contents = supabase.storage.from_("showfer").list(formatted_domain)
        for item in folder_contents:
            supabase.storage.from_("showfer").remove(f"{formatted_domain}/{item['name']}")
        print(f"Deleted existing folder: {formatted_domain}")
    except Exception as e:
        if "The resource was not found" not in str(e):
            print(f"Error deleting folder {formatted_domain}: {str(e)}")
    
    print(f"Scraping {len(links_to_scrape)} pages...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=15) as executor:
        future_to_url = {executor.submit(scrape_page, url): url for url in links_to_scrape}
        for future in tqdm(concurrent.futures.as_completed(future_to_url), total=len(links_to_scrape), desc="Scraping Progress"):
            url = future_to_url[future]
            try:
                content = future.result()
                save_scraped_content(urlparse(domain).netloc, url, content)
            except Exception as e:
                print(f"Error processing {url}: {str(e)}")

    print("Scraping completed.")

if __name__ == "__main__":
    main()