import React, { useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import CountryInfoApp from "./page_functions/countries_checkbox";
import './graph_styles/population-area_style.css'
import Header from "../main_functional_folder/AdditionalFunctionality/Header";


function Populations(){

  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('Bar');


  const graph_data = {
    labels: chartData.map((data) => data.country_name),
    datasets: [
      {
        label: "Population",
        data: chartData.map((data) => data.population),
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

          let suffixes = ["", "K", "M", "B"];
          let order = Math.floor(Math.log(Math.abs(value)) / Math.log(1000));
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
        text: 'Countries Population',
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
        text: 'Countries Population',
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
      {/*<div className="head-container">*/}
      {/*  <img src={logo} alt="Логотип компанії" className="logo" />*/}
      {/*</div>*/}
      <Header />
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
            <h2>Countries list</h2>
          </div>
          <div className="checkbox-content">
            <CountryInfoApp onCheckboxChange={setChartData} dataType={'population'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Populations;