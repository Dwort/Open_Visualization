from rest_framework import serializers
from premium.models import Premium


#
#
# class PremiumSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Premium
#         fields = ['user', 'premium_type', 'session_id', 'customer_id', 'buying_date']
#
#     def to_internal_value(self, data):
#         if 'session_id' in data:
#             data['session_id'] = bytes(data['session_id'])
#         return super().to_internal_value(data)

# from rest_framework import serializers
# from premium.models import Premium
#
#
class PremiumSerializer(serializers.ModelSerializer):

    class Meta:
        model = Premium
        fields = ['user', 'premium_type', 'session_id', 'customer_id', 'buying_date']
#
#     def create(self, validated_data):
#         session_id_str = validated_data.pop('session_id')
#         validated_data['session_id'] = bytes(session_id_str, 'latin-1')
#         return Premium.objects.create(**validated_data)

# class PremiumSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Premium
#         fields = '__all__'
#
#     def save(self, **kwargs):
#         try:
#             instance = super().save(**kwargs)
#             print("Data saved successfully:", instance)
#             return instance
#         except Exception as e:
#             print("Error saving data:", e)
#             raise

# class PremiumSerializer(serializers.ModelSerializer):
#     session_id = serializers.FileField()
#
#     class Meta:
#         model = Premium
#         fields = ['user', 'premium_type', 'session_id', 'customer_id', 'buying_date']
#
#     def create(self, validated_data):
#         session_id_file = validated_data.pop('session_id')
#         session_id_bytes = session_id_file.read()
#         premium = Premium.objects.create(
#             user=validated_data['user'],
#             premium_type=validated_data['premium_type'],
#             session_id=session_id_bytes,
#             customer_id=validated_data['customer_id']
#         )
#         return premium
