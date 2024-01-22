import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import ChartPage from "./main_page_dir/Chart";
import InteractiveMapPage from "./main_page_dir/InteractiveMap";
import StatisticsPage from "./main_page_dir/Statistics";
import Populations from "./graph_component/populations";
import Area from "./graph_component/areas";
import GdpByAlpha from "./graph_component/gdp_by_alpha";
import GdpAll from "./graph_component/gdp_all";
import PopulationPrediction from "./prediction_component/population_prediction";
import PredictionPage from "./main_page_dir/Predictions";
import PremiumSub from "./main_page_dir/premium/premium_sub"
import Registration from "./main_page_dir/auth/registration";
import Login from "./main_page_dir/auth/login";
import UserProfile from "./main_page_dir/auth/user_page";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/premium" element={<PremiumSub />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<UserProfile />} />

        <Route path="/chart" element={<ChartPage />} />
          <Route path="/chart/population" element={<Populations />} />
          <Route path="/chart/area" element={<Area />} />
          <Route path="/chart/history-gdp" element={<GdpByAlpha />} />
          <Route path="/chart/gdp" element={<GdpAll />} />

        <Route path="/map" element={<InteractiveMapPage />} />

        <Route path="/statistics" element={<StatisticsPage />} />

        <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/prediction/population" element={<PopulationPrediction />} />
      </Routes>
    </Router>
  );
}

export default App;
