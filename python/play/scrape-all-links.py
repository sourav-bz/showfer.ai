from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from urllib.parse import urlparse
import time
import os

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    try:
        # Use the Homebrew-installed ChromeDriver
        service = Service("/opt/homebrew/bin/chromedriver")
        return webdriver.Chrome(service=service, options=chrome_options)
    except Exception as e:
        print(f"Error setting up ChromeDriver: {str(e)}")
        return None

def is_image_link(url):
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp']
    return os.path.splitext(urlparse(url).path)[1].lower() in image_extensions

def get_links(url):
    driver = setup_driver()
    driver.get(url)
    time.sleep(5)
    links = driver.find_elements(By.TAG_NAME, 'a')
    href_list = [link.get_attribute('href') for link in links if link.get_attribute('href') and not is_image_link(link.get_attribute('href'))]
    driver.quit()

    print(f"Found {len(href_list)} non-image links.")
    return href_list

def save_to_markdown(url, links):
    domain = urlparse(url).netloc
    filename = f"{domain}.md"

    with open(filename, 'w', encoding='utf-8') as f:
        for link in links:
            f.write(f"{link}\n")

    print(f"Links saved to {filename}")
    print(f"Total number of links: {len(links)}")

if __name__ == "__main__":
    target_url = "https://mlada.in"
    driver = setup_driver()
    if driver:
        links = get_links(target_url)
        save_to_markdown(target_url, links)
        driver.quit()
    else:
        print("Failed to set up the driver. Please check your Chrome and ChromeDriver installations.")