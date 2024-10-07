/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react'
import { Combobox } from '@headlessui/react'
import questionmark from '../src/assets/questionmark.jpg'
import weatherIcons from './weathericons.js'
import notfound from '../src/assets/notfound.jpg'

export default function Card() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestionsList, setSuggestionsList] = useState([])
  const [weatherData, setWeatherData] = useState('initial')
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
    <main className="flex flex-col items-center justify-center md:h-[100%] md:gap-10 gap-10 font-['Poppins'] md:ml-5 md:mr-5">
      <div className="flex md:flex-row items-center md:self-center justify-self-start ml-5 mr-5 flex-col gap-4">
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
      <div className="self-center justify-self-center">
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

function SearchBar({
  query,
  setQuery,
  suggestions,
  refreshSuggestions,
  selectedCity,
  setSelectedCity,
}) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const filteredCities =
    query === ''
      ? suggestions
      : suggestions.filter((city) => {
          return city.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <div className>
      <Combobox
        as="div"
        value={query.length > 0 ? selectedCity : ''}
        onChange={setSelectedCity}
        className="mr-2 md:mr-10"
      >
        <div className="">
          <Combobox.Input
            placeholder="What's the weather like in..."
            className="w-[100%] md:w-[50wv] placeholder-white rounded-xl border-0 text-3xl bg-white py-3 pl-3 text-black font-bold shadow-sm ring-4 ring-inset ring-[#FFAFCC] focus:ring-4 focus:ring-inset focus:ring-white"
            onChange={(event) => {
              setQuery(event.target.value)
              refreshSuggestions()
            }}
            displayValue={(selectedCity) => selectedCity}
            onBlur={() => refreshSuggestions()}
          />

          {filteredCities.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-[90%] md:w-[596px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredCities.map((city) => (
                <Combobox.Option
                  key={city.geoname_id}
                  value={city.name}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-8 pr-4',
                      active ? 'bg-[#FFAFCC] text-white' : 'text-gray-900'
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={classNames(
                          'block truncate',
                          selected && 'font-semibold'
                        )}
                      >
                        {`${city.name}, ${city.country}`}
                      </span>

                      {selected && (
                        <span
                          className={classNames(
                            'absolute inset-y-0 left-0 flex items-center pl-1.5',
                            active ? 'text-white' : 'text-[#A2D2FF]'
                          )}
                        ></span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  )
}

function SearchButton({
  getWeatherData,
  setDisplayedCity,
  selectedCity,
  showCityAPI,
  setForecastDate,
}) {
  return (
    <button
      onClick={() => {
        getWeatherData()
        if (selectedCity) {
          setDisplayedCity(selectedCity)
        } else {
          setDisplayedCity('')
        }
        showCityAPI()
        setForecastDate(0)
      }}
      type="button"
      className="rounded-xl w-[100%] md:w-[50%] bg-[#FFAFCC] border-4 border-[#FFAFCC] text-white hover:bg-[#FFC8DD] text-3xl font-bold px-3.5 py-3 shadow-lg hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
    >
      Search
    </button>
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
    <div className="flex items-center justify-center w-[100%]">
      {weatherData !== 'initial' ? (
        !weatherData ? (
          <div className="flex flex-col items-center justify-evenly gap-4 text-center  bg-white rounded-lg shadow-lg border-4 p-5 max-w-[80vw] h-[20%] md:h-[50vh] md:w-[50vw] place-items-center">
            <h1 className="text-2xl font-bold col-start-1 col-end-2 row-start-1 row-end-2 text-center md:place-items-end">
              Searched city does not exist on this planet (yet).
            </h1>
            <h2 className="text-sm">
              Please chceck the city name and search again!
            </h2>
            <img
              className="row-start-1 row-end-3 col-span-1 w-[70%] h-[70%] object-contain rounded-lg block m-[0 auto]"
              src={notfound}
              alt="city does not exist"
            ></img>
          </div>
        ) : (
          <div className="flex flex-col justify-center md:grid md:grid-cols-[repeat(2,_minmax(0,_1fr))] bg-white rounded-3xl shadow-xl border-4 border-[#FFAFCC] p-5 gap-0 relative md:h-[750px] min-w-[80wv] md:w-[750px]">
            <div className="flex flex-col md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-2 justify-center items-center">
              <div>{showProperForecastTime(forecastDate)}</div>
              <div className="md:text-3xl text-base font-bold ">
                {cityName.toUpperCase()}
              </div>
              <div className="md:text-xl text font-bold">
                {weatherData.current.condition.text}
              </div>
            </div>
            <div className="md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 md:place-self-center md:select-none w-full">
              {weatherConditions.map((item) => {
                return (
                  <div
                    key={item.condition}
                    className="flex flex-row justify-between border-2 bg-[#A2D2FF] rounded-lg md:p-3 md:m-3 p-3 m-1 cursor-pointer hover:bg-[#BDE0FE] transition-all"
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
                  forecastDate === 0 && 'bg-pink-300'
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
                  forecastDate === 1 && 'bg-pink-300'
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
                  forecastDate === 2 && 'bg-pink-300'
                }`}
              >
                {formatDate(weatherData.forecast.forecastday[2].date)}
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-evenly gap-4 text-center  bg-white rounded-lg shadow-lg border-4 p-5 max-w-[80vw] h-[20%] md:h-[50vh] md:w-[50vw] place-items-center">
          <h1 className="text-2xl font-bold col-start-1 col-end-2 row-start-1 row-end-2 text-center md:place-items-end">
            I don&apos;t know where to look...
          </h1>
          <h2 className="text-sm">Choose a city to see the weather forecast</h2>
          <img
            className="row-start-1 row-end-3 col-span-1 w-[70%] h-[70%] object-contain rounded-lg block m-[0 auto]"
            src={questionmark}
            alt="enter city name"
          ></img>
        </div>
      )}
    </div>
  )
}
