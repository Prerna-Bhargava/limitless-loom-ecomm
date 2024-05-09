from flask import jsonify
from modals.orderModel import Orders 
from modals.userProductRatingModel import Rating
from bson import ObjectId  # Import ObjectId from bson
from modals.productModel import Products as Product
from mongoengine.queryset.visitor import Q


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

        orderid=str(order.id)

        for product in products:
            ratedProd = Rating(userId=user,productId=product,order=orderid)
            ratedProd.save()

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


def update_rating(request, id):
    try:
        data = request.get_json()
        rating = data.get('rating')
        productid = data.get("productid")

        print(data)

        category = Orders.objects(id=id).first()

        if not category:
            return jsonify({'success': False, 'message': 'Order not found'}), 404  # 404 Not Found
       
        # Update average rating for each product
        # for prod in category.products:

        product = Product.objects(id=ObjectId(productid)).first()
        print(product)

        print(category)
        print(category.rating)


        ratedProd = Rating.objects(Q(productId=str(product.id)) & Q(order=str(id))).first()
        ratedProd.rating=rating
        ratedProd.save()


        ratingdict={ "prod":str(product.id),"rating":rating}




        record_index = None
        for item in category.rating:
            if item["prod"] == str(product.id):
              

                print("failed")
                total_ratings = product.rating + rating - item["rating"]
                total_purchased = product.totalPurchased

                print("passed")
                average_rating = round(total_ratings / total_purchased )
                product.rating = average_rating
                product.save()
                print("Rating parameter updated for the existing record.")
                    
                item["rating"] = rating
                category.save()

                record_index=1
                break

        print("dound something",record_index)
        if record_index is None:
            # Add the rating parameter to product.rating since the record doesn't exist
            category.rating.append(ratingdict)
            category.save()


            total_purchased = product.totalPurchased +1
            total_ratings = product.rating + rating
            average_rating = round(total_ratings / total_purchased )
            product.rating = average_rating


            product.save()
            print("New rating record added to product.rating.")
      


        # if category.rating==0:
        #     total_ratings = product.rating + rating
        #     total_purchased = product.totalPurchased +1
        #     average_rating = round(total_ratings / total_purchased )
        #     print(average_rating)
        #     product.rating = average_rating
        #     product.totalPurchased = total_purchased
        #     product.save()
        # else:
        #     total_ratings = product.rating + rating - category.rating
        #     total_purchased = product.totalPurchased
        #     average_rating = round(total_ratings / total_purchased )
        #     print(average_rating)

        #     product.rating = average_rating
        #     product.totalPurchased = total_purchased
        #     product.save()




        response = {
            'success': True,
            'message': 'Order rating Updated Successfully',
            'order': category.to_json()
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in update_category_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


def update_comment(request):
    try:
        data = request.get_json()
        comment = data.get('message')
        id = data.get("id")
        name= data.get("name")
        userid = data.get("userid")

        print(data)

        
        # Update average rating for each product
        # for prod in category.products:

        product = Product.objects(id=ObjectId(id)).first()

        print(product)
        new_comment = {"username": name, "message": comment,"user_id":userid}

        
        # Append the new comment dictionary to the comments array
        product.comments.append(new_comment)

        product.save()
      


        response = {
            'success': True,
            'message': 'Order rating Updated Successfully',
            'order': product.to_json()
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