import React, { useState } from 'react';
import './Modal.scss';

const airports = {
    Delhi: { lat: 28.5562, lon: 77.1000 },
    Mumbai: { lat: 19.0896, lon: 72.8656 },
    Bengaluru: { lat: 12.9716, lon: 77.5946 },
    Chennai: { lat: 13.0827, lon: 80.2707 },
    Kolkata: { lat: 22.5726, lon: 88.3639 },
    Hyderabad: { lat: 17.3850, lon: 78.4867 },
    Pune: { lat: 18.5821, lon: 73.9197 },
    Ahmedabad: { lat: 23.0772, lon: 72.6347 },
    Goa: { lat: 15.3800, lon: 73.8314 },
    Jaipur: { lat: 26.8281, lon: 75.7636 },
    Lucknow: { lat: 26.7619, lon: 80.8893 },
    Srinagar: { lat: 33.9871, lon: 74.7742 },
    Amritsar: { lat: 31.7096, lon: 74.7973 },
    Cochin: { lat: 9.9474, lon: 76.2731 },
    Thiruvananthapuram: { lat: 8.4821, lon: 76.9200 },
    Bhubaneswar: { lat: 20.2513, lon: 85.8178 },
    Indore: { lat: 22.7218, lon: 75.8011 },
    Patna: { lat: 25.5905, lon: 85.0881 },
    Guwahati: { lat: 26.1061, lon: 91.5859 },
    Nagpur: { lat: 21.0922, lon: 79.0472 },
    Varanasi: { lat: 25.4495, lon: 82.8573 },
    Ranchi: { lat: 23.3149, lon: 85.3217 },
    Chandigarh: { lat: 30.6735, lon: 76.7885 },
    Dehradun: { lat: 30.1897, lon: 78.1803 },
    Raipur: { lat: 21.2415, lon: 81.6337 },
    Jammu: { lat: 32.6891, lon: 74.8374 }
  };
  

const airlines = ["Air India", "IndiGo", "Vistara", "SpiceJet", "GoAir"];

const FlightInfoModal = ({ isOpen, onClose }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [suggestions, setSuggestions] = useState({ from: [], to: [] });

  const handleInputChange = (value, field) => {
    let matches = [];
    if (value.length > 0) {
      matches = Object.keys(airports).filter(airport => {
        const regex = new RegExp(`^${value}`, 'i');
        return airport.match(regex);
      });
    }
    if (field === 'from') {
      setFrom(value);
      setSuggestions({ ...suggestions, from: matches });
    } else if (field === 'to') {
      setTo(value);
      setSuggestions({ ...suggestions, to: matches });
    }
  };

  const handleSelectSuggestion = (value, field) => {
    if (field === 'from') {
      setFrom(value);
      setSuggestions({ ...suggestions, from: [] });
    } else if (field === 'to') {
      setTo(value);
      setSuggestions({ ...suggestions, to: [] });
    }
  };

  const handleSearch = () => {
    if (airports[from] && airports[to]) {
      const baseDistance = calculateDistance(airports[from].lat, airports[from].lon, airports[to].lat, airports[to].lon);
      const flightsData = Array.from({ length: 5 }).map((_, index) => {
        const fluctuation = (Math.random() * 0.2 - 0.1) * baseDistance; // +-10% fluctuation in distance
        const distance = baseDistance + fluctuation;
        const cost = calculateCost(distance);
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        return {
          from, to, date, airline,
          distance: distance.toFixed(2),
          cost: cost.toFixed(2)
        };
      });
      setFlights(flightsData);
    } else {
      setFlights([]); 
    }
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  }

  function calculateCost(distance) {
    return distance * 5;
  }

  if (!isOpen) return null;

  console.log(flights, suggestions)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>Close</button>
        <h3>Flight Information</h3>
        <div>
          <input type="text" placeholder="From City" value={from}
            onChange={e => handleInputChange(e.target.value, 'from')} />
          {suggestions.from.length > 0 && (
            <ul className="autocomplete-results">
              {suggestions.from.map((suggestion, index) => (
                <li key={index} onClick={() => handleSelectSuggestion(suggestion, 'from')}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <input type="text" placeholder="To City" value={to}
            onChange={e => handleInputChange(e.target.value, 'to')} />
          {suggestions.to.length > 0 && (
            <ul className="autocomplete-results">
              {suggestions.to.map((suggestion, index) => (
                <li key={index} onClick={() => handleSelectSuggestion(suggestion, 'to')}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <button onClick={handleSearch}>Search Flights</button>
        </div>
        {flights.length > 0 && (
          <div>
            <h4>Flight Results</h4>
            <div className='flightresult-container'>
              {flights.map((flight, index) => (
                <div className='flightresult' key={index}>
                  {flight.airline} Flight from {flight.from} to {flight.to} on {flight.date}. 
                  Distance: {flight.distance} km, Cost: INR {flight.cost}
                </div>
              ))}
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightInfoModal;
