from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse

from ..models import Notification
from applications.models import Application
from accounts.models import ShelterProfile
from comments.models import Comment

class NotificationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('content', 'creation_time', 'status', 'pk', 'url')

    def get_url(self, obj):
        relative_url = ''
        # 3 cases
        if isinstance(obj.link_to, Application):
            # The object points to an application, reverse to that application
            relative_url = reverse('applications:applicationget', kwargs={'pk': obj.object_id})
        if isinstance(obj.link_to, ShelterProfile):
            relative_url = reverse('accounts:shelterget')
        if isinstance(obj.link_to, Comment):
            # Figure out whether the comment refers to shelter or application
            comment = obj.link_to
            head = comment.head
            if head is None:
                head = comment
            if isinstance(head.reply_to, Application):
                comment_type = 'application'
            else:
                comment_type = "shelter"
            relative_url = reverse('comments:commentlist', kwargs={'obj_id': comment.object_id, 'type': comment_type})
        request = self.context.get('request')
        return request.build_absolute_uri(relative_url)
    url = serializers.SerializerMethodField('get_url')