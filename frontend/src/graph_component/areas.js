import React, { useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale } from "chart.js/auto";
import CountryInfoApp from "./page_functions/countries_checkbox";
import './styles/population-area_style.css'
import logo from "../front_additions/logo_open_visualization.jpg";


function Area(){

  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('Bar');


  const graph_data = {
    labels: chartData.map((data) => data.country_name),
    datasets: [
      {
        label: "Area",
        data: chartData.map((data) => data.area),
        backgroundColor: ["red", "blue", "yellow", "green", "purple", "grey", "pink", "orange", "brown", "lightblue"],
        borderColor: "black",
        borderWidth: 1,
      },
    ]
  };

  const bar_line_options= {
    layout: {
      padding: 20
    },
    scales: {
    y: {
      ticks: {
        callback: function(value, index, values) {
          if (value === 0) {
            return '0';
          }

          let suffixes = ["", "K2", "M2", "B2"];
          const order = Math.floor(Math.log(Math.abs(value)) / Math.log(1000));
          let suffix = suffixes[order];
          let shortValue = value / Math.pow(1000, order);

          if (shortValue % 1 !== 0) {
            shortValue = shortValue.toFixed(1);
          }

          return shortValue + suffix;
        },
        color: 'black'
      }
    },
    x: {
      ticks: {
        color: 'black'
      }
    }
    },
    plugins: {
      title: {
        display: true,
        text: 'Countries Area',
        padding: {
          top: 10,
          bottom: 30
        }
      },
      legend: {
        display: false,
      }
    },
    LinearScale: {
      type: 'linear',
      display: true,
      position: 'left'
    }
  };

  const pie_doughnut_options = {
    layout: {
      padding: 20
    },
    plugins: {
      title: {
        display: true,
        text: 'Countries Area',
        color: 'black',
        padding: {
          top: 10,
          bottom: 30
        }
      },
      legend: {
        display: true,
        position: 'bottom',
        align: 'center'
      },
    },
    }

  return (
    <div className="main-container">
      <div className="head-container">
        <img src={logo} alt="Логотип компанії" className="logo" />
      </div>
      <div className="body-container">
        <div className="select-container">
          <label>
            <select onChange={(e) => setChartType(e.target.value)}>
              <option value="Bar">Bar</option>
              <option value="Line">Line</option>
              <option value="Pie">Pie</option>
              <option value="Doughnut">Doughnut</option>
            </select>
          </label>
        </div>

        <div className="graph-container">
          {chartType === 'Bar' && <Bar data={graph_data} options={bar_line_options} />}
          {chartType === 'Line' && <Line data={graph_data} options={bar_line_options} />}
          {chartType === 'Pie' && <Pie data={graph_data} options={pie_doughnut_options} />}
          {chartType === 'Doughnut' && <Doughnut data={graph_data} options={pie_doughnut_options} />}
        </div>

        <div className="checkbox-container">
          <div className="h2-container">
            <h2>Список країн</h2>
          </div>
          <div className="checkbox-content">
            <CountryInfoApp onCheckboxChange={setChartData} dataType={'area'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Area;