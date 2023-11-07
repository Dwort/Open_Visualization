import React, { useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale } from "chart.js/auto";
import GdpByAlphaCode from "./page_functions/gdp_by_alpha_box";
import logo from "../front_additions/logo_open_visualization.jpg"
import './graph_styles/population-area_style.css'


function GdpByAlpha(){


  const [gdpData, setGdpData] = useState([]);
  const [gdpType, setGdpType] = useState('Line');


  const graph_data = {
    labels: gdpData.map((data) => data.year),
    datasets: [
      {
        label: 'Countries gdp',
        data: gdpData.map((data) => data.gdp),
        backgroundColor: ["red", "blue", "yellow", "green", "purple", "grey", "pink", "orange", "brown", "lightblue"],
        borderColor: "black",
        borderWidth: 1,
      },
    ]
  };
  console.log(gdpData)
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

          let suffixes = ["", "K", "M", "B", "T"];
          let order = Math.floor(Math.log(Math.abs(value)) / Math.log(1000));
          let suffix = suffixes[order];
          let shortValue = value / Math.pow(1000, order);

          if (shortValue % 1 !== 0) {
            shortValue = shortValue.toFixed(1);
          }

          return "$ " + shortValue + suffix;
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
        text: gdpData.length > 0 ? `GDP of ${gdpData[0].country}` : 'GDP of ',
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
        text: gdpData.length > 0 ? `GDP of ${gdpData[0].country}` : 'GDP of ',
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
            <select onChange={(e) => setGdpType(e.target.value)}>
              <option value="Line">Line</option>
              <option value="Bar">Bar</option>
              <option value="Pie">Pie</option>
              <option value="Doughnut">Doughnut</option>
            </select>
          </label>
        </div>

        <div className="graph-container">
          {gdpType === 'Bar' && <Bar data={graph_data} options={bar_line_options} />}
          {gdpType === 'Line' && <Line data={graph_data} options={bar_line_options} />}
          {gdpType === 'Pie' && <Pie data={graph_data} options={pie_doughnut_options} />}
          {gdpType === 'Doughnut' && <Doughnut data={graph_data} options={pie_doughnut_options} />}
        </div>

        <div className="checkbox-container">
          <div className="h2-container">
            <h2>Список країн</h2>
          </div>
          <div className="checkbox-content">
            <GdpByAlphaCode onDataReceived={setGdpData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GdpByAlpha;