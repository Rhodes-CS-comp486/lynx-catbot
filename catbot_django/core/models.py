from django.db import models

# Create your models here.
class FixedContent(models.Model):
    category = models.CharField(max_length=50)
    subcategory = models.CharField(max_length=50)
    question = models.CharField(max_length=50)
    answer = models.CharField(max_length=800)