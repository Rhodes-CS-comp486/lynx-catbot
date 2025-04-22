from rest_framework import generics, status
from .models import FixedContent, SuggestionUsage
from .serializers import FixedContentSerializer, SuggestionUsageSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework.reverse import reverse
from django.conf import settings
import google.generativeai as genai
from rest_framework.permissions import IsAuthenticated

import os


class home(APIView):
  permission_classes = [AllowAny]
  def get(self, request, format=None):
        return Response({
            "fixed-content": reverse('fixedcontent-list', request=request, format=format),
            "suggestions": reverse('get_suggestions', request=request, format=format),
            "suggestion-usage": reverse('track_suggestion_usage', request=request, format=format),
            "gemini-response": reverse('gemini_response', request=request, format=format),
        }) 
   

class GetAPIKey(APIView):
  permission_classes = [AllowAny] # Change this once we add admin privileges
  def get(self, request):
    gemini_key = getattr(settings, "GEMINI_KEY", None)
    if not gemini_key:
      return Response({"error":"Gemini Key is not set"}, status=500)
    return Response({"gemini_key": gemini_key})

class GeminiResponseView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_query = request.data.get('query')

        if not user_query:
            return Response({"error": "Query is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Step 1: Query the database for relevant data
            category = request.data.get("category", None)
            subcategory = request.data.get("subcategory", None)

            # Filter the FixedContent model based on the query parameters
            queryset = FixedContent.objects.all()
            if category:
                queryset = queryset.filter(category__icontains=category)
            if subcategory:
                queryset = queryset.filter(subcategory__icontains=subcategory)

            # Combine the relevant data into a context string
            context_data = "\n".join(
                [f"Q: {item.question}\nA: {item.answer}" for item in queryset]
            )

            # Step 2: Combine the system instructions, user's query, and database context
            system_instructions = """
            You are a friendly assistant to new students at Rhodes College. 
            Your job is to answer questions provided with data about campus life and academics. 
            Your answers should be brief, easy, and convenient to read.
            """
            prompt = f"""
            {system_instructions}

            Context:
            {context_data}

            User's Question:
            {user_query}
            """

            # Step 3: Generate a response using the Gemini API
            genai.configure(api_key=os.environ.get("GEMINI_KEY"))
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(prompt)

            # Step 4: Return the AI's response
            return Response({'answer': response.text}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

class GetSuggestionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = FixedContent.objects.values_list("category", flat=True).distinct()
        subcategories = FixedContent.objects.values_list("subcategory", flat=True).distinct()
        popular_suggestions = SuggestionUsage.objects.order_by("-times_selected")[:5]

        return Response({
            "categories": list(categories),
            "subcategories": list(subcategories),
            "popular_suggestions": SuggestionUsageSerializer(popular_suggestions, many=True).data
        }, status=status.HTTP_200_OK)


class TrackSuggestionUsageView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        suggestion_text = request.data.get("suggestion")

        if not suggestion_text:
            return Response({"error": "Suggestion text is required."}, status=status.HTTP_400_BAD_REQUEST)

        suggestion, created = SuggestionUsage.objects.get_or_create(suggestion_text=suggestion_text)
        suggestion.times_selected += 1
        suggestion.save()

        return Response({"message": "Suggestion count updated."}, status=status.HTTP_200_OK)