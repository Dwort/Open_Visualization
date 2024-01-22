import React from "react";
import "../HomePage.css";
import population_icon from "../front_additions/buttons_icon/people.png";
import area_icon from "../front_additions/buttons_icon/area-graph.png";
import hist_gdp_icon from "../front_additions/buttons_icon/bank.png";
import gdp_icon from "../front_additions/buttons_icon/economic-growth.png";
import crime_icon from "../front_additions/buttons_icon/prisoner.png";
import distribution_icon from "../front_additions/buttons_icon/generation.png";
import life_icon from "../front_additions/buttons_icon/age-group.png";
import urbanization_icon from "../front_additions/buttons_icon/cityscape.png";
import Header from "./Header"

function ChartPage() {
    function PopulationCompare(){
        window.location.href = '/chart/population';
    }
    function AreaCompare(){
        window.location.href = '/chart/area';
    }
    function HistoricalGDP(){
        window.location.href = '/chart/history-gdp';
    }
    function GDPCompare(){
        window.location.href = '/chart/gdp';
    }
    function CrimeRateEurope(){
        window.location.href = '/chart/crime-europe';
    }
    function LifeExpectancy(){
        window.location.href = '/chart/lifetime';
    }
    function Urbanization(){
        window.location.href = '/chart/urbanization';
    }
    function PopulationDistribution(){
        window.location.href = '/chart/gdp';
    }

    return (
    <div className="main-container graph">
      <Header />
      <div className="buttons-group">
        <div className="button-container">
          <div className="button-wrapper">
            <button
              className="custom-button graph"
              onClick={PopulationCompare}
              >
              <img src={population_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Кількість населення</span>
            </button>
          </div>

          <div className="button-wrapper">
            <button
              className="custom-button graph"
              onClick={AreaCompare}
              >
              <img src={area_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Розміри країн</span>
            </button>
          </div>

          <div className="button-wrapper">
            <button
              className="custom-button graph"
              onClick={HistoricalGDP}
              >
              <img src={hist_gdp_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Історичне ВВП</span>
            </button>
          </div>

          <div className="button-wrapper">
            <button
              className="custom-button graph"
              onClick={GDPCompare}
              >
              <img src={gdp_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">ВВП країн (сучасність)</span>
            </button>
          </div>
        </div>
        <div className="button-container">
          <div className="button-wrapper graph">
            <button
              className="custom-button graph"
              onClick={CrimeRateEurope}
              >
              <img src={crime_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Рівень злочинності</span>
            </button>
          </div>
          <div className="button-wrapper graph">
            <button
              className="custom-button graph"
              onClick={LifeExpectancy}
              >
              <img src={life_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Середня тривалість життя</span>
            </button>
          </div>
          <div className="button-wrapper graph">
            <button
              className="custom-button graph"
              onClick={Urbanization}
              >
              <img src={urbanization_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Рівень урбанізації</span>
            </button>
          </div>
          <div className="button-wrapper graph">
            <button
              className="custom-button graph"
              onClick={PopulationDistribution}
              >
              <img src={distribution_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Розподіл населення (за віком)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartPage;