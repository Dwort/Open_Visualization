import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../graph_component/graph_styles/population-area_style.css'
import './prediction_styles/populationPredict.css'
import logo from "../front_additions/logo_open_visualization.jpg";

const PopulationPrediction = () => {

  const [buttonCountries, setButtonCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [year, setYear] = useState(2050);
  const [prediction, setPrediction] = useState(null);
  const [lower, setLower] = useState(null);
  const [upper, setUpper] = useState(null);

  const handleCountryClick = (alphaCode) => {
    setSelectedCountry(alphaCode);
    getPopulationPrediction(alphaCode, year);
  };

  useEffect(() => {
  if(selectedCountry !== null) {
    getPopulationPrediction(selectedCountry, year); // Оновлення при зміні року
  }
}, [year]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/countries/")
      .then((response) => {
        setButtonCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching buttonCountries:", error);
      });
  }, []);

  const getPopulationPrediction = async (alphaCode, year) => {
    const response = await axios.get('http://127.0.0.1:8000/predict/population/', {
      params: {
        country: alphaCode,
        year: year
      }
    });

    setPrediction(response.data.prediction);
    setLower(response.data.lower_border);
    setUpper(response.data.upper_border);
  }

  return (
    <div className="main-container prediction">
      <div className="head-container">
        <img src={logo} alt="Логотип компанії" className="logo" />
      </div>
      <div className="body-container">

        <div className="predict-date-container">
          {/*<input*/}
          {/*  type="number"*/}
          {/*  value={year}*/}
          {/*  onChange={e => setYear(parseInt(e.target.value))}*/}
          {/*/>*/}
          <div className="predict-container">
            <h3>Прогнозоване значення: {parseInt(prediction).toLocaleString('en-US') + "  млн."}</h3>
            <p>Нижня межа прогнозу: {parseInt(lower).toLocaleString('en-US') + "  млн."}</p>
            <p>Верхня межа прогнозу: {parseInt(upper).toLocaleString('en-US') + "  млн."}</p>
          </div>
          <input
            type="range"
            min = {2024}
            max = {2050}
            step={1}
            value={year}
            onChange={e => setYear(parseInt(e.target.value))}
          />
           <p>Обраний рік: {year}</p>
        </div>

        <div className="checkbox-container">
          <div className="h2-container">
            <h2>Список країн</h2>
          </div>
          <div className="checkbox-content">
            <div className="button-container-predict">
              {buttonCountries.map((country) => (
                <button className="button-4"
                  key={country.alphaCode}
                  onClick={() => handleCountryClick(country.alphaCode)}
                  disabled={selectedCountry === country.alphaCode}
                >
                  {country.country_name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default PopulationPrediction;