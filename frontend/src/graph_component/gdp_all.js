// import React from 'react';
// import './graph_styles/tables.css'
//
// function GdpAll() {
//   const data = [
//       ['Країна', 'Рівень злочинності', 'Рівень вбивств', 'Рівень грабежів', 'Рівень крадіжок'], // Назви колонок
//       ["США", 50.2, 5.6, 20.3, 15.1],
//       ["Канада", 30.5, 2.9, 12.6, 10.4],
//       ["Бразилія", 70.8, 7.1, 25.5, 18.9],
//       ["Об'єднане Королівство", 40.6, 3.2, 18.9, 14.2],
//       ["Німеччина", 35.9, 2.8, 15.6, 11.7],
//       ["Франція", 45.3, 4.1, 19.7, 13.8],
//       ["Австралія", 25.7, 1.9, 11.5, 8.7],
//       ["Японія", 15.4, 1.3, 8.6, 6.4],
//       ["Китай", 55.2, 5.3, 28.6, 20.9],
//       ["Індія", 20.3, 1.6, 9.8, 7.1],
//       ["Південа Африка", 80.6, 9.2, 35.4, 26.8],
//       ["Мексика", 75.9, 8.4, 32.7, 24.5],
//       ["Італія", 38.2, 3.6, 16.9, 12.6],
//       ["Іспанія", 42.5, 3.9, 18.3, 13.7]
//   ];
//
//   return (
//     <div className="first-container">
//         <div className="table-container">
//             <div className="checkbox-content">
//                 <table>
//                   <thead>
//                     <tr>
//                       {data[0].map((columnName, index) => (
//                         <th key={index}>{columnName}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.slice(1).map((row, index) => (
//                       <tr key={index}>
//                         {row.map((cell, cellIndex) => (
//                           <td key={cellIndex}>{cell}</td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//             </div>
//         </div>
//
//     </div>
//   );
// }
//
// export default GdpAll;
// //
// // function CountryInfoApp() {
// //   const countries = [
// //     { alphaCode: 'UKR', name: 'Україна' },
// //     { alphaCode: 'USA', name: 'США' },
// //     { alphaCode: 'DEU', name: 'Німеччина' },
// //     { alphaCode: 'ETH', name: 'Ефіопія' },
// //     { alphaCode: 'GBR', name: 'Велика Британія' },
// //     { alphaCode: 'UGA', name: 'Уганда' },
// //     { alphaCode: 'ITA', name: 'Італія' },
// //     // Додайте інші країни за потребою
// //   ];
// //
// //   const [selectedCountries, setSelectedCountries] = useState([]);
// //
// //   const handleCheckboxChange = (event, alphaCode) => {
// //     if (event.target.checked) {
// //       axios.get(`http://127.0.0.1:8000/api/population/${alphaCode}/`)
// //         .then((response) => {
// //           const data = response.data[0];
// //           setSelectedCountries(prevState => [...prevState, { ...data, alphaCode }]);
// //         })
// //         .catch((error) => {
// //           console.error(error);
// //         });
// //     } else {
// //       setSelectedCountries(prevState => prevState.filter(country => country.alphaCode !== alphaCode));
// //     }
// //   };
// //
// //   return (
// //     <div>
// //       <h1>Інформація про країни</h1>
// //       <ul>
// //         {countries.map((country) => (
// //           <li key={country.alphaCode}>
// //             <label>
// //               <input
// //                 type="checkbox"
// //                 onChange={(e) => handleCheckboxChange(e, country.alphaCode)}
// //               />{' '}
// //               {country.name}
// //             </label>
// //           </li>
// //         ))}
// //       </ul>
// //       {selectedCountries.length > 0 && (
// //         <div>
// //           <h2>Інформація про вибрані країни</h2>
// //           <ul>
// //             {selectedCountries.map(country => (
// //               <li key={country.alphaCode}>
// //                 <p>Країна: {country.country_name}</p>
// //                 <p>Населення: {country.population}</p>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// //
// //
// // export default CountryInfoApp;
//
//
//
//
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// //
// // const GdpByAlphaCode = ({ onDataReceived }) => {
// //   const [countries, setCountries] = useState([]);
// //   const [selectedCountry, setSelectedCountry] = useState(null);
// //
// //   useEffect(() => {
// //     axios.get("http://127.0.0.1:8000/api/countries/")
// //       .then((response) => {
// //         setCountries(response.data);
// //       })
// //       .catch((error) => {
// //         console.error("Error fetching countries:", error);
// //       });
// //   }, []);
// //
// //   const fetchGdpData = (alphaCode) => {
// //     axios.get(`http://127.0.0.1:8000/api/gdp/${alphaCode}/`)
// //       .then((response) => {
// //         const filteredData = response.data.filter((item) => item.gdp !== null);
// //         onDataReceived(filteredData);
// //       })
// //       .catch((error) => {
// //         console.error("Error fetching GDP data:", error);
// //       });
// //   };
// //
// //   const handleCountryClick = (alphaCode) => {
// //     setSelectedCountry(alphaCode);
// //     fetchGdpData(alphaCode);
// //   };
// //
// //   return (
// //     <div>
// //       {countries.map((country) => (
// //         <button
// //           key={country.alphaCode}
// //           onClick={() => handleCountryClick(country.alphaCode)}
// //           disabled={selectedCountry === country.alphaCode}
// //         >
// //           {country.countryName}
// //         </button>
// //       ))}
// //     </div>
// //   );
// // };
// //
// // export default GdpByAlphaCode;
