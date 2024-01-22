import React from "react";
import "./HomePage.css";
import graph_icon from "../src/front_additions/buttons_icon/bar-graph.png"
import map_icon from "../src/front_additions/buttons_icon/world-map.png"
import statistic_icon from "../src/front_additions/buttons_icon/statistic.png"
import predict_icon from "../src/front_additions/buttons_icon/demand.png"
import video_about from "../src/front_additions/about.mp4"
import partners from "../src/front_additions/partners.png"
import Header from "./main_page_dir/Header";

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
    <div className="main-container">
      <Header />
      <div className="body-home-container">
        <div className="button-container" id="scrollToFunction">

          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={Chart}
              >
              <img src={graph_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Graph</span>
            </button>
          </div>

          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={Map}
              >
              <img src={map_icon} alt="button_icon" className="icon icon2"/>
              <span className="button-text">Map</span>
            </button>
          </div>

          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={Statistics}
              >
              <img src={statistic_icon} alt="button_icon" className="icon icon3"/>
              <span className="button-text">Statistics</span>
            </button>
          </div>
          <div className="button-wrapper">
            <button
              className="custom-button"
              onClick={Prediction}
              >
              <img src={predict_icon} alt="button_icon" className="icon icon4"/>
              <span className="button-text">Data Prediction</span>
            </button>
          </div>
        </div>

        <div className="about-container" id="scrollToAbout">
          <div className="text-video-container">
            <div className="text-v-context">
              <p>&nbsp;&nbsp;Open Visualization - visualization of demographic data with analysis, graphs and forecasting.
                It is interactivity, comprehensibility and accessibility for everyone.<br/><br/>&nbsp;&nbsp;
                We unlock the secrets of numbers and create an opportunity to imagine the future.<br/><br/>&nbsp;&nbsp;
                Welcome to a world where data is stories!
              </p>
              <h6>Open Visualization.  ©PolyTex</h6>
            </div>
            <div className="video-context">
              <video controls autoPlay>
                <source src={video_about} type="video/mp4" />
                Your browser does not support video.
              </video>
            </div>
          </div>

          <div className="text-about-context">
            <div className="line"></div>
            <div className="text-about">
              <h1>About:</h1>
              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ fontSize: '20px' }}>Data visualization</span> – it's
                not just graphs and numbers, it's the key to understanding the essence and importance of the information
                we receive. Our product - is an open resource that allows you not only to view demographic data, but also
                to visualize it by with the help of interactive graphs and a map that helps in understanding the trends.
                <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                It is clear that sometimes the volume and complexity of this data can be difficult to comprehend. It is
                extraordinary here visualization that allows you to quickly and clearly present information becomes
                important. We don't just show numbers - we turn them into stories that reveal trends and opportunities.
                In addition, our product uses advanced machine learning algorithms to predict the future demographic data.
                This makes it possible to imagine future scenarios and make informed decisions now.
                <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We believe that working with data should be accessible to
                everyone, so our product is easy to use. Welcome to the world of demographic data, where anyone can create
                your own story from the numbers.
              </p>
            </div>
          </div>

          <div className="cooperation-context" id="scr">
            <h1>Trusted by 100,000+ incredible people and teams</h1>
            <img src={partners} alt="project-partners" className="partners"/>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HomePage;
