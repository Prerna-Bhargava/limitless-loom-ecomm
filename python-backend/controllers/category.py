from flask import jsonify
from modals.categoryModel import Categories as Category
from modals.productModel import Products as Product


from slugify import slugify

def addCategory(request):
    try:
     jsondata = request.get_json()
     name = jsondata.get('name')
     group = jsondata.get('group')

     if not name:
          return jsonify({'message': 'Name is required '}), 401
     if not group:
          return jsonify({'message': 'Group is required '}), 401 
     category = Category.objects(name=name).first()
     if category:
            return jsonify({'message': 'Category already exists'}), 400
     else:
        slug = slugify(name)   
        category = {
            name: name,
            slug: slug,
            group:group
        }
        category = Category(name=name,slug=slug,group=group)
        category.save()
        response =  {
            'success': True,
            'message': 'New category created',
            'category': category.to_json()
        }
        return jsonify(response), 200
    except Exception as e:
        print(f"Error in add_category: {str(e)}")
        return jsonify({'message': 'Internal Server Error'}), 500  # 500 Internal Server Error

# Update Category
def update_category(request, id):
    try:
        data = request.get_json()
        name = data.get('name')
        group = data.get('group')

        category = Category.objects(id=id).first()

        if not category:
            return jsonify({'success': False, 'message': 'Category not found'}), 404  # 404 Not Found

        category.name = name
        category.group = group
        category.slug = slugify(name)
        category.save()

        response = {
            'success': True,
            'message': 'Category Updated Successfully',
            'category': category.to_json()
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in update_category_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Get All Categories
def get_all_categories():
    try:
        categories = Category.objects()

        print(categories)

        response = {
            'success': True,
            'message': 'All Categories List',
            'categories': [category.to_json() for category in categories]
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_all_categories_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Get Single Category
def get_single_category(id):
    try:
        category = Category.objects(id=id).first()

        if not category:
            return jsonify({'success': False, 'message': 'Category not found'}), 404  # 404 Not Found

        response = {
            'success': True,
            'message': 'Single Category Successfull',
            'category': category.to_json()
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_single_category_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Delete Category
def delete_category(id):
    try:
        category = Category.objects(id=id).first()

        if not category:
            return jsonify({'success': False, 'message': 'Category not found'}), 404  # 404 Not Found

        category.delete()

        return jsonify({'success': True, 'message': 'Category Deleted Successfully'}), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in delete_category_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


def get_group_products():
    try:
        # Get distinct group values from Categories
        groups = Category.objects.distinct('group')

        result = []
        for group in groups:
            # Get four distinct slugs for each group
            slugs = Category.objects(group=group).distinct('slug')[:4]

            products = []
            for slug in slugs:
                # Get one product for each slug
                product = Product.objects(slug=slug).first()
                if product:
                    products.append(product.to_json())

            result.append({
                'group': group,
                'slugs': slugs,
                'products': products
            })

        return jsonify({'success': True, 'data': result}), 200

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_group_products: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500