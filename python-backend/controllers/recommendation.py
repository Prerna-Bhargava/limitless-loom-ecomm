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
from sklearn.metrics.pairwise import cosine_similarity

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
        print(f"Error in get recommended products controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  


def get_recommended_products_search(request):
    try:
        products = Product.objects()
        descriptions = [product.description for product in products]
        searched_terms = request.json.get('search')
        print(searched_terms)


        vectorizer = TfidfVectorizer(stop_words='english')
        X = vectorizer.fit_transform(descriptions)
        # searched_terms = ["belt"]

        # get searched terms for the user logged in or based on his cache

        search_vector = vectorizer.transform([" ".join(searched_terms)])

        # Calculate cosine similarity between search vector and product descriptions
        cosine_similarities = cosine_similarity(search_vector, X)

        # Get top matching products based on similarity scores
        top_matching_indices = np.argsort(cosine_similarities, axis=1)[0][::-1]

        # Print the top matching products
        for idx in top_matching_indices:
            print(idx)
        product_list = list(products)


        index_product_mapping = {idx: product for idx, product in enumerate(product_list)}

        cluster_products = []

        # Print the top matching products
        for idx in top_matching_indices:
            product = index_product_mapping[idx]
            cluster_products.append(product)
            print(f"Product ID: {product.id}, Description: {product.name}")

        # true_k = 5
        # model = KMeans(n_clusters=true_k)
        # model.fit(X)
        # labels = model.labels_
        # print("labels are ",labels)

        # terms = vectorizer.get_feature_names_out()
        # order_centroids = model.cluster_centers_.argsort()[:, ::-1]


        # keyword_vector = vectorizer.transform(searched_terms)
        # print(keyword_vector)
        # keyword_cluster = model.predict(keyword_vector)[0]
        # cluster_products = [product for idx, product in enumerate(products) if labels[idx] == keyword_cluster]
        # for product in cluster_products:
        #     print(product.id)
        


        # Y = vectorizer.transform(searched_terms)
        # prediction = model.predict(Y)
        # print(prediction)

        # recommended_products = set()

        # for cluster_id in prediction:
        #     term_indices = order_centroids[cluster_id]

        #     cluster_terms = [terms[ind] for ind in term_indices]

        #     print("terms at 0 cluster len is ", len(term_indices))

            
        #     for product in products:
        #         if any(term.lower() in product.description.lower() for term in cluster_terms):
        #             recommended_products.add(product.id)

        # matching_products = Product.objects(id__in=list(recommended_products)).all()

        response = {
            'success': True,
            'message': 'Recommended Products',
            'products': [product.to_json() for product in cluster_products]
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"Error in get_recommended_products_search: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500