from flask_mongoengine import MongoEngine

db = MongoEngine()

class Users(db.Document):
    name = db.StringField(required=True, trim=True,default="")
    email = db.StringField(required=True, unique=True)
    password = db.StringField(required=True,default="")
    phone = db.StringField(required=True,default="")
    address = db.StringField(required=True,default="")  
    answer = db.StringField(required=True,default="")
    role = db.IntField(default=0)

    def to_json(self):
        return {
            "id": str(self.id),  
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "answer":self.answer,
            "role": self.role,
            "password":self.password
        }
