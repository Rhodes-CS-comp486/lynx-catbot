from rest_framework import serializers
from .models import FixedContent

class FixedContentSerializer(serializers.ModelSerializer):
  class Meta:
    model = FixedContent
    fields = ['id', 'category', 'subcategory', 'question', 'answer']