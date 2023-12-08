from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from ..models import Application
from ..serializers import ApplicationListSerializer

class SuperSmallPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'
    max_page_size = 10

class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SuperSmallPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['creation_time', 'last_modified']
    filterset_fields = ['status']

    def get_queryset(self):
        if self.request.user.user_type == 1:
            return Application.objects.filter(user_profile__user=self.request.user)
        return Application.objects.filter(listing__shelter_profile__user=self.request.user)
