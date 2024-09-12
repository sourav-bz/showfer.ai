# File: auth.py

from functools import wraps
from flask import jsonify, request
from config import supabase

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