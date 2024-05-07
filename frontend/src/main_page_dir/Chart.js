import React, {useEffect, useState} from "react";
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
import Cookies from "js-cookie";
import axios from "axios";
import Button from 'react-bootstrap/Button';


function ChartPage() {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const token = Cookies.get("access_token");

    ////////////////////////////////////////////

    useEffect(() => {

        axios.get('http://127.0.0.1:8000/api/premium/limit-checking/', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).catch(error => {
            if (error.response.status === 429) {
                setButtonDisabled(true);
            } else {
                console.error('Error with limit checking: ', error);
            }
        });
    });

    const handleLimit = async (direction) => {

        await axios.post('http://127.0.0.1:8000/api/premium/limit-changing/', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(response => {
            if (response.status === 200) {
                window.location.href = `/chart/${direction}`;
            }
        }).catch(error => {
            console.error("Error with handling limits: ", error);
        });
    }

    return (
    <div className="main-container graph">
      <Header />
      <div className="buttons-group">
        <div className="button-container">
          <div className="button-wrapper">
            <Button
                className="custom-button graph"
                onClick={() => handleLimit('population')}
                disabled={buttonDisabled}
              >
              <img src={population_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">World population</span>
            </Button>
          </div>

          <div className="button-wrapper">
            <Button
                disabled={buttonDisabled}
                className="custom-button graph"
                onClick={() => handleLimit('area')}
              >
              <img src={area_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Country size</span>
            </Button>
          </div>

          <div className="button-wrapper">
            <Button
                disabled={buttonDisabled}
                className="custom-button graph"
                onClick={() => handleLimit('gdp')}
              >
              <img src={hist_gdp_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Country GDP</span>
            </Button>
          </div>

          <div className="button-wrapper">
            <Button
                disabled={buttonDisabled}
                className="custom-button graph"
                onClick={() => handleLimit('gdp-compare')}
              >
              <img src={gdp_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">GDP compare</span>
            </Button>
          </div>
        </div>
        <div className="button-container">
          <div className="button-wrapper graph">
            <Button
                disabled={buttonDisabled}
                className="custom-button graph"
                onClick={() => handleLimit('crime-europe')}
              >
              <img src={crime_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Crime rate</span>
            </Button>
          </div>
          <div className="button-wrapper graph">
            <Button
                disabled={buttonDisabled}
                className="custom-button graph"
                onClick={() => handleLimit('life-expectancy')}
              >
              <img src={life_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Average life expectancy</span>
            </Button>
          </div>
          <div className="button-wrapper graph">
            <Button
                disabled={buttonDisabled}
                className="custom-button graph"
                onClick={() => handleLimit('urbanization')}
              >
              <img src={urbanization_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Level of urbanization</span>
            </Button>
          </div>
          <div className="button-wrapper graph">
            <Button
                disabled={buttonDisabled}
                className="custom-button graph"
                onClick={() => handleLimit('distribution')}
              >
              <img src={distribution_icon} alt="button_icon" className="icon icon1"/>
              <span className="button-text">Розподіл населення (за віком)</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartPage;