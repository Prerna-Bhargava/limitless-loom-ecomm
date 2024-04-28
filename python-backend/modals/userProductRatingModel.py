from flask_mongoengine import MongoEngine
from datetime import datetime

db = MongoEngine()

class Rating(db.Document):
    productId = db.StringField()
    userId = db.StringField()
    rating=db.IntField(default=0)
    order= db.StringField()
    createdAt = db.DateTimeField(default=datetime.utcnow)  # Set default value to current time
    updatedAt = db.DateTimeField(default=datetime.utcnow)  # Set default value to current time


    def to_json(self):
        return {
            "id": str(self.id),  
            
            "userId": str(self.buyer),
            "order":self.order,
            "productId":self.product,
            "createdAt" : self.createdAt,
            "rating":self.rating
        }
