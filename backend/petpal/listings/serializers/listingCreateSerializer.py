from rest_framework import serializers

from ..models import Listing, ImageModel, ImageAlbum
from accounts.models import ShelterProfile, User

class ListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ('name', 'breed', 'age', 'gender', 'size', 'description', 'status', 'location')

    def create(self, validated_data):
        request = self.context.get('request', None)
        user = request.user
        if user.user_type != 2:
            raise serializers.ValidationError("User must be associated with Shelter")
        # Find the shelter profile associated with this user
        shelters = ShelterProfile.objects.all()
        user_shelter = None
        for shelter in shelters:
            if shelter.user == user:
                user_shelter = shelter
                break
        if user_shelter is None:
            raise serializers.ValidationError("User must be associated with Shelter")
        validated_data['shelter_profile'] = user_shelter
        listing = Listing.objects.create(**validated_data)
        return listing
