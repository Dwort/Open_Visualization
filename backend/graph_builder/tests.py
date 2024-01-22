# from rest_framework.test import APITestCase
# from rest_framework import status
# from django.urls import reverse
# from unittest.mock import patch
# from graph_builder.models import Country
# import json
#
#
# class TestPopulationAPI(APITestCase):
#     def setUp(self):
#         Country.objects.create(country_name='Test Country', alpha_code='TST')
#
#     @patch('graph_builder.views.GetRestApiInfo.get_population')
#     def test_get_population_by_alpha_code(self, mock_get_population):
#         mock_get_population.return_value = '1000000'  # Мокуємо результат отримання населення
#
#         url = reverse('country-by-alpha', kwargs={'alpha_code': 'TST'})
#         response = self.client.get(url)
#
#         test_data = [{
#             'name': 'Test Country',
#             'population': '1000000'
#         }]
#
#         print(json.dumps(test_data, indent=4))
#
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data[0]['country_name'], 'Test Country')
#         self.assertEqual(response.data[0]['population'], '1000000')


from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from graph_builder.models import Country


class TestPopulationAPI(APITestCase):
    def setUp(self):
        Country.objects.create(country_name='Ukraine', alpha_code='UKR')

    def test_get_population_by_alpha_code(self):
        alpha_code = 'UKR'
        url = reverse('country-by-alpha', kwargs={'alpha_code': alpha_code})
        response = self.client.get(url)

        print('\n' + "-" * 50)
        print(f"Country name: {response.data[0]['country_name']}")
        print(f"Population: {response.data[0]['population']}")
        print("-" * 50)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('country_name', response.data[0])
        self.assertIn('population', response.data[0])
        self.assertIsInstance(response.data[0]['country_name'], str)
        self.assertIsInstance(response.data[0]['population'], str)


class TestAreaAPI(APITestCase):
    def setUp(self):
        Country.objects.create(country_name='USA', alpha_code='USA')

    def test_get_area_by_alpha_code(self):
        alpha_code = 'USA'
        url = reverse('country-area', kwargs={'alpha_code': alpha_code})
        response = self.client.get(url)

        print('\n' + "-" * 50)
        print(f"Country name: {response.data[0]['country_name']}")
        print(f"Area: {response.data[0]['area']}")
        print("-" * 50)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('country_name', response.data[0])
        self.assertIn('area', response.data[0])
        self.assertIsInstance(response.data[0]['country_name'], str)
        self.assertIsInstance(response.data[0]['area'], str)
