import os
import re
import json
from urllib.parse import urlparse, urljoin
import requests
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import concurrent.futures
from tqdm import tqdm

# Load environment variables
load_dotenv()

# ScrapingBee API key
API_KEY = os.getenv('SCRAPINGBEE_API_KEY')

def get_links(url):
    """Fetch all links from the given URL using ScrapingBee API."""
    response = requests.get(
        url='https://app.scrapingbee.com/api/v1/',
        params={
            'api_key': API_KEY,
            'url': url,
            'extract_rules': '{"all_links":{"selector":"a@href","type":"list"}}',
        }
    )
    
    if response.status_code == 200:
        data = json.loads(response.content)
        links = data.get('all_links', [])
        return [urljoin(url, link) for link in links]
    else:
        print(f"Failed to fetch links from {url}. Status code: {response.status_code}")
        return []

def scrape_page(url):
    """Scrape a single page and extract relevant information."""
    response = requests.get(
        url='https://app.scrapingbee.com/api/v1/',
        params={
            'api_key': API_KEY,
            'url': url,
        }
    )
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        # Remove navbar and footer
        for element in soup.select('nav, header, footer'):
            element.decompose()
        
        # Extract all text content
        text_content = soup.get_text(separator='\n', strip=True)
        
        # Extract structured data (if available)
        structured_data = None
        for script in soup.find_all('script', type='application/ld+json'):
            try:
                data = json.loads(script.string)
                if isinstance(data, dict) and data.get('@type') in ['Product', 'WebPage']:
                    structured_data = data
                    break
            except json.JSONDecodeError:
                continue
        
        return {
            'url': url,
            'title': soup.title.string if soup.title else 'No title',
            'content': text_content,
            'structured_data': structured_data
        }
    else:
        print(f"Failed to scrape {url}. Status code: {response.status_code}")
        return None

def clean_text(text):
    """Clean and format text for markdown."""
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'[^\w\s-]', '', text)
    return text

def format_for_llm(data):
    """Format scraped data for LLM consumption."""
    md_content = f"# {clean_text(data['title'])}\n\n"
    md_content += f"URL: {data['url']}\n\n"
    
    if data['structured_data']:
        md_content += "## Structured Data\n\n"
        for key, value in data['structured_data'].items():
            if isinstance(value, (str, int, float)):
                md_content += f"- **{key}**: {value}\n"
        md_content += "\n"
    
    md_content += "## Content\n\n"
    md_content += data['content']
    
    return md_content

def save_to_file(domain, url, content):
    """Save formatted content to a markdown file in the domain folder."""
    domain_folder = os.path.join('scraped_data', domain)
    os.makedirs(domain_folder, exist_ok=True)
    
    filename = clean_text(urlparse(url).path.strip('/').replace('/', '_') or 'index')
    filepath = os.path.join(domain_folder, f"{filename}.md")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    # Replace with the actual e-commerce website URL
    base_url = 'https://suta.in/'
    
    # Fetch all links
    all_links = get_links(base_url)
    print(f"Found {len(all_links)} links")
    
    # Scrape each link
    domain = urlparse(base_url).netloc
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        future_to_url = {executor.submit(scrape_page, url): url for url in all_links}
        for future in tqdm(concurrent.futures.as_completed(future_to_url), total=len(all_links), desc="Scraping Progress"):
            url = future_to_url[future]
            try:
                data = future.result()
                if data:
                    formatted_content = format_for_llm(data)
                    save_to_file(domain, url, formatted_content)
            except Exception as e:
                print(f"Error processing {url}: {str(e)}")
    
    print(f"Scraping completed. Data saved in the 'scraped_data/{domain}' folder.")

if __name__ == '__main__':
    main()