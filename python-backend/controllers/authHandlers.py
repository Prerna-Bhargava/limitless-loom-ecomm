import jwt
import os
import bcrypt
from functools import wraps
from flask import request, abort
from modals.userModel import Users as User
from flask import jsonify

def verify_jwt_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            token= None
            print(request)
            if "Authorization" in request.headers:
                print(request.headers)  
                if len(request.headers["Authorization"].split(" "))>1:
                    token = request.headers["Authorization"].split(" ")[1]
            if not token:
                return {
                    "message": "Authentication Token is missing!",
                    "data": None,
                    "error": "Unauthorized"
                }, 401
            
            payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
            current_user=User.objects(email=payload["email"]).get()
            print(current_user)
            if current_user.role!=1:
                return {
                "message": "Only admin can access this endpoint!",
                "data": None,
                "error":  "Unauthorized"
                }, 401
            if current_user is None:
                return {
                "message": "Invalid Authentication token!",
                "data": None,
                "error":  "Unauthorized"
                }, 401
        except jwt.ExpiredSignatureError:
            return {'error': 'Token has expired',"message": "Token has Expried!"},401
        except jwt.InvalidTokenError:
            return {'error': 'Invalid token,"message": "Invalid Authentication token!'},400
        return f(*args, **kwargs)

    return decorated

def verify_user_jwt_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            token= None
            print(request)
            if "Authorization" in request.headers:
                print(request.headers)  
                if len(request.headers["Authorization"].split(" "))>1:
                    token = request.headers["Authorization"].split(" ")[1]
            if not token:
                return {
                    "message": "Authentication Token is missing!",
                    "data": None,
                    "error": "Unauthorized"
                }, 401
            
            payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
            current_user=User.objects(email=payload["email"])
            if current_user is None:
                return {
                "message": "Invalid Authentication token!",
                "data": None,
                "error":  "Unauthorized"
                }, 401
        except jwt.ExpiredSignatureError:
            return {'error': 'Token has expired',"message": "Token has Expried!"},401
        except jwt.InvalidTokenError:
            return {'error': 'Invalid token,"message": "Invalid Authentication token!'},400
        return f(*args, **kwargs)

    return decorated

def hash_password(password):
    try:
        salt_rounds = 10
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(salt_rounds))
        return hashed_password.decode('utf-8')
    except Exception as e:
        print(e)

def compare_password(password, hashed_password):
    try:
        is_pwd_match = bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
        print("is_pwd_match:", is_pwd_match)
        return is_pwd_match
    except Exception as e:
        print(e)
    return password == hashed_password

# # Example Usage:
# plain_password = "your_password"
# hashed_password = hash_password(plain_password)
# print("Hashed Password:", hashed_password)

# # For comparison, you can either use the hashed password generated above or re-hash the plain password for testing.
# password_match = compare_password(plain_password, hashed_password)
# print("Password Match:", password_match)
