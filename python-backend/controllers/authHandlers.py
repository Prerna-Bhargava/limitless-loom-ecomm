import jwt
import os
import bcrypt

def verify_jwt_token(token):
    try:
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return {'error': 'Token has expired'}
    except jwt.InvalidTokenError:
        return {'error': 'Invalid token'}

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
