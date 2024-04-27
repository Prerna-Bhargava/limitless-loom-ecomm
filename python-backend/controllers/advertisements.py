from flask import jsonify
from modals.AdvertisementsModel import Advertisement as Advertisements
from slugify import slugify

def addAdvertisements(request):
    try:
        jsondata = request.get_json()
        image = jsondata.get('image')
        if not image:
            return jsonify({'message': 'image is required '}), 401
        
        Advertisements = Advertisements(image=image)
        Advertisements.save()
        response =  {
            'success': True,
            'message': 'New Advertisements created',
            'Advertisements': Advertisements.to_json()
        }
        return jsonify(response), 200
    except Exception as e:
        print(f"Error in add_Advertisements: {str(e)}")
        return jsonify({'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Get All Advertisement
def get_all_Advertisement():
    try:
        Advertisement = Advertisements.objects()
        response = {
            'success': True,
            'message': 'All Advertisement List',
            'Advertisement': [Advertisements.to_json() for Advertisements in Advertisement]
        }

        return jsonify(response), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in get_all_Advertisement_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error


# Delete Advertisements
def delete_Advertisements(id):
    try:
        Advertisements = Advertisements.objects(id=id).first()

        if not Advertisements:
            return jsonify({'success': False, 'message': 'Advertisements not found'}), 404  # 404 Not Found

        Advertisements.delete()

        return jsonify({'success': True, 'message': 'Advertisements Deleted Successfully'}), 200  # 200 OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error in delete_Advertisements_controller: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500  # 500 Internal Server Error

