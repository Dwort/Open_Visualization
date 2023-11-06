import React, {useState, useEffect} from 'react';
import axios from 'axios';

const PopulationPrediction = () => {

  const [country, setCountry] = useState('Ukraine');
  const [year, setYear] = useState(2050);
  const [prediction, setPrediction] = useState(null);
  const [lower, setLower] = useState(null);
  const [upper, setUpper] = useState(null);


  useEffect(() => {
    getPopulationPrediction();
  }, [country, year]);

  const getPopulationPrediction = async () => {
    const response = await axios.get('http://127.0.0.1:8000/predict/population/', {
      params: {
        country: country,
        year: year
      }
    });
    setPrediction(response.data.prediction);
    setLower(response.data.lower_border);
    setUpper(response.data.upper_border);
  }

  return (
    <div>
      <select value={country} onChange={e => setCountry(e.target.value)}>
        <option value="Ukraine">Ukraine</option>
        <option value="United States">USA</option>
        <option value="China">China</option>
      </select>

      <input
        type="number"
        value={year}
        onChange={e => setYear(e.target.value)}
      />

      <div>
        <h3>Prediction: {prediction}</h3>
        <p>Lower border: {lower}</p>
        <p>Upper border: {upper}</p>
      </div>

    </div>
  )

}

export default PopulationPrediction;