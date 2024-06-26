/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const App = () => {
  const [country, setCountry] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [neighborData, setNeighborData] = useState([]);
  const [selectedNeighbor, setSelectedNeighbor] = useState(null);
  const [error, setError] = useState('');

  const fetchCountryData = async (country) => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${country}`
      );
      if (!response.ok) {
        throw new Error('País no encontrado');
      }
      const data = await response.json();
      setCountryData(data[0]);
      setError('');
      fetchNeighborData(data[0].borders);
    } catch (err) {
      setError(err.message);
      setCountryData(null);
      setNeighborData([]);
      setSelectedNeighbor(null);
    }
  };

  const fetchNeighborData = async (borders) => {
    if (!borders || borders.length === 0) {
      setNeighborData([]);
      return;
    }
    try {
      const responses = await Promise.all(
        borders.map((border) =>
          fetch(`https://restcountries.com/v3.1/alpha/${border}`)
        )
      );
      const neighbors = await Promise.all(responses.map((res) => res.json()));
      setNeighborData(neighbors.map((n) => n[0]));
      setSelectedNeighbor(null);
    } catch (err) {
      console.error('Error fetching neighbor data:', err);
      setNeighborData([]);
      setSelectedNeighbor(null);
    }
  };

  const handleNeighborClick = (neighbor) => {
    setSelectedNeighbor(neighbor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCountryData(country);
  };

  return (
    <div className="app">
      <h1>Información de Países</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Introduce el nombre de un país"
        />
        <button type="submit">Buscar</button>
      </form>
      {error && <p>{error}</p>}
      <div className="content">
        {countryData && (
          <div className="card-container">
            <div className="card">
              <h2>{countryData.name.common}</h2>
              <img
                className="flags"
                src={countryData.flags.png}
                alt={`Bandera de ${countryData.name.common}`}
              />
              <p>
                <strong>Capital:</strong> {countryData.capital}
              </p>
              <p>
                <strong>Región:</strong> {countryData.region}
              </p>
              <p>
                <strong>Subregión:</strong> {countryData.subregion}
              </p>
              <p>
                <strong>Población:</strong>{' '}
                {countryData.population.toLocaleString()}
              </p>
              <p>
                <strong>Área:</strong> {countryData.area.toLocaleString()} km²
              </p>
              {neighborData.length > 0 && (
                <div className="neighbors">
                  <h3>Países vecinos:</h3>
                  <div className="neighbor-flags">
                    {neighborData.map((neighbor) => (
                      <img
                        key={neighbor.cca3}
                        src={neighbor.flags.png}
                        alt={`Bandera de ${neighbor.name.common}`}
                        onClick={() => handleNeighborClick(neighbor)}
                        className="neighbor-flag"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {selectedNeighbor && (
          <div
            className={`neighbor-details ${selectedNeighbor ? 'active' : ''}`}
          >
            <div className="card">
              <h2>{selectedNeighbor.name.common}</h2>
              <img
                className="flags"
                src={selectedNeighbor.flags.png}
                alt={`Bandera de ${selectedNeighbor.name.common}`}
              />
              <p>
                <strong>Capital:</strong> {selectedNeighbor.capital}
              </p>
              <p>
                <strong>Región:</strong> {selectedNeighbor.region}
              </p>
              <p>
                <strong>Subregión:</strong> {selectedNeighbor.subregion}
              </p>
              <p>
                <strong>Población:</strong>{' '}
                {selectedNeighbor.population.toLocaleString()}
              </p>
              <p>
                <strong>Área:</strong> {selectedNeighbor.area.toLocaleString()}{' '}
                km²
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default App;
