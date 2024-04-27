from flask_mongoengine import MongoEngine

db = MongoEngine()
class Categories(db.Document):

    image = db.StringField(lowercase=True)

    def to_json(self):
        return {
            "id": str(self.id),  
            "image": self.name
        }
