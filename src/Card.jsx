/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react'
import SearchBar from './SearchBar.jsx'
import SearchButton from './SearchButton.jsx'
import questionmark from '../src/assets/questionmark.jpg'
import weatherIcons from './weathericons.js'
import notfound from '../src/assets/notfound.jpg'

export default function Card({ weatherData, setWeatherData }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestionsList, setSuggestionsList] = useState([])

  const [selectedCity, setSelectedCity] = useState('')
  const [displayedCity, setDisplayedCity] = useState('')

  const [weatherConditions, setWeatherConditions] = useState([])

  const [forecastDate, setForecastDate] = useState(0)

  //

  function getWeatherConditions(data, forecastDate) {
    if (!data) {
      console.error('Invalid data:', data)
      return
    }
    setWeatherConditions([
      {
        condition: forecastDate === 0 ? 'Temperature' : 'Average temperature',
        units_primary: {
          display: true,
          value:
            forecastDate === 0
              ? data.current.temp_c
              : data.forecast.forecastday[forecastDate].day.avgtemp_c,
          symbol: '°C',
        },
        units_secondary: {
          display: false,
          value:
            forecastDate === 0
              ? data.current.temp_f
              : data.forecast.forecastday[forecastDate].day.avgtemp_f,
          symbol: 'F',
        },
      },
      {
        condition: forecastDate === 0 ? 'Feels like' : 'Max / Min temperature',
        units_primary: {
          display: true,
          value:
            forecastDate === 0
              ? data.current.feelslike_c
              : `${data.forecast.forecastday[forecastDate].day.maxtemp_c} / ${data.forecast.forecastday[forecastDate].day.mintemp_c}`,
          symbol: '°C',
        },
        units_secondary: {
          display: false,
          value:
            forecastDate === 0
              ? data.current.feelslike_f
              : `${data.forecast.forecastday[forecastDate].day.maxtemp_f} / ${data.forecast.forecastday[forecastDate].day.mintemp_f}`,
          symbol: 'F',
        },
      },
      {
        condition: forecastDate === 0 ? 'Wind speed' : 'Max wind speed',
        units_primary: {
          display: true,
          value:
            forecastDate === 0
              ? data.current.wind_kph
              : data.forecast.forecastday[forecastDate].day.maxwind_kph,
          symbol: 'km/h',
        },
        units_secondary: {
          display: false,
          value:
            forecastDate === 0
              ? data.current.wind_mph
              : data.forecast.forecastday[forecastDate].day.maxwind_mph,
          symbol: 'mph',
        },
      },
      {
        condition:
          forecastDate === 0 ? 'Precipitation' : 'Chance of rain / snow',

        units_primary: {
          display: true,
          value:
            forecastDate === 0
              ? data.current.precip_mm
              : `${data.forecast.forecastday[forecastDate].day.daily_chance_of_rain} / ${data.forecast.forecastday[forecastDate].day.daily_chance_of_snow}`,
          symbol: forecastDate === 0 ? 'mm' : '%',
        },
        units_secondary: {
          display: false,
          value:
            forecastDate === 0
              ? data.current.precip_in
              : `${data.forecast.forecastday[forecastDate].day.daily_chance_of_rain} / ${data.forecast.forecastday[forecastDate].day.daily_chance_of_snow}`,
          symbol: forecastDate === 0 ? 'in' : '%',
        },
      },
      {
        condition: forecastDate === 0 ? 'Humidity' : 'Average humidity',
        units_primary: {
          display: true,
          value:
            forecastDate === 0
              ? data.current.humidity
              : data.forecast.forecastday[forecastDate].day.avghumidity,
          symbol: '%',
        },
        units_secondary: {
          display: false,
          value:
            forecastDate === 0
              ? data.current.humidity
              : data.forecast.forecastday[forecastDate].day.avghumidity,
          symbol: '%',
        },
      },
    ])
  }

  useEffect(() => {
    if (searchQuery) {
      for (let i = 0; i < 1; i++) {
        handleCityAPI()
      }
    }
  }, [searchQuery])

  useEffect(() => {
    if (weatherData !== 'initial') {
      getWeatherConditions(weatherData, forecastDate)
    }
  }, [forecastDate, weatherData])

  async function handleWeatherAPI() {
    const apiKey = 'ae58c9330c1448dda6f194716240301'
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${selectedCity}&days=3`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()

      if (!selectedCity) {
        setWeatherData(null)
      } else {
        setWeatherData(data)
        getWeatherConditions(data, forecastDate)
      }
    } catch (error) {
      console.error(error)
      setWeatherData(null)
    }
  }

  async function handleCityAPI() {
    const apiUrl = `https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500@public/records?select=geoname_id%2C%20name%2C%20country&where=%22${searchQuery}%22&limit=20`

    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()

      setSuggestionsList(data.results)
      if (data.results.length === 0) {
        setSelectedCity(null)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="flex flex-col items-stretch justify-start md:h-[100%] md:w-[70vw] md:gap-3 gap-5 font-['Poppins'] md:mx-5 mx-1">
      <div className="flex md:flex-row items-stretch md:self-center justify-self-start mx-2 mt-4 md:mt-0 md:mx-0 flex-col md:gap-5 gap-2">
        <SearchBar
          query={searchQuery}
          setQuery={(value) => setSearchQuery(value)}
          suggestions={suggestionsList}
          refreshSuggestions={handleCityAPI}
          getWeatherData={handleWeatherAPI}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
        <SearchButton
          getWeatherData={handleWeatherAPI}
          setDisplayedCity={setDisplayedCity}
          selectedCity={selectedCity}
          showCityAPI={handleCityAPI}
          setForecastDate={setForecastDate}
          forecastDate={forecastDate}
        />
      </div>
      <div>
        <WeatherInfo
          cityName={displayedCity}
          weatherData={weatherData}
          weatherConditions={weatherConditions}
          setWeatherConditions={setWeatherConditions}
          getWeatherConditions={getWeatherConditions}
          setForecastDate={setForecastDate}
          forecastDate={forecastDate}
        />
      </div>
    </main>
  )
}

function WeatherInfo({
  cityName,
  weatherData,
  weatherConditions,
  setWeatherConditions,

  getWeatherConditions,
  forecastDate,
  setForecastDate,
}) {
  function formatDate(inputDate) {
    const parsedDate = new Date(`20${inputDate.replace(/-/g, '/')}`)
    const options = { weekday: 'long', day: 'numeric', month: 'numeric' }
    const formatter = new Intl.DateTimeFormat('en-US', options)
    const parts = formatter.formatToParts(parsedDate)
    const formattedDate = `${parts[0].value} ${parts[4].value}.${parts[2].value}.`
    return formattedDate
  }

  function getWeatherIcon(forecastDate) {
    let weatherCode =
      forecastDate === 0
        ? weatherData.current.condition.code
        : forecastDate === 1
          ? weatherData.forecast.forecastday[1].day.condition.code
          : weatherData.forecast.forecastday[2].day.condition.code

    const isDay = weatherData.current.is_day
    const icon = weatherIcons[isDay][weatherCode]
    return `./${icon}.svg`
  }

  function handleUnitsChange(clickedCondition) {
    setWeatherConditions((prevConditions) => {
      return prevConditions.map((item) => {
        if (
          item.condition === clickedCondition &&
          item.condition !== 'Humidity'
        ) {
          if (item.units_primary.display) {
            return {
              ...item,
              units_primary: {
                ...item.units_primary,
                display: false,
              },
              units_secondary: { ...item.units_secondary, display: true },
            }
          } else {
            return {
              ...item,
              units_primary: {
                ...item.units_primary,
                display: true,
              },
              units_secondary: { ...item.units_secondary, display: false },
            }
          }
        } else {
          return item
        }
      })
    })
  }

  function showProperForecastTime(forecastDate) {
    if (forecastDate === 0) {
      return <i>Today {weatherData.current.last_updated.slice(11)}</i>
    } else if (forecastDate === 1) {
      return <i>{formatDate(weatherData.forecast.forecastday[1].date)}</i>
    } else return <i>{formatDate(weatherData.forecast.forecastday[2].date)}</i>
  }

  return (
    <div className="flex flex-row justify-center items-center mb-10">
      {weatherData !== 'initial' ? (
        !weatherData ? (
          <div className="flex h-[70vh] flex-col items-center justify-evenly gap-4 text-center  bg-white rounded-lg shadow-lg border-4 p-5 md:h-[60vh] md:w-[50vw] w-full place-items-center">
            <h1 className="text-2xl font-bold col-start-1 col-end-2 row-start-1 row-end-2 text-center md:place-items-end">
              Searched city does not exist on this planet (yet).
            </h1>
            <h2 className="text-sm">
              Please chceck if you have entered correct city name and search
              again!
            </h2>
            <img
              className="row-start-1 row-end-3 col-span-1 w-auto h-[50%] bg-contain rounded-lg block m-[0 auto]"
              src={notfound}
              alt="city does not exist"
            ></img>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-stretch md:grid md:grid-cols-[repeat(2,_minmax(0,_1fr))] bg-white rounded-3xl shadow-xl border-4 border-[#FFAFCC] p-3 gap-0 relative w-full max-w-[700px]">
            <div className="flex gap-4 py-2 flex-row justify-around items-center md:flex-col md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-2 md:justify-center md:items-center">
              <div>{showProperForecastTime(forecastDate)}</div>
              <div className="md:text-4xl text-2xl font-bold ">
                {cityName.toUpperCase()}
              </div>
              <div className="md:text-xl text font-bold">
                {weatherData.current.condition.text}
              </div>
            </div>

            <div className="md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 md:place-self-center md:select-none w-full">
              <p className="text-center hidden md:block">
                Click on condition to change units
              </p>
              {weatherConditions.map((item) => {
                return (
                  <>
                    <div
                      key={item.condition}
                      className=" text-lg flex flex-row justify-between border-2 bg-[#77abff] rounded-lg md:p-2 md:m-3 p-3 m-1 cursor-pointer md:hover:bg-[#67a0f4] md:transition-all md:before:ease md:relative md:overflow-hidden  text-white shadow-2xl  md:before:absolute md:before:right-0 md:before:top-0 md:before:h-12 md:before:w-6 md:before:translate-x-12 md:before:rotate-6 md:before:bg-white md:before:opacity-10 md:before:duration-1000 md:hover:shadow-[#77abff] md:hover:before:-translate-x-[45rem]"
                      onClick={() => handleUnitsChange(item.condition)}
                    >
                      <div>{item.condition}:</div>
                      {item.units_primary.display ? (
                        <div>
                          {item.units_primary.value} {item.units_primary.symbol}
                        </div>
                      ) : (
                        <div>
                          {item.units_secondary.value}{' '}
                          {item.units_secondary.symbol}
                        </div>
                      )}
                    </div>
                  </>
                )
              })}
            </div>

            <div className="md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3 flex justify-center items-center">
              {weatherData && (
                <img
                  src={getWeatherIcon(forecastDate)}
                  className="md:w-full md:h-full hidden md:block"
                />
              )}
            </div>

            <div className="flex flex-row rounded-md shadow-xl md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4 place-self-center mt-2 md:mt-0">
              <button //today
                onClick={() => {
                  setForecastDate(0)

                  getWeatherConditions(weatherData, 0)
                }}
                type="button"
                className={`relative -ml-px inline-flex items-center  p-4 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 rounded-tl-md rounded-bl-md focus:z-10 ${
                  forecastDate === 0 && 'bg-pink-300 text-white'
                }`}
              >
                Today
              </button>
              <button //tomorrow
                onClick={() => {
                  setForecastDate(1)

                  getWeatherConditions(weatherData, 1)
                }}
                type="button"
                className={`relative -ml-px inline-flex items-center p-4 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300  focus:z-10 ${
                  forecastDate === 1 && 'bg-pink-300 text-white'
                }`}
              >
                {formatDate(weatherData.forecast.forecastday[1].date)}
              </button>
              <button //overtomorrow
                onClick={() => {
                  setForecastDate(2)

                  getWeatherConditions(weatherData, 2)
                }}
                type="button"
                className={`relative -ml-px inline-flex items-center  p-4 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 rounded-tr-md rounded-br-md focus:z-10 ${
                  forecastDate === 2 && 'bg-pink-300 text-white'
                }`}
              >
                {formatDate(weatherData.forecast.forecastday[2].date)}
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="flex h-[70vh] flex-col items-center justify-evenly gap-4 text-center  bg-white rounded-lg shadow-lg border-4 p-5 md:h-[60vh] md:w-[50vw] place-items-center">
          <h1 className="text-2xl font-bold col-start-1 col-end-2 row-start-1 row-end-2 text-center md:place-items-end">
            Welcome to my Weather Forecast application!
          </h1>
          <h2 className="text-sm w-full md:w-2/3 md:text-base">
            To check the current weather conditions for any location worldwide,
            simply enter the city name in the search bar above and click the
            large pink Search button next to it.
          </h2>
          <img
            className="row-start-1 row-end-3 col-span-1 w-auto h-[50%] bg-contain rounded-lg block m-[0 auto]"
            src={questionmark}
            alt="enter city name"
          ></img>
        </div>
      )}
    </div>
  )
}
