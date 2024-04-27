from flask_mongoengine import MongoEngine
from datetime import datetime

db = MongoEngine()

class Orders(db.Document):
    products = db.ListField(db.ReferenceField('Products'))
    payment = db.DictField()
    buyer = db.ReferenceField('Users')
    delivery_address = db.StringField(required=True)
    city = db.StringField()
    pin = db.StringField()
    email = db.StringField(required=True)
    status = db.StringField(default="Not Process", choices=["Not Process", "Processing", "Shipped", "delivered", "cancel"])
    createdAt = db.DateTimeField(default=datetime.utcnow)  # Set default value to current time
    updatedAt = db.DateTimeField(default=datetime.utcnow)  # Set default value to current time


    def to_json(self):
        return {
            "id": str(self.id),  
            "products":self.products,
            # "products": [str(product.id) for product in self.products],  # Convert ReferenceFields to string IDs
            "payment": self.payment,
            "buyer": self.buyer,  # Convert ReferenceField to string ID
            "status": self.status,
            "delivery_address": str(self.delivery_address),
            "email": str(self.email),
            "pin":self.pin,
            "city":self.city,
            "createdAt" : self.createdAt
        }
