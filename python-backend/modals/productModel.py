from flask_mongoengine import MongoEngine
from datetime import datetime
from base64 import b64encode
import base64
db = MongoEngine()

class Products(db.Document):
    name = db.StringField(required=True)
    rating = db.IntField(default=0)
    slug = db.StringField(required=True)
    description = db.StringField(required=True)
    price = db.FloatField(required=True)
    category = db.ReferenceField('Categories', required=True)
    quantity = db.IntField(required=True)
    photo = db.StringField(required=True)
    shipping = db.BooleanField()
    comments = db.ListField(db.DictField()) 
    totalPurchased = db.IntField(default=0)
    createdAt = db.DateTimeField(default=datetime.utcnow)  # Set default value to current time
    updatedAt = db.DateTimeField(default=datetime.utcnow)  # Set default value to current time

    def to_json(self):
    

        return {
            "id": str(self.id),  
            "name": self.name,
            "slug": self.slug,
            "totalPurchased":self.totalPurchased,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "quantity": self.quantity,
            "photo": self.photo,
            "shipping": self.shipping,
            "rating": self.rating,
            "comments":self.comments,
        }
    
   