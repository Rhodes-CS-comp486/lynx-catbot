from django.db import models

# Create your models here.
class FixedContent(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=50)
    subcategory = models.CharField(max_length=50)
    question = models.CharField(max_length=50)
    answer = models.CharField(max_length=800)

    class Meta:
        verbose_name = "Major Requirements"

    def __str__(self):
        return f"{self.subcategory} - {self.question[:50]}"
    



