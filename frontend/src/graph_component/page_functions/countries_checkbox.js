import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CountryInfoApp({ onCheckboxChange, dataType }) {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    // Робимо запит до сервера, коли компонент завантажується
    axios.get('http://127.0.0.1:8000/api/countries/')
      .then((response) => {
        setCountries(response.data); // Оновлюємо стан з отриманими даними
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCheckboxChangeCountries = (event, alphaCode) => {

    const apiUrl = dataType === 'population'
      ? `http://127.0.0.1:8000/api/population/${alphaCode}/`
      : `http://127.0.0.1:8000/api/area/${alphaCode}/`;

    if (event.target.checked) {
      axios.get(apiUrl)
        .then((response) => {
          const data = response.data[0];
          if (selectedCountries.length < 10) {
            setSelectedCountries(prevState => [...prevState, { ...data, alphaCode }]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setSelectedCountries(prevState => prevState.filter(country => country.alphaCode !== alphaCode));
    }
  };

  useEffect(() => {
    onCheckboxChange(selectedCountries);
  }, [selectedCountries, onCheckboxChange]);

  return (
    <div>
      <ul>
        {countries.map((country) => (
          <li key={country.alphaCode}>
            <label>
              <input
                type="checkbox"
                onChange={(e) => handleCheckboxChangeCountries(e, country.alphaCode)}
              />{' '}
              {country.country_name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CountryInfoApp;
