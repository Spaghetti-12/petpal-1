
from django.db import models

from .profile import Profile
from .user import User


class UserProfile (Profile):
    # other fields are from parent class
    user = models.OneToOneField(User, related_name='userProfile', on_delete=models.CASCADE)
    profilePic = models.ImageField(upload_to='images')

