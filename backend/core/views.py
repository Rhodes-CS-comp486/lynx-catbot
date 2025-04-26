from rest_framework import generics, status
from .models import FixedContent, SuggestionUsage #, QuestionSuggestionUsage
from .serializers import FixedContentSerializer, SuggestionUsageSerializer #, QuestionSuggestionSerializer
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
      request_obj = request.data.get('request')

      if not user_query and not request_obj:
         return Response({"error": "Query is required."}, status=status.HTTP_400_BAD_REQUEST)
    
      try:
        genai.configure(api_key=os.environ.get("GEMINI_KEY"))
        model = genai.GenerativeModel('gemini-2.0-flash')


        if user_query:
          prompt = "You are a helpful assistant for new students at Rhodes College. Answer the following question in relation to the insitution: " + user_query 
        else:
          category = request_obj.get("category", '')
          subcategory = request_obj.get("subcategory", '')
          question = request_obj.get("question", '')

          prompt = (
                    f"You are a chatbot assisting new Rhodes College students.\n"
                    f"Context:\n- Category: {category}\n- Subcategory: {subcategory}\n"
                    f"User's Question: \"{question}\"\n\n"
                    "Provide a concise, friendly, and informative response. "
                    "If the question is not clear, ask for clarification. \n"
                    "Make sure the response is coincise and does not exeed 100 words. \n "
                    "If applicable, ask if the user would like more detail about deadlines, procedures, or resources."
                )
  
        response = model.generate_content(prompt)
        
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
        groupedQuestions = FixedContent.objects.values_list("question", flat=True).distinct()

        return Response({
            "categories": list(categories),
            "subcategories": list(subcategories),
            "popular_suggestions": SuggestionUsageSerializer(popular_suggestions, many=True).data,
            "questions" : list(groupedQuestions)
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