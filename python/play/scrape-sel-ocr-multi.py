from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup, Comment
import time
from urllib.parse import urlparse, urljoin
import concurrent.futures
import os
import requests
from PIL import Image
import pytesseract
from io import BytesIO
from tqdm import tqdm

BASE_DOMAIN = "https://mlada.in"

def normalize_url(url):
    if url.startswith('/'):
        return urljoin(BASE_DOMAIN, url)
    return url

def do_ocr(image_url):
    try:
        response = requests.get(image_url)
        img = Image.open(BytesIO(response.content))
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        return f"Error performing OCR: {str(e)}"

def scrape_page(url, perform_ocr=True):
    # Set up the WebDriver
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        # Navigate to the page
        driver.get(url)

        # Wait for the page to load (adjust time as needed)
        time.sleep(5)

        # Get the page source
        page_source = driver.page_source

        # Parse the HTML
        soup = BeautifulSoup(page_source, 'html.parser')

        # Extract the domain from the URL
        domain = urlparse(url).scheme + "://" + urlparse(url).netloc

        # Function to recursively extract structure and convert to Markdown
        def extract_markdown(element, level=0):
            if element.name is None:
                return element.string.strip() if element.string else ""
            
            if element.name in ['script', 'style', 'svg', 'select']:
                return ""
            
            markdown = ""
            
            # Remove HTML comments
            for comment in element.find_all(string=lambda text: isinstance(text, Comment)):
                comment.extract()
            
            if element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                markdown += "#" * int(element.name[1]) + " " + element.get_text().strip() + "\n\n"
            elif element.name == 'p':
                markdown += element.get_text().strip() + "\n\n"
            elif element.name == 'a':
                href = element.get('href', '')
                href = normalize_url(href)
                text = element.get_text().strip()
                markdown += f"[{text}]({href})\n\n"
            elif element.name == 'img':
                src = element.get('src', '')
                src = normalize_url(src)
                alt = element.get('alt', '')
                markdown += f"![{alt}]({src})\n\n"
                
                # Perform OCR on the image if enabled
                if perform_ocr:
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
            elif element.name == 'option':
                value = element.get('value', '')
                text = element.get_text().strip()
                markdown += f"- {text} (value: {value})\n"
            else:
                for child in element.children:
                    if child.name is not None or (isinstance(child, str) and child.strip()):
                        child_content = extract_markdown(child, level+1)
                        if child_content.strip():
                            markdown += child_content + "\n\n"  # Add extra newline for spacing
            
            return markdown.strip()  # Remove trailing newlines

        # Extract the Markdown content
        image_reports = []
        markdown_content = extract_markdown(soup.body)

        # Add image reports to the end of the markdown content
        if image_reports:
            markdown_content += "\n\n## Image OCR Report\n\n"
            for img_src, ocr_result in image_reports:
                markdown_content += f"### Image: {img_src}\n\n"
                markdown_content += f"OCR Result: {ocr_result}\n\n"

        # Generate a filename based on the URL
        filename = urlparse(url).path.strip('/').replace('/', '_') or 'index'
        filename = f"{filename}.md"

        # Save the Markdown content to a file
        with open(filename, "w", encoding="utf-8") as f:
            f.write(markdown_content)

        print(f"Scraping completed for {url}. Content saved to {filename}")

    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")

    finally:
        # Close the browser
        driver.quit()

def read_urls_from_file(filename):
    with open(filename, 'r') as file:
        return [normalize_url(line.strip()) for line in file if line.strip()]

def scrape_urls(urls, max_workers=15, perform_ocr=True):
    start_time = time.time()
    
    # Create a directory to store the results
    os.makedirs("scraped_pages", exist_ok=True)
    os.chdir("scraped_pages")

    # Use ThreadPoolExecutor to run scraping in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit scraping tasks for each URL
        futures = [executor.submit(scrape_page, url, perform_ocr) for url in urls]

        # Use tqdm to create a progress bar
        for _ in tqdm(concurrent.futures.as_completed(futures), total=len(urls), desc="Scraping Progress"):
            pass

    end_time = time.time()
    total_time = end_time - start_time
    
    print(f"\nTotal time taken: {total_time:.2f} seconds")

if __name__ == "__main__":
    # Read URLs from the file
    urls_to_scrape = read_urls_from_file("mlada-in-links.md")
    
    # Set whether to perform OCR or not
    perform_ocr = True  # Change this to False to skip OCR

    # Use 15 workers for the scrape
    print(f"\nPerforming scrape with 15 workers...")
    scrape_urls(urls_to_scrape, max_workers=15, perform_ocr=perform_ocr)
    print("Scraping completed.")