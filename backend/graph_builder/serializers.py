from rest_framework import serializers
from graph_builder.models import Country
from decimal import Decimal


class PopulationSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='name')
    population = serializers.CharField()

    class Meta:
        model = Country
        fields = ('country_name', 'population')


class AreaSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='name')
    area = serializers.CharField()

    class Meta:
        model = Country
        fields = ('country_name', 'area')


class AllCountriesSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='name')
    alphaCode = serializers.CharField()

    class Meta:
        model = Country
        fields = ('country_name', 'alphaCode')


class GDPSerializer(serializers.Serializer):
    country = serializers.CharField()
    year = serializers.IntegerField()
    gdp = serializers.FloatField()

    class Meta:
        model = Country
        fields = ['country_name', 'year', 'gdp']
