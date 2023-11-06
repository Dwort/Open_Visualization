import React from "react";
import "./HomePage.css";

function HomePage() {

  function Chart() {
  window.location.href = '/chart';
  }
  function Map() {
  window.location.href = '/map';
  }
  function Statistics() {
  window.location.href = '/statistics';
  }
  function Prediction() {
  window.location.href = '/prediction';
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center">
        <div className="button-container">
          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={Chart}
              >
              Побудувати Графік
            </button>
          </div>

          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={Map}
              >
              Відобразити на карті
            </button>
          </div>

          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={Statistics}
              >
              Відобразити статистику
            </button>
          </div>
          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={Prediction}
              >
              Зробити прогноз
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
