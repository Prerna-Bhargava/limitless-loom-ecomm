from flask import jsonify, request
from tasks import get_task_by_id, create_task
from modals.userModel import Users
from controllers.recommendation import get_all_top_rated,get_recommended_products,get_recommended_products_search
from controllers.authHandlers import verify_jwt_token,verify_user_jwt_token
from controllers.category import addCategory, get_all_categories,update_category,delete_category,get_single_category,get_group_products
from controllers.productCategory import get_matching_products,update_product,delete_product,get_all_trending, addproduct, get_all_product,get_product_with_categoryslug,get_single_product,get_price_ranges
from controllers.userController import update_profile,google_callback,register,login,reset_password,get_single_user,delete_user,get_all_user
from controllers.orderHandlers import update_rating,addOrder,get_all_Orders,update_order,get_single_order,get_user_orders,update_comment

def configure_routes(app):
    
    @app.route('/', methods=['GET'])
    def connect():
        return jsonify({'msg':"connected to app"}), 200

    # User Routes
    @app.route('/auth/google/callback', methods=['POST'])
    def logingoogle():
        return google_callback(request)
    
    @app.route('/auth/register', methods=['POST'])
    def registerUser():
        return register(request)
    
    @app.route('/auth/login', methods=['POST'])
    def loginUser():
        return login(request)
    
    @app.route('/auth/resetPassword', methods=['POST'])
    def resetPassword():
        return reset_password(request)

    @app.route('/auth/user', methods=['GET'])
    def getalluser():
        return get_all_user(request)
    
    @app.route('/auth/user/<string:id>', methods=['GET'])
    def getsingleuser(id):
        print("id is ", id)
        return get_single_user(id)
    
    @app.route('/user/profile/<string:id>', methods=['PUT'])
    def update_user(id):
        return update_profile(request,id)
    
    @app.route('/auth/user/<string:id>', methods=['DELETE'])
    def deleteuser(id):
        return delete_user(id)
    


    # Category Routes
    @app.route('/category', methods=['POST'])
    @verify_jwt_token
    def add_category():
        return addCategory(request)
    
    @app.route('/category/list', methods=['GET'])
    def get_all_category():
        return get_all_categories()
    
    @app.route('/category/<string:id>', methods=['PUT'])
    @verify_jwt_token
    def updatecategory(id):
        return update_category(request,id)
    
    @app.route('/category/<string:id>', methods=['GET'])
    def get_category(id):
        print("id is ", id)
        return get_single_category(id)
    
    @app.route('/category/<string:id>', methods=['DELETE'])
    @verify_jwt_token
    def deletecatgory(id):
        return delete_category(id)
    
    @app.route('/category/group', methods=['GET'])
    def get_group_product():
        return get_group_products()
    


    # product Routes
    @app.route('/product', methods=['POST'])
    @verify_jwt_token
    def add_product():
        return addproduct(request)
    
    @app.route('/product/<string:id>', methods=['PUT'])
    @verify_jwt_token
    def update_prod(id):
        return update_product(request,id)
    
    @app.route('/product/<string:id>', methods=['DELETE'])
    @verify_jwt_token
    def delete_prod(id):
        return delete_product(id)
    

    @app.route('/product/list', methods=['GET'])
    def get_all_prod():
        return get_all_product()
    
    @app.route('/product/search', methods=['GET'])
    def get_matching_product():
        return get_matching_products()
    
     
    @app.route('/product/trending', methods=['POST'])
    def get_all_trending_list():
        return get_all_trending(request)
    
    @app.route('/price/range/<string:slug>', methods=['GET'])
    def get_price_range(slug):
        return get_price_ranges(slug)

    @app.route('/product/list/slug/<string:slug>', methods=['GET'])
    def get_product_category(slug):
        return get_product_with_categoryslug(slug)
    
    @app.route('/product/list/<string:id>', methods=['GET'])
    def get_product(id):
        return get_single_product(id)
    


    # orders

     # Category Routes
    @app.route('/order/create', methods=['POST'])
    @verify_user_jwt_token
    def add_order():
        return addOrder(request)
    
    @app.route('/order/list', methods=['GET'])
    @verify_jwt_token
    def get_all():
        return get_all_Orders()
    
    @app.route('/order/<string:id>', methods=['PUT'])
    @verify_jwt_token
    def updateorder(id):
        return update_order(request,id)
    
    @app.route('/order/rating/<string:id>', methods=['PUT'])
    @verify_user_jwt_token
    def updaterating(id):
        return update_rating(request,id)
    

    @app.route('/order/list/<string:id>', methods=['GET'])
    @verify_user_jwt_token
    def user_order(id):
        return get_user_orders(id)
    

    @app.route('/user/feedback', methods=['POST'])
    def update_order_comment():
        return update_comment(request)
    
    # recommendations

    @app.route('/product/toprated', methods=['POST'])
    def get_all_rated():
        return get_all_top_rated(request)

    @app.route('/product/user/list/<string:id>', methods=['GET'])
    def get_recommendation(id):
        return get_recommended_products(id)
    
    @app.route('/product/user/list/search', methods=['POST'])
    def get_recommendation_search():
        return get_recommended_products_search(request)
