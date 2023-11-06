import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const ChartComponent = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Перевіряємо, чи існує попередній графік. Якщо так, то знищуємо його.
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Створюємо новий графік на canvas елементі
    const ctx = chartRef.current.getContext("2d");
    const barColors = ["red", "blue", "yellow", "green", "black", "grey", "pink"];
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((item) => item.country_name),
        datasets: [
          {
            label: "Population",
            data: data.map((item) => parseInt(item.population)),
            backgroundColor: barColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Countries population",
        },
        scales: {
          yAxes: {
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                if (value === 0) {
                  return '0';
                }

                const suffixes = ["", "K", "M", "B"];
                const order = Math.floor(Math.log(Math.abs(value)) / Math.log(1000));
                const suffix = suffixes[order];
                let shortValue = value / Math.pow(1000, order);

                if (shortValue % 1 !== 0) {
                  shortValue = shortValue.toFixed(1);
                }

                return shortValue + suffix;
              },
            },
          },
        },
      },
    });

    // Повертаємо функцію знищення для очищення графіка при знищенні компоненту
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]); // Вказуємо data як залежність

  return <canvas ref={chartRef} id="myChart" width="400" height="200"></canvas>;
};

export default ChartComponent;
