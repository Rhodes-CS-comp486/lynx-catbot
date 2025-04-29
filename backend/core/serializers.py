from rest_framework import serializers
from .models import FixedContent, SuggestionUsage
from .utils import text_to_markdown

class FixedContentSerializer(serializers.ModelSerializer):
  answer = serializers.SerializerMethodField()
  
  class Meta:
    model = FixedContent
    fields = ['id', 'category', 'subcategory', 'question', 'answer']

  def get_answer(self, obj):
    return text_to_markdown(obj.answer)

class QuestionSerializer(serializers.ModelSerializer):
  title = serializers.CharField(source='question')

  class Meta:
    model = FixedContent
    fields = ['id', 'title']


class SuggestionUsageSerializer(serializers.ModelSerializer):
  class Meta:
    model = SuggestionUsage
    fields = ["suggestion_text", "times_selected"]