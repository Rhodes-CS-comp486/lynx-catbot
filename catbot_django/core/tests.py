from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
import json
from .models import FixedContent

class FixedContentAPITest(TestCase):
    
    def setUp(self):

        self.major_requirements = [
            FixedContent.objects.create(
                id=1, 
                category='Major Requirements',
                subcategory='Africana Studies',
                question='What are the requirements for a major in Africana Studies in catalogue year 2025?',
                answer='Requirements for a Major in Africana Studies: A total of eleven courses/44 credits as follows. 1. African Studies Core: AFST 103, 105, 305, and 420. 2. African Studies electives: Seven additional four-credit courses, at least four of which must be from Group A. Group A: Courses with primarily African Studies content: AFST 156, 205, 207, ANSO 271, HIST 105, 205, 233, 305, 307, MUSC 118, 119. Group B: Courses with African Studies content: ANSO 203, 221, 271, ECON 310, INTS 263, 264, 265, POLS 214, 248, 346, 362, 363, RELS 255, 258. Special topics courses or other courses may be applied toward the major with approval of the Program Director.'
            ),
            FixedContent.objects.create(
                id=2, 
                category='Major Requirements',
                subcategory='Ancient Mediterranean Studies',
                question='What are the requirements for a major in Ancient Mediterranean Studies with a concentration in languages?',
                answer='Concentration in Languages: A total of thirteen courses/52 credits as follows: 1. Required Core Courses: 6 courses/24 credits: Four courses in either Greek or Latin, inclusive of the introductory sequence; HIST 211; AMS 485-486. 2. Elective Courses: Seven courses/28 credits selected from the following: Art 231, 232, 265, 365, 366; Greek or Latin (whichever language is not used to fulfill the required core courses above); HIST 305, 311, 312, 313; PHIL 201; Religious Studies 214, 260; and one of the following: English 315, 316, 319, or 335.'
            ),
            FixedContent.objects.create(
                id=3, 
                category='Major Requirements',
                subcategory='Ancient Mediterranean Studies',
                question='What are the requirements for a major in Ancient Mediterranean Studies with a concentration in cultures?',
                answer='Concentration in Cultures: A total of thirteen courses/52 credits as follows: 1. Required Core Courses: 6 courses/24 credits: Greek 101-102 or Latin 101-102; HIST 211; AMS 485-486. 2. Elective Courses: Seven courses/28 credits selected from the following: Art 231, 232, 265, 365, 366; Greek or Latin (the introductory sequence in the language not taken as part of the core courses above); HIST 305, 311, 312, 313; PHIL 201; Religious Studies 214, 260; and one of the following: English 315, 316, 319, or 335.'
            ),
            FixedContent.objects.create(
                id=4, 
                category='Major Requirements',
                subcategory='Ancient Mediterranean Studies',
                question='What are the requirements for a major in Ancient Mediterranean Studies with a concentration in Archaeology?',
                answer='Concentration in Archaeology: A total of thirteen courses/52 credits as follows: 1. Required Core Courses: HIST 211, AMS 485-486. 2. Archaeological Methods: One course from Art 265 (recommended), 365, ANSO 205, ENVS 160, 486. 3. One and only one ancient language sequence (2 courses): Greek or Latin 101-102 or higher. 4. Art and Archaeology: at least three courses from Art 231, 232, 265, 331, 332, 365, 366. 5. Ancient History and Culture: at least one course from HIST 305, 311, 312, 313, Latin 203 (or appropriate), 211, 221, 222, 223, Religious Studies 260'
            ),
            FixedContent.objects.create(
                id=5, 
                category='Major Requirements',
                subcategory='Anthropology/Sociology',
                question='What are the requirements for a major in Anthropology/Sociology?',
                answer='A total of 48 credits as follows: 1. Anthropology/Sociology 103, 105, 201, 205, 275, 380, 386, and 485-486. 2. Three courses from one of the following four groups: a. Environment and Society: Anthropology/Sociology 201, 221, 265, 307, 321, Urban Studies 202, 235, Latin American and Latinx Studies 200, Environmental Studies 201, 304. b. Health Equity & Social Justice: Anthropology/Sociology 232, 235, 242, 271, 273, 310, 331, 339, 346, Environmental Studies 203, 212, Gender and Sexuality Studies 201, 252, 303, 310, 325, 451, Latin American and Latinx Studies 335, Political Science 266, 385. c. Identity & Culture: Anthropology/Sociology 221, 232, 235, 255, 271, 273, 310, 321, 331, 343, Gender and Sexuality Studies 201, 252, 303, 325, 451, Greek and Roman Studies 245, History 357, Latin American and Latinx Studies 200. d. Research Methods: Computer Science 141, 142, Geographic Information System (ENVS 225), Graphic Information System (URBN 225).'
            ),
            FixedContent.objects.create(
                id=6, 
                category='Major Requirements',
                subcategory='Art',
                question='What are the requirements for a major in Art?',
                answer='For the student interested in art as a vocation, for teaching, or for graduate study, a Bachelor of Arts degree with a major in Art is offered. In addition to completing the degree requirements established by the College, a candidate for this degree is required to complete a minimum of 48 credits (12 courses) in the department. Students intending to pursue honors in Art should consult with their advisors concerning additional requirements. For those students intending to do graduate work in the studio arts, it is strongly recommended that they complete Art 386 (Junior Seminar) and Art 485-486 (Senior Seminar), several 300-level studio classes and at least one 300 level studio course.'
            ),
            FixedContent.objects.create(
                id=7, 
                category='Major Requirements',
                subcategory='Art History',
                question='What are the requirements for a major in Art History?',
                answer='For the student interested in art as a vocation, for teaching, or for graduate study, a Bachelor of Arts degree with a major in Art History is offered. In addition to completing the degree requirements established by the College, a candidate for this degree is required to complete a minimum of 48 credits (12 courses) in the department. Students intending to pursue honors in Art History should consult with their advisors concerning additional requirements. For those students intending to do graduate work in art history, it is strongly recommended that they complete Art 386 (Junior Seminar) and Art 485-486 (Senior Seminar), several 300-level art history classes and at least one 300 level studio course.'
            ),
            FixedContent.objects.create(
                id=8, 
                category='Major Requirements',
                subcategory='Art and Art History',
                question='What are the requirements for a major in Art and Art History?',
                answer='A total of fifty-six (56) credits as follows: 1. Art 101, 102, 105, 107, 151, 152, 234, 485. 2. Art History 231, 232, 341, 343. 3. One additional course in Studio Art at the 300 level or above. 4. One additional course in Art History at the 300 level or above.'
            ),
        ]

        self.client = Client()
        self.url = reverse('fixedcontent-list')

    def test_get_all_major_requirements(self):
        response = self.client.get(self.url, follow=True)
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
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0]['id'], 6)
    
    def test_get_by_multiple_filters(self):
        response = self.client.get(self.url, {"subcategory" : "Ancient Mediterranean Studies", 'question' : "concentration"})
        print(response) 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data), 3) 



class FixedContentDetailAPITest(TestCase):
    
    def setUp(self):
        
          self.major_requirements = FixedContent.objects.create(
              
            FixedContent.objects.create(
                id=1, 
                category='Major Requirements',
                subcategory='Ancient Mediterranean Studies',
                question='What are the requirements for a major in Ancient Mediterranean Studies with a concentration in languages?',
                answer='Concentration in Languages: A total of thirteen courses/52 credits as follows: 1. Required Core Courses: 6 courses/24 credits: Four courses in either Greek or Latin, inclusive of the introductory sequence; HIST 211; AMS 485-486. 2. Elective Courses: Seven courses/28 credits selected from the following: Art 231, 232, 265, 365, 366; Greek or Latin (whichever language is not used to fulfill the required core courses above); HIST 305, 311, 312, 313; PHIL 201; Religious Studies 214, 260; and one of the following: English 315, 316, 319, or 335.'
            ),
            FixedContent.objects.create(
                id=2, 
                category='Major Requirements',
                subcategory='Ancient Mediterranean Studies',
                question='What are the requirements for a major in Ancient Mediterranean Studies with a concentration in cultures?',
                answer='Concentration in Cultures: A total of thirteen courses/52 credits as follows: 1. Required Core Courses: 6 courses/24 credits: Greek 101-102 or Latin 101-102; HIST 211; AMS 485-486. 2. Elective Courses: Seven courses/28 credits selected from the following: Art 231, 232, 265, 365, 366; Greek or Latin (the introductory sequence in the language not taken as part of the core courses above); HIST 305, 311, 312, 313; PHIL 201; Religious Studies 214, 260; and one of the following: English 315, 316, 319, or 335.'
            ),
            FixedContent.objects.create(
                id=3, 
                category='Major Requirements',
                subcategory='Ancient Mediterranean Studies',
                question='What are the requirements for a major in Ancient Mediterranean Studies with a concentration in Archaeology?',
                answer='Concentration in Archaeology: A total of thirteen courses/52 credits as follows: 1. Required Core Courses: HIST 211, AMS 485-486. 2. Archaeological Methods: One course from Art 265 (recommended), 365, ANSO 205, ENVS 160, 486. 3. One and only one ancient language sequence (2 courses): Greek or Latin 101-102 or higher. 4. Art and Archaeology: at least three courses from Art 231, 232, 265, 331, 332, 365, 366. 5. Ancient History and Culture: at least one course from HIST 305, 311, 312, 313, Latin 203 (or appropriate), 211, 221, 222, 223, Religious Studies 260'
            )
          )
#
#         self.client = Client()
#         self.url = reverse('major-requirement-detail', args=[self.requirement.id])  # Adjust to your actual URL name
    
#     def test_get_valid_single_requirement(self):
#         """Test retrieving a single requirement by ID"""
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         data = json.loads(response.content)
#         self.assertEqual(data['id'], 1)
#         self.assertEqual(data['subcategory'], 'Africana Studies')
    
#     def test_get_invalid_requirement(self):
#         """Test retrieving a non-existent requirement"""
#         invalid_url = reverse('major-requirement-detail', args=[999])  
#         response = self.client.get(invalid_url)
#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)