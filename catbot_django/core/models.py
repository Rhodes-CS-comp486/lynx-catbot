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
    
