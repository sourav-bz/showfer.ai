import os
import time
from functools import wraps
from urllib.parse import urlparse
from datetime import datetime, timezone
import traceback

import jwt
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, make_response, request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from supabase import Client, create_client
from apscheduler.schedulers.background import BackgroundScheduler
from domain_scraper import scrape_domain

load_dotenv()
app = Flask(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

scheduler = BackgroundScheduler()
last_check_datetime = datetime.min.replace(tzinfo=timezone.utc)

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return add_cors_headers(make_response())

@app.after_request
def after_request(response):
    return add_cors_headers(response)

def verify_supabase_token(token):
    try:
        response = supabase.auth.get_user(token)
        return response.user.id
    except Exception as e:
        return 'Token expired' if "expired" in str(e).lower() else 'Invalid token'

def supabase_auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Authorization header is missing'}), 401
        
        token = auth_header.split(' ')[1] if len(auth_header.split(' ')) > 1 else None
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        user_id = verify_supabase_token(token)
        if isinstance(user_id, str) and (user_id.startswith('Invalid') or user_id == 'Token expired'):
            return jsonify({'message': user_id}), 401
        
        return f(user_id, *args, **kwargs)
    return decorated

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    try:
        service = Service("/opt/homebrew/bin/chromedriver")
        return webdriver.Chrome(service=service, options=chrome_options)
    except Exception as e:
        print(f"Error setting up ChromeDriver: {str(e)}")
        return None

def is_image_link(url):
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp']
    return os.path.splitext(urlparse(url).path)[1].lower() in image_extensions

def get_links(url):
    """Fetch all links from the given URL using ScrapingBee API."""
    response = requests.get(
        url='https://app.scrapingbee.com/api/v1/',
        params={
            'api_key': os.getenv('SCRAPINGBEE_API_KEY'),
            'url': url,
            'extract_rules': '{"all_links":{"selector":"a","type":"list","output":{"url":"@href"}}}',
        }
    )
    
    if response.status_code == 200:
        data = json.loads(response.content)
        links = data.get('all_links', [])
        return [urljoin(url, link) for link in links if not is_image_link(link)]
    else:
        print(f"Failed to fetch links from {url}. Status code: {response.status_code}")
        return []

def is_image_link(url):
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp']
    return os.path.splitext(urlparse(url).path)[1].lower() in image_extensions

@app.route('/get-all-links', methods=['POST', 'OPTIONS'])
@supabase_auth_required
def scrape_links(user_id):
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.json
        target_url = data.get('url')
        
        if not target_url:
            return jsonify({"error": "No URL provided"}), 400
        
        links = get_links(target_url)
        if links:
            return jsonify({"user_id": user_id, "links": links})
        else:
            return jsonify({"error": "Failed to retrieve links"}), 500
    except Exception as e:
        print(f"Error in scrape_links: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/create-assistant', methods=['POST'])
@supabase_auth_required
def create_assistant(user_id):
    try:
        # Get settings from request body    
        setting = request.json
        print(f"Setting: {setting}")
        if not setting:
            return jsonify({"error": "No settings provided in request body"}), 400

        settings_id = setting.get('id')
        name = setting.get('name')
        website_url = setting.get('website_url')
        overall_status = setting.get('overall_status')
        num_links = 10
        list_of_links = setting.get('list_of_links')

        if not all([settings_id, name, website_url, overall_status, list_of_links]):
            return jsonify({"error": "Missing required fields in settings"}), 400
        
        load_dotenv()
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_API_KEY")
        
        if not url or not key:
            raise ValueError("SUPABASE_URL or SUPABASE_API_KEY not found in .env file")

        global supabase
        supabase = create_client(url, key)

        domain = website_url
        domain_name = urlparse(domain).netloc

        ## TODO: Have to add a server-side check based on the billing later on
        links_to_scrape = list_of_links

        if overall_status == "untrained":
            print(f"Name: {name}, Website URL: {website_url}, Current Status: {overall_status}")
            # Update overall_status to "in_progress"
            supabase.table('assistant_settings').update({"overall_status": "fetching_info"}).eq("id", settings_id).execute()
            print("Status updated to 'fetching_info'")

            assistant_id = scrape_domain(name, website_url, links_to_scrape, settings_id)
            supabase.table('assistant_settings').update({
                    "overall_status": "trained",
                    "openai_assistant_id": assistant_id
                }).eq("id", settings_id).execute()
            print(f"Updated overall_status to 'trained' and saved assistant_id for settings_id: {settings_id}")

            return jsonify({"message": "Assistant creation started successfully"}), 200
        elif overall_status == "in_progress" or overall_status == "fetching_info" or overall_status=="structuring_info" or overall_status == "creating_assistant":
            return jsonify({"message": "Assistant creation is already in progress"}), 400
        else:
            return jsonify({"message": "Assistant is already trained"}), 400

    except Exception as e:
        print(f"Error creating assistant: {str(e)}")
        return jsonify({"error": f"Failed to create assistant: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3033)