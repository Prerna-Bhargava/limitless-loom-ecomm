from flask import jsonify
from modals.orderModel import Orders 
from bson import ObjectId  # Import ObjectId from bson

def addOrder(request):
    try:
        jsondata = request.get_json()

        print(jsondata)
        user = jsondata.get('user')
        products = jsondata.get('products')
        address = jsondata.get("address")
        city = jsondata.get("city")
        pin = jsondata.get("pin")
        mail = jsondata.get("email")
        payment = {
            "mode":"COD"
        }


     
        order = Orders(products=products,buyer=user,delivery_address = address,email=mail,payment=payment,city=city,pin=pin)
        order.save()
        response =  {
            'success': True,
            'message': 'Order created Successfully',
            'order': order.to_json()
        }
        return jsonify(response), 200
    except Exception as e:
        print(f"Error in add_category: {str(e)}")
        return jsonify({'message': 'Internal Server Error'}), 500  # 500 Internal Server Error

# Update Category
def update_order(request, id):
    try:
        data = request.get_json()
        status = data.get('status')

        category = Orders.objects(id=id).first()

        if not category:
            return jsonify({'success': False, 'message': 'Order not found'}), 404  # 404 Not Found

        category.status =status
       
        category.save()

        response = {
            'success': True,
            'message': 'Order Status Updated Successfully',
            'order': category.to_json()
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in update_category_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Get All Categories
def get_all_Orders():
    try:
        categories = Orders.objects()

        print(categories)

        response = {
            'success': True,
            'message': 'All Categories List',
            'orders': [category.to_json() for category in categories]
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_all_categories_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Get Single Category
def get_single_order(id):
    try:
        category = Orders.objects(id=id).first()

        if not category:
            return jsonify({'success': False, 'message': 'Category not found'}), 404  # 404 Not Found

        response = {
            'success': True,
            'message': 'Single Category Successfull',
            'order': category.to_json()
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_single_category_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error



# Get Single Category
def get_user_orders(id):
    try:
        # Get distinct group values from Categories
        groups = Orders.objects(buyer=ObjectId(id))

        response = {
            'success': True,
            'message': 'All Categories List',
            'orders': [category.to_json() for category in groups]
        }

        return jsonify(response), 200  # 200
       
    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_group_products: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500