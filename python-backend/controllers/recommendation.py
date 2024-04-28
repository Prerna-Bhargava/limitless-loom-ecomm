from flask import jsonify, request
from modals.productModel import Products as Product
from modals.categoryModel import Categories as Category
from modals.orderModel import Orders 
from modals.userProductRatingModel import Rating
import math
from mongoengine.queryset.visitor import Q
import pandas as pd
import numpy as np
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.neighbors import NearestNeighbors
from sklearn.cluster import KMeans
from sklearn.metrics import adjusted_rand_score

print("inside recommendation")
# Recommendation System - Popularity Based

# Get All product trending sort based on totalPurchased. Paginated
def get_all_top_rated(request):
    try:

        filters = {}
        categories = request.json.get('category')
        if categories and len(categories)>0:
            filters['slug__in'] = categories

        page = request.json.get('page', 1)
        size = request.json.get('size', 5)

        print("category filters ",filters)

        # Applying filters and ordering to the queryset
        products = Product.objects(Q(**filters)).order_by('-rating').skip((page - 1) * size).limit(size)

        response = {
            'success': True,
            'message': 'Top Rated Products',
            'product': [product.to_json() for product in products]
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_all_product_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  

# Model-based collaborative filtering system - based on user purchasing history and other users rating for similar products
def get_recommended_products(id):
    try:


        print("recommendation")
        # Applying filters and ordering to the queryset
        ratings_data = Rating.objects().all()

        # Convert data to list of dictionaries
        data_list = []
        for order in ratings_data:
            if order.rating!=0:
                data_list.append({
                    'UserId': order.userId,
                    'ProductId': order.productId,
                    'Rating': order.rating
                })

        # Create DataFrame
        df = pd.DataFrame(data_list)

        print(df)

        # Create the utility matrix
        utility_matrix = df.pivot_table(values='Rating', index='UserId', columns='ProductId', fill_value=0)

        # Show the utility matrix
        print(utility_matrix.head())

        X = utility_matrix.T
        X1 = X
        print("printing head atter transforming")
        print(X.head())
       
        SVD = TruncatedSVD(n_components=X.shape[1])
        decomposed_matrix = SVD.fit_transform(X)
        decomposed_matrix.shape

        correlation_matrix = np.corrcoef(decomposed_matrix)
        correlation_matrix.shape

            

        user_history = utility_matrix.loc[id]
        # List of products bought by the user (assuming utility_matrix is a pandas DataFrame)
        bought_products = list(user_history[user_history > 0].index)

        print("products bough are ",bought_products)

        recommended_products = []

        # Loop through each product bought by the user
        for product_id in bought_products:
            # Get the index of the product in the utility matrix
          
            product_names = list(X.index)
            product_index = product_names.index(product_id)
            
            # Get the correlation values for the product with all other products
            correlation_with_product = correlation_matrix[product_index]

            for correlation_value in correlation_with_product:
                print(correlation_value)  # Print each correlation value individually   
            
            # Find highly correlated products (correlation > threshold, e.g., 0.90)
            highly_correlated_products = list(utility_matrix.columns[correlation_with_product > 0.5])

            print(highly_correlated_products)
            
            # Remove the products already bought by the user from the recommendations
            recommended_products.extend([p for p in highly_correlated_products if p not in bought_products])

        # Remove duplicate recommendations
        recommended_products = list(set(recommended_products))
        print(recommended_products)
        matching_products = Product.objects(id__in=recommended_products).all()


        response = {
            'success': True,
            'message': 'Top Rated Products',
            'product': [product.to_json() for product in matching_products]

        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get recommended controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  


# Get All product trending sort based on totalPurchased. Paginated
def get_recommended_products_search():
    try:

        products = Product.objects().all()

        data_list = []
        for order in products:
                data_list.append({
                    'description': order.description,
        })

        df = pd.DataFrame(data_list)
        print(df.head())

        product_descriptions1 = df.head(500)
        # product_descriptions1.iloc[:,1]


        vectorizer = TfidfVectorizer(stop_words='english')
        X1 = vectorizer.fit_transform(product_descriptions1["description"])
        X1

        # Fitting K-Means to the dataset

        X=X1

        true_k = 6

        model = KMeans(n_clusters=true_k, init='k-means++', max_iter=100, n_init=1)
        model.fit(X1)

        print("Top terms per cluster:")
        order_centroids = model.cluster_centers_.argsort()[:, ::-1]
        terms = vectorizer.get_feature_names_out()
        print(len(terms))
        # true_k = math.ceil(len(terms)/100)
        for i in range(true_k):
            print("Cluster %d:" % i),
            for ind in order_centroids[i, :10]:
                print(' %s' % terms[ind]),
            print

     
        print("Cluster ID:")
        searched = ["women","casual","nylon","black","conformtable"]
        Y = vectorizer.transform(searched)
        prediction = model.predict(Y)
        prediction = [0,6,5,3,4,5,6]
        print(prediction)


        products_df=[]
        for cluster_id in prediction:
            print(cluster_id)
            term_indices = order_centroids[cluster_id]  
            cluster_terms = [terms[ind] for ind in term_indices]  
            print("terms are len is ", len(cluster_terms))
            products = Product.objects().all()
            product_data = []
            for product in products:
                matched_words = [word for word in cluster_terms if (word.lower() in product['description'].lower() )]
       
                product_data.append({
                    'ProductId': product['id'],  # Assuming '_id' is the product ID field
                    'Description': product['description'],  # Assuming 'description' is the product description field
                    'MatchedWords': len(matched_words)
                })
            products_df = pd.DataFrame(product_data)

        sorted_products = products_df.sort_values(by='MatchedWords', ascending=False).head(5)
        print(sorted_products)

        top_5_product_ids = sorted_products['ProductId'].tolist()
        matching_products = Product.objects(id__in=top_5_product_ids).all()


        response = {
            'success': True,
            'message': 'Top Rated Products',
            'product': [product.to_json() for product in matching_products]
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_all_product_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  
