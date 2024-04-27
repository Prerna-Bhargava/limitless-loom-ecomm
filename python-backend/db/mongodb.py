


# from pymongo import MongoClient
# import os

# Mongo_uri = os.getenv("MONGO_URI")
# mongoClient = MongoClient(Mongo_uri, serverSelectionTimeoutMS=5000)


# try:
#     print("connected to mongodb")
#     # for db_name in mongoClient.list_database_names():
#     #     print(db_name)
# except Exception:
#     print("Unable to connect to the server.")


# db = mongoClient.get_database('test')


# user_col = db.get_collection('user_collection')
# record_col = db.get_collection('record_collection')

# def get_user_collection():
#     return user_col


# def get_record_collection():
#     return record_col

# # create a bson encoder to handle Mongo Cursors


# class MongoJSONEncoder(json.JSONEncoder):
#     def default(self, o: Any) -> Any:
#         if isinstance(o, ObjectId):
#             return str(o)
#         # if isinstance(o, datetime):
#         #     return str(o)
#         return json.JSONEncoder.default(self, o)


# def create_object(data):
#     data_json = MongoJSONEncoder().encode(list(data))
#     data_obj = json.loads(data_json)
#     return data_obj    