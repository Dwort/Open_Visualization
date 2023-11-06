import requests


def fetch_data_restcountries(alpha_code):
    url = f'https://restcountries.com/v3.1/alpha/{alpha_code}'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()[0]
    return None


def fetch_gdp_data(alpha_code):
    url = f'https://api.worldbank.org/v2/country/{alpha_code}/indicator/NY.GDP.MKTP.CD?format=json'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()[1]
    return None
