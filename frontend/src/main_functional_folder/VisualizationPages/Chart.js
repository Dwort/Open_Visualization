import React, {useEffect, useState} from "react";
import "../../HomePage.css";
import population_icon from "../../front_additions/buttons_icon/people.png";
import area_icon from "../../front_additions/buttons_icon/area-graph.png";
import hist_gdp_icon from "../../front_additions/buttons_icon/bank.png";
import gdp_icon from "../../front_additions/buttons_icon/economic-growth.png";
import crime_icon from "../../front_additions/buttons_icon/prisoner.png";
import distribution_icon from "../../front_additions/buttons_icon/generation.png";
import life_icon from "../../front_additions/buttons_icon/age-group.png";
import urbanization_icon from "../../front_additions/buttons_icon/cityscape.png";
import add_icon from '../../front_additions/add.png';
import Header from "../AdditionalFunctionality/Header"
import Button from 'react-bootstrap/Button';
import { apiRequestFunctions } from "../AdditionalFunctionality/ApiRequestFunctions";


function ChartPage() {
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const { LimitChecking, handleLimit } = apiRequestFunctions();

    useEffect(() => {
        const limit = async () => {
            try {
                const isLimitChecking = await LimitChecking();
                setButtonDisabled(isLimitChecking);
            } catch (error) {
                console.error('Error during limit checking -> ', error);
            }
        }

        limit().catch(error => {
            console.error('Unhandled promise rejection in useEffect -> ', error);
        });
    });

    const handleDirection = (direction) => {
        handleLimit('chart', direction).catch((error) => {
            console.error("Error with handling direction -> ", error);
        });
    }

    return (
    <div className="main-container graph">
        <Header />
        {buttonDisabled && (
            <div className="limit-exceeded-block">
                <p>Limits exceeded. Please upgrade your account to access more features.</p>
            </div>
        )}
        <div className="buttons-group">
            <div className="button-container">
                <div className="button-wrapper">
                    <Button
                        className="custom-button graph"
                        onClick={() => handleDirection('population')}
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
                        onClick={() => handleDirection('area')}
                      >
                      <img src={area_icon} alt="button_icon" className="icon icon1"/>
                      <span className="button-text">Country size</span>
                    </Button>
                </div>

                <div className="button-wrapper">
                    <Button
                        disabled={buttonDisabled}
                        className="custom-button graph"
                        onClick={() => handleDirection('gdp')}
                      >
                      <img src={hist_gdp_icon} alt="button_icon" className="icon icon1"/>
                      <span className="button-text">Country GDP</span>
                    </Button>
                </div>

                <div className="button-wrapper">
                    <Button
                        disabled={buttonDisabled}
                        className="custom-button graph"
                        onClick={() => handleDirection('gdp-compare')}
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
                        onClick={() => handleDirection('crime-europe')}
                      >
                      <img src={crime_icon} alt="button_icon" className="icon"/>
                      <span className="button-text">Crime rate</span>
                    </Button>
                </div>

                <div className="button-wrapper graph">
                    <Button
                        disabled={buttonDisabled}
                        className="custom-button graph"
                        onClick={() => handleDirection('life-expectancy')}
                      >
                      <img src={life_icon} alt="button_icon" className="icon"/>
                      <span className="button-text">Average life expectancy</span>
                    </Button>
                </div>

                <div className="button-wrapper graph">
                    <Button
                        disabled={buttonDisabled}
                        className="custom-button graph"
                        onClick={() => handleDirection('urbanization')}
                      >
                      <img src={urbanization_icon} alt="button_icon" className="icon"/>
                      <span className="button-text">Level of urbanization</span>
                    </Button>
                </div>

                <div className="button-wrapper graph">
                    <Button
                        disabled={buttonDisabled}
                        className="custom-button graph"
                        onClick={() => handleDirection('distribution')}
                      >
                      <img src={distribution_icon} alt="button_icon" className="icon"/>
                      <span className="button-text">Population distribution by age</span>
                    </Button>
                </div>
            </div>
            <div className="button-container">
                <div className="button-wrapper add">
                    <Button
                        className="custom-button graph add"
                        onClick={() => handleDirection('')}
                        disabled={buttonDisabled}
                      >
                      <img src={add_icon} alt="button_icon" className="icon-add"/>
                      <span className="button-text">Add new project</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ChartPage;