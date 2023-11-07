from rest_framework.views import APIView
from rest_framework.response import Response
import pandas as pd
import numpy as np
from prophet import Prophet


class PopulationPredictionView(APIView):

    def get(self, request):
        country = request.query_params.get('country')
        year = request.query_params.get('year')

        # Зчитування даних з CSV файлу
        df = pd.read_csv('populations.csv')

        # Вибір рядка з назвою країни
        country_row = df[df['Country_Code'] == country]

        # Вибір даних про населення (з другого стовпця до кінця)
        population_data = country_row.iloc[:, 1:].values.flatten()

        # Створення датафрейму для моделі Prophet
        df_prophet = pd.DataFrame({
            'ds': pd.to_datetime(df.columns[1:], format='%Y'),  # перетворення років у дати
            'y': population_data.astype(np.int64)  # конвертація населення у цілі числа
        })

        # Ініціалізація та навчання моделі
        model = Prophet(interval_width=0.95)
        model.fit(df_prophet)

        # Створення фрейму для прогнозування
        future = model.make_future_dataframe(periods=30, freq='Y')

        # Прогнозування
        forecast = model.predict(future)

        # Отримання прогнозу для конкретного року
        prediction_values = forecast[forecast['ds'].dt.year == int(year)][['yhat', 'yhat_lower', 'yhat_upper']].values[
            0]

        # Створення словника з результатами
        result = {
            'prediction': prediction_values[0],
            'lower_border': prediction_values[1],
            'upper_border': prediction_values[2]
        }

        # Повернення відповіді у форматі JSON
        return Response(result)
