from rest_framework import serializers
from .models import FixedContent, SuggestionUsage

class FixedContentSerializer(serializers.ModelSerializer):
  class Meta:
    model = FixedContent
    fields = ['id', 'category', 'subcategory', 'question', 'answer']

class QuestionSerializer(serializers.ModelSerializer):
  title = serializers.CharField(source='question')

  class Meta:
    model = FixedContent
    fields = ['id', 'title']


# class CategorySerializer(serializers.ModelSerializer):
#   class Meta:
#     model = Category
#     fields = ["id", "name"]

# class SubcategorySerializer(serializers.ModelSerializer):
#   category = CategorySerializer()

#   class Meta:
#     model = Subcategory
#     fields = ["id","name", "category"]

class SuggestionUsageSerializer(serializers.ModelSerializer):
  class Meta:
    model = SuggestionUsage
    fields = ["suggestion_text", "times_selected"]