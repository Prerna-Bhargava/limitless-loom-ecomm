from flask import Flask, request, jsonify
from flask_mongoengine import MongoEngine
from dotenv import load_dotenv
from routes import configure_routes
from modals.categoryModel import Categories as Category

import os

load_dotenv()
app = Flask(__name__)
Mongo_uri = os.getenv("MONGO_URI")
app.config['MONGODB_SETTINGS'] = {
    'host': Mongo_uri,
    'db':"test"
}
db = MongoEngine()
db.init_app(app)

# Access the name of the connected database
connected_db_name = db.get_db().name
print(f"Connected to database: {connected_db_name}")


configure_routes(app)



# Insert a document to check if it works
try:
    # Print the collection name to check if it's correct
    collection_name = Category._get_collection_name()
    print(f"Connected to collection: {collection_name}")

    # new_category = Category(name="Test Category", slug="test-category")
    # new_category.save()
    # print(f"Document inserted successfully: {new_category}")
except Exception as e:
    print(f"Error inserting document: {e}")

if __name__ == "__main__":
    app.run(debug=True)