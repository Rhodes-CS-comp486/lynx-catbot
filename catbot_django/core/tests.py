from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
import json
from .models import FixedContent

class FixedContentAPITest(TestCase):

    @classmethod 
    def setUpTestData(cls):
        cls.major_requirements = list(FixedContent.objects.filter(category='Major Requirements'))
        cls.client = Client()
        cls.url = reverse('fixedcontent-list')

    def test_get_all_major_requirements(self):
        response = self.client.get(self.url, {'category' : 'Major Requirements'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = json.loads(response.content)
        self.assertEqual(len(data), len(self.major_requirements))
    
    def test_get_by_exact_question(self):
        question = 'What are the requirements for a major in Art History?'
        response = self.client.get(self.url, {"question": question}) 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], 7)
        self.assertEqual(data[0]['subcategory'], 'Art History')
    
    def test_get_by_partial_question(self):
        question_part = 'Ancient Mediterranean Studies'
        response = self.client.get(self.url, {"question" : question_part})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        for entry in data:
            print(entry)
            print("\n")
        self.assertEqual(len(data), 3)  
        
    def test_get_by_case_insensitive_question(self):
        question_part = 'art history'  
        response = self.client.get(self.url, {"question" : question_part})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertTrue(len(data) > 0)
        self.assertEqual(data[0]['subcategory'], 'Art History')
    
    def test_get_by_question_no_results(self):
        question = 'requirements for random major'
        response = self.client.get(self.url, {"question" : question})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0) 
    
    def test_get_by_subcategory(self):
        subcategory = 'Art'
        response = self.client.get(self.url, {"subcategory" : subcategory})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        # for entry in data:
        #     print(entry)
        #     print("\n")
        self.assertEqual(len(data),5)
        self.assertEqual(data[0]['id'], 6)
    
    def test_get_by_multiple_filters(self):
        response = self.client.get(self.url, {"subcategory" : "Ancient Mediterranean Studies", 'question' : "concentration"})
        print(response) 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data), 3) 



class FixedContentDetailAPITest(TestCase):
    
    @classmethod
    def setUpTestData(cls):
      cls.major_requirements = list(FixedContent.objects.filter(category='Major Requirements'))
      cls.client = Client()
      cls.url = reverse('fixedcontent-list')  
    
    # def test_get_valid_single_requirement(self):
    #     response = self.client.get(self.url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     data = json.loads(response.content)
    #     self.assertEqual(data['id'], 1)
    #     self.assertEqual(data['subcategory'], 'Africana Studies')
    
    # def test_get_invalid_requirement(self):
    #     invalid_url = reverse('major-requirement-detail', args=[999])  
    #     response = self.client.get(invalid_url)
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)