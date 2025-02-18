from django.shortcuts import render
from .models import FixedContent

# Create your views here.
def fixed_content(request):
    data = FixedContent.objects.all()
    return render(request, 'fixed_content_template.html',{'data': data})