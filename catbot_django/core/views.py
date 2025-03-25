from rest_framework import generics
from .models import FixedContent
from .serializers import FixedContentSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response 

class FixedContentList(generics.ListCreateAPIView):


  queryset = FixedContent.objects.all()
  serializer_class = FixedContentSerializer
  permission_classes = [AllowAny]

  def get_queryset(self):
    queryset = FixedContent.objects.all()
    category = self.request.GET.get("category", None)
    question = self.request.GET.get("question", None)
    subcategory = self.request.GET.get("subcategory", None)

    if category:
      queryset = queryset.filter(category__icontains=category)
    if subcategory:
      queryset = queryset.filter(subcategory__icontains=subcategory)
    if question:
      queryset = queryset.filter(question__icontains=question)

    return queryset
  # queryset = FixedContent.objects.all()

  

  # def get(self, request):
  #       question = request.GET.get("question", None)
  #       subcategory = request.GET.get("subcategory", None) 
  #       print('\n')
  #       print(subcategory)
  #       print(question)
  #       queryset = FixedContent.objects.all()

  #       if subcategory:
  #         queryset = queryset.filter(subcategory__icontains=subcategory)
  #         print("query set by subcateggoty", queryset, len(queryset))

  #       if question:
  #         queryset = queryset.filter(question__icontains=question)
  #         print("queryset by question", queryset, len(queryset))

  #       print(queryset)  
  #       serializer = FixedContentSerializer(queryset, many=True)
  #       return Response(serializer.data)
   
  # permission_classes = [AllowAny]
  

class FixedContentDetail(generics.RetrieveUpdateDestroyAPIView):
  queryset = FixedContent.objects.all()
  serializer_class = FixedContentSerializer
  permission_classes = [AllowAny]
