from django.db import models

# Create your models here.
class FixedContent(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.TextField()
    subcategory = models.TextField()
    question = models.TextField()
    answer = models.TextField()


    class Meta:
        verbose_name = "Major Requirements"

    def __str__(self):
        return f"{self.subcategory} - {self.question[:50]}"
    
# class Category(models.Model):
#     name = models.CharField(max_length=255, unique=True)

#     def __str__(self):
#         return self.name
    
# class Subcategory(models.Model):
#     category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")
#     name = models.CharField(max_length=255)

#     def __str__(self):
#         return f"{self.category.name} - {self.name}"
    

class SuggestionUsage(models.Model):
    suggestion_text = models.CharField(max_length=255, unique=True)
    times_selected = models.PositiveBigIntegerField(default=0)

    def __str__(self):
        return f"{self.suggestion_text}: {self.times_selected} times"

"""
class QuestionSuggestionUsage(models.FixedContent):
    def get_queryset(self):
        return super().get_queryset().select('subcategory', 'question')

    def __str__(self):
        return f"{self.subcategory}: {self.question}"

"""