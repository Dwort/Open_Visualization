import React from "react";


function PredictionPage() {
    function PredictPopulation(){
        window.location.href = '/prediction/population';
    }
    function LineGraph(){
        window.location.href = '/prediction/unemployment';

    }

    return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center">
        <div className="button-container">
          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={PredictPopulation}
              >
              Прогнозування населення
            </button>
          </div>

          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={LineGraph}
              >
              Прогнозування безробіття
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictionPage;