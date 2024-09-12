# File: app.py

from flask import Flask, make_response, request
from routes import register_routes

app = Flask(__name__)

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

register_routes(app)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3033)