from flask import jsonify
from modals.userModel import Users as User
from controllers.authHandlers import hash_password,compare_password
from slugify import slugify
import requests
import os
import jwt
from datetime import datetime, timedelta

GOOGLE_CLIENT_ID = os.getenv('CLIENT_ID')  # Replace with your actual Google client ID

def google_callback(request):
    try:
        token = request.get_json().get('access_token')
        google_response = requests.get(f'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={token}')
        google_data = google_response.json()

        if 'error_description' in google_data:
            return jsonify({'error': 'Invalid access token'}), 401
        
        email = google_data['email']
        payload = {
            'email': email,
            'exp': datetime.utcnow() + timedelta(days=7)
        }

        # Generate token
        token = jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm='HS256')
        user = User.objects(email=email).first()
        userobj = {
            "email":user.to_json().get("email"),
            "id":user.to_json().get("id"),
            "token":token,
        }
        if user:
            return jsonify({'success': True, 'message': 'Google login successful','user':userobj})
    
        user = User(email=email)
        user.save()

        return jsonify({'success': True, 'message': 'Google login successful','user':userobj})

    except Exception as e:
        print(f'Error during Google login: {e}')
        return jsonify({'error': 'Internal server error'}), 500

def register(request):
    try:
     jsondata = request.get_json()

     try:
        for field in ["name","email","password","phone","address","answer"]:
            jsondata.get(field)
     except KeyError as e:
        return jsonify({"message": f"{e.args[0]} is required!"}), 401
     
     name = jsondata.get('name')
     email = jsondata.get('email')
     password = jsondata.get('password')
     phone = jsondata.get('phone')
     address = jsondata.get('address')
     answer = jsondata.get('answer')
    
     user = User.objects(email=email).first()
     if user:
            return jsonify({'message': 'user already exists'}), 400
     else: 
        hashedpassword = hash_password(password) 

        user = User(name=name,email=email,password=hashedpassword,phone=phone,address=address,answer=answer)
        user.save()

        payload = {
            'email': email,
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        token = jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm='HS256')
        response = {
            "message":"Register success",
            "email":user.to_json().get("email"),
            "id":user.to_json().get("id"),
            "admin": user.to_json().get("role"),
            "address":user.to_json().get("address"),
            "name":user.to_json().get("name"),
            "token":token,
        }

        return jsonify(response), 200
    except Exception as e:
        print(f"Error in registering : {str(e)}")
        return jsonify({'message': 'Internal Server Error'}), 500  # 500 Internal Server Error

def login(request):
    try:
     jsondata = request.get_json()

     try:
        for field in ["email","password"]:
            jsondata.get(field)
     except KeyError as e:
        return jsonify({"message": f"{e.args[0]} is required!"}), 401
     
     email = jsondata.get('email')
     password = jsondata.get('password')
    
     user = User.objects(email=email).first()
     if user:
        password_match = compare_password(password, user.to_json().get('password'))
   
     if not user:
            return jsonify({'message': 'User not exists. Please register!'}), 400
     elif not password_match:      
            return jsonify({'message': 'Wrong Password!'}), 400
     else:
        payload = {
            'email': email,
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        token = jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm='HS256')
        response = {
            "message":"Login success",
            "email":user.to_json().get("email"),
            "id":user.to_json().get("id"),
            "admin": user.to_json().get("role"),
            "address":user.to_json().get("address"),
            "name":user.to_json().get("name"),
            "token":token,
        }
        
        return jsonify(response), 200
    except Exception as e:
        print(f"Error in registering : {str(e)}")
        return jsonify({'message': 'Internal Server Error'}), 500  # 500 Internal Server Error

def reset_password(request):
    try:
     jsondata = request.get_json()

     try:
        for field in ["email","password","answer"]:
            jsondata.get(field)
     except KeyError as e:
        return jsonify({"message": f"{e.args[0]} is required!"}), 401
     
     email = jsondata.get('email')
     newpassword = jsondata.get('password')
     answer = jsondata.get('answer')
    
     user = User.objects(email=email).first()
     print(user.to_json())
   
     if not user:
            return jsonify({'message': 'User not exists. Please register!'}), 400
     elif answer!=user.to_json().get("answer"):      
            return jsonify({'message': 'Answer to secret question is wrong!'}), 400
     else:
        user.password = hash_password(newpassword)
        user.save()
        payload = {
            'email': email,
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        token = jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm='HS256')
        response = {
            "message":"Reset Password success",
            "email":user.to_json().get("email"),
            "id":user.to_json().get("id"),
            "admin": user.to_json().get("role"),
            "address":user.to_json().get("address"),
            "name":user.to_json().get("name"),
            "token":token,
        }
        
        return jsonify(response), 200
    except Exception as e:
        print(f"Error in registering : {str(e)}")
        return jsonify({'message': 'Internal Server Error'}), 500  # 500 Internal Server Error

def update_profile(request,id):
    try:
        user = User.objects(id=id).first()

        if not user:
            return jsonify({'success': False, 'message': 'user not found'}), 404  # 404 Not Found


        user.name = request.json.get("name")
        user.address = request.json.get("address")
        user.save()

        response = {
            'success': True,
            'message': 'Single user Successfull',
            'user': user.to_json()
        }

        return jsonify(response), 200  

    except Exception as e:
        print(f"Error in get_single_user_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


def get_all_user():
    try:
        users = User.objects()
        response = {
            'success': True,
            'message': 'All Categories List',
            'categories': [user.to_json() for user in users]
        }

        return jsonify(response), 200  

    except Exception as e:
        print(f"Error in get_all_user: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error

def get_single_user(email):
    try:
        user = User.objects(email=email).first()

        if not user:
            return jsonify({'success': False, 'message': 'user not found'}), 404  # 404 Not Found

        response = {
            'success': True,
            'message': 'Single user Successfull',
            'user': user.to_json()
        }

        return jsonify(response), 200  

    except Exception as e:
        print(f"Error in get_single_user_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error

def delete_user(email):
    try:
        user = User.objects(email=email).first()

        if not user:
            return jsonify({'success': False, 'message': 'user not found'}), 404  # 404 Not Found

        user.delete()

        return jsonify({'success': True, 'message': 'user Deleted Successfully'}), 200  # 200 OK

    except Exception as e:
        print(f"Error in delete_user_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error

