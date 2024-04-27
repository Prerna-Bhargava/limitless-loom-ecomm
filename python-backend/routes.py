from flask import jsonify, request
from tasks import get_task_by_id, create_task
from modals.userModel import Users
from controllers.category import addCategory, get_all_categories,update_category,delete_category,get_single_category,get_group_products
from controllers.productCategory import update_product,delete_product,get_all_trending, addproduct, get_all_product,get_product_with_categoryslug,get_single_product,get_price_ranges
from controllers.userController import update_profile,google_callback,register,login,reset_password,get_single_user,delete_user,get_all_user
from controllers.orderHandlers import addOrder,update_order,get_all_Orders,get_single_order,get_user_orders
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
    def add_category():
        return addCategory(request)
    
    @app.route('/category/list', methods=['GET'])
    def get_all_category():
        return get_all_categories()
    
    @app.route('/category/<string:id>', methods=['PUT'])
    def updatecategory(id):
        return update_category(request,id)
    
    @app.route('/category/<string:id>', methods=['GET'])
    def get_category(id):
        print("id is ", id)
        return get_single_category(id)
    
    @app.route('/category/<string:id>', methods=['DELETE'])
    def deletecatgory(id):
        return delete_category(id)
    
    @app.route('/category/group', methods=['GET'])
    def get_group_product():
        return get_group_products()
    


    # product Routes
    @app.route('/product', methods=['POST'])
    def add_product():
        return addproduct(request)
    
    @app.route('/product/<string:id>', methods=['PUT'])
    def update_prod(id):
        return update_product(request,id)
    
    @app.route('/product/<string:id>', methods=['DELETE'])
    def delete_prod(id):
        return delete_product(id)
    

    @app.route('/product/list', methods=['GET'])
    def get_all_prod():
        return get_all_product()
    
     
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
    def add_order():
        return addOrder(request)
    
    @app.route('/order/list', methods=['GET'])
    def get_all():
        return get_all_Orders()
    
    @app.route('/order/<string:id>', methods=['PUT'])
    def updateorder(id):
        return update_order(request,id)
    
    @app.route('/order/list/<string:id>', methods=['GET'])
    def user_order(id):
        return get_user_orders(id)