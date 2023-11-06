// import React, { useState } from 'react';
// import axios from 'axios';
//
// function CountryInfoApp() {
//   const countries = [
//     { alphaCode: 'UKR', name: 'Україна' },
//     { alphaCode: 'USA', name: 'США' },
//     { alphaCode: 'DEU', name: 'Німеччина' },
//     { alphaCode: 'ETH', name: 'Ефіопія' },
//     { alphaCode: 'GBR', name: 'Велика Британія' },
//     { alphaCode: 'UGA', name: 'Уганда' },
//     { alphaCode: 'ITA', name: 'Італія' },
//     // Додайте інші країни за потребою
//   ];
//
//   const [selectedCountries, setSelectedCountries] = useState([]);
//
//   const handleCheckboxChange = (event, alphaCode) => {
//     if (event.target.checked) {
//       axios.get(`http://127.0.0.1:8000/api/population/${alphaCode}/`)
//         .then((response) => {
//           const data = response.data[0];
//           setSelectedCountries(prevState => [...prevState, { ...data, alphaCode }]);
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     } else {
//       setSelectedCountries(prevState => prevState.filter(country => country.alphaCode !== alphaCode));
//     }
//   };
//
//   return (
//     <div>
//       <h1>Інформація про країни</h1>
//       <ul>
//         {countries.map((country) => (
//           <li key={country.alphaCode}>
//             <label>
//               <input
//                 type="checkbox"
//                 onChange={(e) => handleCheckboxChange(e, country.alphaCode)}
//               />{' '}
//               {country.name}
//             </label>
//           </li>
//         ))}
//       </ul>
//       {selectedCountries.length > 0 && (
//         <div>
//           <h2>Інформація про вибрані країни</h2>
//           <ul>
//             {selectedCountries.map(country => (
//               <li key={country.alphaCode}>
//                 <p>Країна: {country.country_name}</p>
//                 <p>Населення: {country.population}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
//
//
// export default CountryInfoApp;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
//
// const GdpByAlphaCode = ({ onDataReceived }) => {
//   const [countries, setCountries] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//
//   useEffect(() => {
//     axios.get("http://127.0.0.1:8000/api/countries/")
//       .then((response) => {
//         setCountries(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching countries:", error);
//       });
//   }, []);
//
//   const fetchGdpData = (alphaCode) => {
//     axios.get(`http://127.0.0.1:8000/api/gdp/${alphaCode}/`)
//       .then((response) => {
//         const filteredData = response.data.filter((item) => item.gdp !== null);
//         onDataReceived(filteredData);
//       })
//       .catch((error) => {
//         console.error("Error fetching GDP data:", error);
//       });
//   };
//
//   const handleCountryClick = (alphaCode) => {
//     setSelectedCountry(alphaCode);
//     fetchGdpData(alphaCode);
//   };
//
//   return (
//     <div>
//       {countries.map((country) => (
//         <button
//           key={country.alphaCode}
//           onClick={() => handleCountryClick(country.alphaCode)}
//           disabled={selectedCountry === country.alphaCode}
//         >
//           {country.countryName}
//         </button>
//       ))}
//     </div>
//   );
// };
//
// export default GdpByAlphaCode;
