import React from "react";


function ChartPage() {
    function BarGraph(){
        window.location.href = '/chart/population';
    }
    function LineGraph(){
        window.location.href = '/chart/area';
    }
    function PieGraph(){
        window.location.href = '/chart/gdp';
    }
    function DoughnutGraph(){
        window.location.href = '/chart/doughnut';
    }

    return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center">
        <div className="button-container">
          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={BarGraph}
              >
              Порівняння населення країн
            </button>
          </div>

          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={LineGraph}
              >
              Порівняння площ країн
            </button>
          </div>

          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={PieGraph}
              >
              ВВП країн за роки
            </button>
          </div>

          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={DoughnutGraph}
              >
              ВВП загальне
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartPage;