# File: routes.py

from flask import jsonify, request
from auth import supabase_auth_required
from links import get_links

def register_routes(app):
    @app.route('/get-all-links', methods=['POST', 'OPTIONS'])
    @supabase_auth_required
    def scrape_links(user_id):
        if request.method == 'OPTIONS':
            return '', 204
        
        data = request.json
        target_url = data.get('url')
        
        if not target_url:
            return jsonify({"error": "No URL provided"}), 400
        
        links = get_links(target_url)
        if links:
            return jsonify({"user_id": user_id, "links": links})
        else:
            return jsonify({"error": "Failed to retrieve links"}), 500