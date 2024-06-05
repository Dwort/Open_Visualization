import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import ChartPage from "./main_functional_folder/VisualizationPages/Chart";
import InteractiveMapPage from "./main_functional_folder/VisualizationPages/InteractiveMap";
import StatisticsPage from "./main_functional_folder/VisualizationPages/Statistics";
import Populations from "./graph_component/populations";
import Area from "./graph_component/areas";
import GdpByAlpha from "./graph_component/gdp_by_alpha";
import PopulationPrediction from "./prediction_component/population_prediction";
import PredictionPage from "./main_functional_folder/VisualizationPages/Predictions";
import PremiumSub from "./main_functional_folder/premium/PremiumSub"
import Registration from "./main_functional_folder/auth/registration";
import Login from "./main_functional_folder/auth/login";
import UserProfile from "./main_functional_folder/auth/user_page";
import TermsAndConditions from "./main_functional_folder/burger_menu_files/TermsAndConditions";
import EditUserData from "./main_functional_folder/auth/edit_user_data";
import UserProjectsPage from "./main_functional_folder/burger_menu_files/UserProjectsPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/premium" element={<PremiumSub />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        <Route path="/user" element={<UserProfile />} />
          <Route path="/user/edit" element={<EditUserData />} />
          <Route path="/user/terms" element={<TermsAndConditions />} />
          <Route path="/user/projects" element={<UserProjectsPage />} />


        <Route path="/chart" element={<ChartPage />} />
          <Route path="/chart/population" element={<Populations />} />
          <Route path="/chart/area" element={<Area />} />
          <Route path="/chart/gdp" element={<GdpByAlpha />} />
          {/*<Route path="/chart/gdp" element={<GdpAll />} />*/}

        <Route path="/map" element={<InteractiveMapPage />} />

        <Route path="/statistics" element={<StatisticsPage />} />

        <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/prediction/population" element={<PopulationPrediction />} />
      </Routes>
    </Router>
  );
}

export default App;
