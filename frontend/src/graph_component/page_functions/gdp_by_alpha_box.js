import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../graph_styles/GdpByAlphaCode.css'

function GdpByAlphaCode({ onDataReceived }){
  const [buttonCountries, setButtonCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/countries/")
      .then((response) => {
        setButtonCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching buttonCountries:", error);
      });
  }, []);

  const requestGdpData = (alphaCode) => {
    axios.get(`http://127.0.0.1:8000/api/gdp/${alphaCode}/`)
      .then((response) => {
        const filteredData = response.data.filter((item) => item.gdp !== null);
        onDataReceived(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching GDP data:", error);
      });
  };

  const handleCountryClick = (alphaCode) => {
    setSelectedCountry(alphaCode);
    requestGdpData(alphaCode);
  };

  return (
    <div className="button-container-gdp">
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
  );
}

export default GdpByAlphaCode;