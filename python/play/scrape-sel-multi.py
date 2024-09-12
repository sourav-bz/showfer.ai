from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup, Comment
import time
from urllib.parse import urlparse, urljoin
import concurrent.futures
import os

BASE_DOMAIN = "https://mlada.in"

def normalize_url(url):
    if url.startswith('/'):
        return urljoin(BASE_DOMAIN, url)
    return url

def scrape_page(url):
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
            for comment in element.find_all(text=lambda text: isinstance(text, Comment)):
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
        markdown_content = extract_markdown(soup.body)

        # Create the scraped_mlada folder if it doesn't exist
        os.makedirs("scraped_mlada", exist_ok=True)
        
        # Generate a filename based on the URL
        filename = urlparse(url).path.strip('/').replace('/', '_') or 'index'
        filename = f"scraped_mlada/{filename}.md"

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

def scrape_urls(urls):
    # Create a directory to store the results
    os.makedirs("scraped_pages", exist_ok=True)
    os.chdir("scraped_pages")

    # Use ThreadPoolExecutor to run scraping in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        # Submit scraping tasks for each URL
        futures = [executor.submit(scrape_page, url) for url in urls]

        # Wait for all tasks to complete
        concurrent.futures.wait(futures)

def benchmark_scrape_urls(urls, max_workers):
    start_time = time.time()
    
    # Create a directory to store the results
    os.makedirs(f"scraped_pages_{max_workers}", exist_ok=True)
    os.chdir(f"scraped_pages_{max_workers}")

    # Use ThreadPoolExecutor to run scraping in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit scraping tasks for each URL
        futures = [executor.submit(scrape_page, url) for url in urls]

        # Wait for all tasks to complete
        concurrent.futures.wait(futures)

    end_time = time.time()
    total_time = end_time - start_time
    
    # Change back to the parent directory
    os.chdir('..')

    return total_time

def find_optimal_workers(urls, start=5, end=30, step=5):
    results = []
    for workers in range(start, end + 1, step):
        print(f"Testing with {workers} workers...")
        time_taken = benchmark_scrape_urls(urls, workers)
        results.append((workers, time_taken))
        print(f"Time taken with {workers} workers: {time_taken:.2f} seconds")
        
    # Find the optimal number of workers
    optimal_workers, best_time = min(results, key=lambda x: x[1])
    
    print("\nBenchmark Results:")
    for workers, time_taken in results:
        print(f"{workers} workers: {time_taken:.2f} seconds")
    
    print(f"\nOptimal number of workers: {optimal_workers}")
    print(f"Best time: {best_time:.2f} seconds")

    return optimal_workers

if __name__ == "__main__":
    # Read URLs from the file
    urls_to_scrape = read_urls_from_file("mlada-in-links.md")
    
    # Find the optimal number of workers
    optimal_workers = find_optimal_workers(urls_to_scrape)
    
    # Use the optimal number of workers for the final scrape
    print(f"\nPerforming final scrape with {optimal_workers} workers...")
    benchmark_scrape_urls(urls_to_scrape, optimal_workers)
    print("Scraping completed.")