from rest_framework import generics
from .models import FixedContent
from .serializers import FixedContentSerializer

class FixedContentList(generics.ListCreateAPIView):
  queryset = FixedContent.objects.all()
  serializer_class = FixedContentSerializer


class FixedContentDetail(generics.RetrieveUpdateDestroyAPIView):
  queryset = FixedContent.objects.all()
  serializer_class = FixedContentSerializer

