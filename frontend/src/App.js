import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import ChartPage from "./main_page_dir/Chart";
import InteractiveMapPage from "./main_page_dir/InteractiveMap";
import StatisticsPage from "./main_page_dir/Statistics";
import Populations from "./graph_component/populations";
import Area from "./graph_component/areas";
import GdpByAlpha from "./graph_component/gdp_by_alpha";
import PopulationPrediction from "./prediction_component/population_prediction";
import PredictionPage from "./main_page_dir/Predictions";
// import DoughnutChart from "./graph_component/Doughnut";
// import CountryInfoApp from "./graph_component/page_functions/countries_checkbox";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chart" element={<ChartPage />} />
          <Route path="/chart/population" element={<Populations />} />
          <Route path="/chart/area" element={<Area />} />
          <Route path="/chart/gdp" element={<GdpByAlpha />} />
          {/*<Route path="/chart/doughnut" element={<DoughnutChart />} />*/}

        <Route path="/map" element={<InteractiveMapPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/prediction/population" element={<PopulationPrediction />} />
      </Routes>
    </Router>
  );
}

export default App;
