from flask import jsonify, request
from modals.productModel import Products as Product
from modals.categoryModel import Categories as Category
from slugify import slugify
from base64 import b64encode
from bson import ObjectId  # Import ObjectId from bson
from mongoengine.queryset.visitor import Q

def addproduct(request):
    try:
     name = request.json.get('name')
     slug = request.json.get('slug')
     description = request.json.get('description')
     price = float(request.json.get('price'))
     category = request.json.get('category')  # Assuming category is a string, adjust as needed
     quantity = int(request.json.get('quantity'))
     shipping = bool(request.json.get('shipping'))
     photo = request.json.get('photo')
   

     if not name:
          return jsonify({'message': 'Name is required '}), 401
     product = Product.objects(name=name).first()
     if product:
            return jsonify({'message': 'product already exists'}), 400
     else:
        product = {
            name: name,
            slug:slug,
            description: description,
            price:price,
            category: category,
            quantity: quantity,
            shipping: shipping
        }
        product = Product(name=name,
                slug=slug,
                description=description,
                price=price,
                category=category,
                quantity=quantity,
                photo=photo,
                shipping=shipping)

        
        product.save()
        response =  {
            'success': True,
            'message': 'New product created',
            'product': product.to_json()
        }
        return jsonify(response), 200
    except Exception as e:
        print(f"Error in add_product: {str(e)}")
        return jsonify({'message': 'Internal Server Error'}), 500  # 500 Internal Server Error

# Update product
def update_product(request, id):
    try:
        
        name = request.json.get('name')
        slug = request.json.get('slug')
        description = request.json.get('description')
        price = float(request.json.get('price'))
        category_id = request.json.get('category')
        category_object_id = ObjectId(category_id)
        category = Category.objects(id=category_id).first()


        # Then assign the category_object_id to product.category
        quantity = int(request.json.get('quantity'))
        shipping = bool(request.json.get('shipping'))
        photo = request.json.get('photo')
    
        
        product = Product.objects(id=id).first()

        if not product:
            return jsonify({'success': False, 'message': 'product not found'}), 404  # 404 Not Found

        product.name = name
        product.slug = slug
        product.category = category
        product.description = description
        product.photo = photo
        product.quantity = quantity
        product.shipping = shipping
        product.price = price
        
        product.save()

        response = {
            'success': True,
            'message': 'product Updated Successfully',
            'product': product.to_json()
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in update_product_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Delete Category
def delete_product(id):
    try:
        category = Product.objects(id=id).first()

        if not category:
            return jsonify({'success': False, 'message': 'Product not found'}), 404  # 404 Not Found

        category.delete()

        return jsonify({'success': True, 'message': 'Product Deleted Successfully'}), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in delete_product_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error



# Get All product
def get_all_product():
    try:
        print("hry")
        products = Product.objects().all()
        response = {
            'success': True,
            'message': 'All product List',
            'product': [product.to_json() for product in products]
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_all_product_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  

def get_price_ranges(slug):
    try:
        # Query the minimum and maximum prices from the products
        # min_price = Product.objects.order_by('price').first().price
        # max_price = Product.objects.order_by('-price').first().price

        print("callign")
        min_price = Product.objects(slug__icontains=slug).order_by('price').first().price

        print("got min price",min_price)
        max_price = Product.objects(slug__icontains=slug).order_by('-price').first().price

        # Define the number of price ranges you want
        num_ranges = 5
        if Product.objects(slug__icontains=slug).count()==1:
            num_ranges=1

        # Calculate the range width
        range_width = (max_price - min_price) / num_ranges

        # Generate the price ranges
        price_ranges = [
            {
                "id": i + 1,
                "name": f"${min_price + i * range_width:.2f} - ${min_price + (i + 1) * range_width:.2f}",
                "array": [min_price + i * range_width,min_price + (i + 1) * range_width]
            }
            for i in range(num_ranges)
        ]

        response = {
            'success': True,
            'message': 'Price ranges retrieved successfully',
            'price_ranges': price_ranges
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_price_ranges: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Get Single product
def get_product_with_categoryslug(slug):
    try:
        print(slug)

        sort_direction = request.args.get('sort', 'asc').lower()
        search_field = request.args.get('search', '').lower()

        print("sea",search_field)


        if search_field!='':
            print("filtering")
            products = Product.objects(name__icontains=search_field).all()
        else:
            products = Product.objects(slug__icontains=slug).all()


        if sort_direction == 'desc':
            products = products.order_by('-price')
        elif sort_direction == 'asc':
            products = products.order_by('price')



      
        response = {
            'success': True,
            'message': 'Get product by category Successfull',
            'product': [product.to_json() for product in products]
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_single_product_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Get Single product
def get_matching_products():
    try:

      
        searchquery = request.args.get('search_param')
        products = Product.objects(name__icontains=searchquery).all()
      
        response = {
            'success': True,
            'message': 'Get product by category Successfull',
            'product': [product.to_json() for product in products]
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_single_product_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Get All product trending sort based on totalPurchased. Paginated
def get_all_trending(request):
    try:

        filters = {}
        categories = request.json.get('category')
        if categories and len(categories)>0:
            filters['slug__in'] = categories

       
        if len(request.json.get('price'))>0:
            price_min = request.json.get('price')[0]
            price_max = request.json.get('price')[1]
            if price_min is not None and price_max is not None:
                filters['price__gte'] = price_min
                filters['price__lte'] = price_max

        page = request.json.get('page', 1)
        size = request.json.get('size', 5)

        print("category filters ",filters)

        # Applying filters and ordering to the queryset
        products = Product.objects(Q(**filters)).order_by('-totalPurchased').skip((page - 1) * size).limit(size)

        print("got product ,",products)


        response = {
            'success': True,
            'message': 'All Trending product List',
            'product': [product.to_json() for product in products]
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_all_product_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  


# Get Single product
def get_single_product(id):
    try:
        product = Product.objects(id=id).first()

        if not product:
            return jsonify({'success': False, 'message': 'product not found'}), 404  # 404 Not Found

        response = {
            'success': True,
            'message': 'Single product Successfull',
            'product': product.to_json()
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_single_product_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Delete product
def delete_product(id):
    try:
        product = Product.objects(id=id).first()

        if not product:
            return jsonify({'success': False, 'message': 'product not found'}), 404  # 404 Not Found

        product.delete()

        return jsonify({'success': True, 'message': 'product Deleted Successfully'}), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in delete_product_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error

