import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({filterValue, handleFilterEvent}) => (
  <div>
    find countries <input value={filterValue} onChange={handleFilterEvent} />
  </div>
)

const DisplayCountryInfo = ({country, weatherData}) => {
  if (country.length === 0) return <></>

  let weatherInfo = <div>Loading weather data...</div>
  if (weatherData !== undefined){
    weatherInfo = <div>
      <div><b>temperature:</b> {weatherData.temperature} Celcius</div>
      <img src={weatherData.weather_icons[0]} alt='weather icon'/>
      <div><b>wind:</b> {weatherData.wind_speed} mph direction {weatherData.wind_dir}</div>
    </div>
  }
  
  return(
    <div>
      <h1>{country.name}</h1>
        <div>capital {country.capital}</div>
        <div>population {country.population}</div>
      <h2>languages</h2>
        <div>
          <ul>
            {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
          </ul>
        </div>
      <img src={country.flag} alt='country flag' height="100" width="100"/>

      <h2>Weather in {country.capital}</h2>
      {weatherInfo}
    </div>
  )
}

const Display = (props) => {
  let output = <div>Too many matches, specify another filter</div>
  
  if (props.shownCountries.length === 0)
    output = "No matches found."
  else if (props.shownCountries.length === 1)
    output = null
  else if (props.shownCountries.length < 10){
    output = <div>
      {props.shownCountries
      .map(info => <div key={info.name}>
          {info.name} 
          <button onClick={() => props.setCountry(info)} key={info.name}>show</button>
        </div>
      )}
    </div>
  }
  
  return output
}

const App = () => {
  const [countries, updateCountries] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [shownCountries, setShownCountries] = useState([])
  const [country, setCountry] = useState([])
  const [weatherData, setWeatherData] = useState([0])

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then((response) => updateCountries(response.data))
  }, [])

  useEffect(() => {
    axios
      .get('http://api.weatherstack.com/current?access_key=' + process.env.REACT_APP_API_KEY + '&query=' + country.capital)
      .then(response => setWeatherData(response.data.current))
  }, [country])

  const handleFilterEvent = (e) => {
    setFilterValue(e.target.value)

    const filteredCountries = countries.filter(country => country.name
      .toLowerCase()
      .includes(e.target.value.toLowerCase()))

    setShownCountries(filteredCountries)
    setCountry(filteredCountries.length===1?filteredCountries[0]:[])
  }

  return (
    <div>
      <Filter
        filterValue={filterValue}
        handleFilterEvent={handleFilterEvent}
      />

      <Display 
        countries={countries}
        filter={filterValue}
        shownCountries={shownCountries}
        setCountry={setCountry}
        weatherData={weatherData}
      />
      
      <DisplayCountryInfo
        country={country}
        weatherData={weatherData}
      />
    </div>
  )
}

export default App;
