from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from .graph_apis import *


class GetRestApiInfo:
    def get_population(self, alpha_code):
        data = fetch_data_restcountries(alpha_code)
        if data:
            return data.get('population', 'N/A')
        return 'N/A'

    def get_area(self, alpha_code):
        data = fetch_data_restcountries(alpha_code)
        if data:
            return data.get('area', 'N/A')
        return 'N/A'


class GetAreaByAlpha(GetRestApiInfo, APIView):
    def get(self, request, alpha_code):
        country = Country.objects.get(alpha_code=alpha_code)

        data = []
        area = self.get_area(alpha_code)
        country_data = {
            'name': country.country_name,
            'area': area
        }
        data.append(country_data)

        serializer = AreaSerializer(data, many=True)
        return Response(serializer.data)


class GetPopulationByAlpha(GetRestApiInfo, APIView):
    def get(self, request, alpha_code):
        country = Country.objects.get(alpha_code=alpha_code)

        data = []
        population = self.get_population(alpha_code)
        country_data = {
            'name': country.country_name,
            'population': population
        }
        data.append(country_data)

        serializer = PopulationSerializer(data, many=True)
        return Response(serializer.data)


class GetAllCountries(APIView):
    def get(self, request):
        countries = Country.objects.all()

        data = []
        for country in countries:
            country_data = {
                'name': country.country_name,
                'alphaCode': country.alpha_code
            }
            data.append(country_data)

        serializer = AllCountriesSerializer(data, many=True)
        return Response(serializer.data)


class GDPView(APIView):
    def get(self, request, alpha_code):
        response = fetch_gdp_data(alpha_code)
        country = Country.objects.get(alpha_code=alpha_code)

        output = []
        for item in response:
            year = item.get('date', 'N/A')
            if year:
                output.append({
                    'country': country.country_name,
                    'year': year,
                    'gdp': item.get('value', 0)
                })

        serializer = GDPSerializer(output, many=True)
        return Response(serializer.data)


class Testcls(APIView):
    def get(self, request):
        url = 'https://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/crim_off_cat?time=2019&geo=FR&crime=ROBBERY'

        response = requests.get(url)
        print("CHECK HERE")
        print(response.text)
        data = response.json()

        serializer = CrimeDataSerializer(data=data.get('observations', []), many=True)

        # Поверніть відповідь у форматі JSON
        return Response(serializer.data)

# class UkraineGDPView(APIView):
#     def get(self, request):
#         url = 'https://api.worldbank.org/v2/country/ukr/indicator/NY.GDP.MKTP.CD?format=json'
#
#         response = requests.get(url)
#         data = response.json()[1]  # Вибираємо другий елемент списку, де знаходяться дані
#
#         output = []
#         for item in data:
#             year = item.get('date')  # Отримуємо значення за ключем 'date', якщо ключ існує, інакше None
#             if year and year in ['2020', '2021']:
#                 output.append({
#                     'country': 'Ukraine',
#                     'year': year,
#                     'gdp': item.get('value', 0)  # Отримуємо значення за ключем 'value', якщо ключ існує, інакше 0
#                 })
#
#         serializer = UkraineGDPSerializer(output, many=True)
#         return Response(serializer.data)
