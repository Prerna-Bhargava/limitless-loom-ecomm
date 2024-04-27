from flask_mongoengine import MongoEngine

db = MongoEngine()
class Categories(db.Document):

    name = db.StringField()
    group = db.StringField()
    slug = db.StringField(lowercase=True)

    def to_json(self):
        return {
            "id": str(self.id),  
            "name": self.name,
            "slug": self.slug,
            "group":self.group
        }
