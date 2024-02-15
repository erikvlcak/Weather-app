/* eslint-disable react/prop-types */

import { useState, Fragment } from 'react'
import Autosuggest from 'react-autosuggest'
import {Popover, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
} from '@heroicons/react/20/solid'


function Header(props) {
  return (
    <header
      className={`w-full h-16 flex justify-center items-center ${props.bg} text-white font-bold text-xl`}
    >
      <h1>WEATHER AROUND THE GLOBE</h1>
    </header>
  )
}

function Card() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestionsList, setSuggestionsList] = useState([])
  const [searchedCity, setSearchedCity] = useState(
    'What city are you looking for?'
  )
  const [weatherData, setWeatherData] = useState(null)

  function handleQueryChange(e) {
    setSearchQuery(e.target.value)
  }

  async function handleWeatherAPI() {
    setSearchedCity(searchQuery)
    const apiKey = 'ae58c9330c1448dda6f194716240301'
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchQuery}&days=3`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setWeatherData(data)
      })
  }

  async function handleCityAPI() {
  let cityName = searchQuery // city name from input
  fetch(`https://api.api-ninjas.com/v1/city?name=${cityName}&limit=30`, {
    method: 'GET',
    headers: {
      'X-Api-Key': 'oemfcIRT5PpPRlc1wOAMww==VvylUhM8Rl1Wz2WR',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setSuggestionsList(data)
    })
    .catch((error) => {
      console.error('Error: ', error)
    })

  }
  return (
    <main className="flex flex-col gap-10 items-center justify-around mt-20 mb-20">
      <SearchBar handleQueryChange={handleQueryChange} getWeatherData={handleWeatherAPI} getCitySuggestions = {handleCityAPI} />
      <WeatherInfo cityName={searchedCity} weatherData={weatherData} />
    </main>
  )}





 const fruits = [
   {
     text: 'Apple',
   },
   {
     text: 'Apricot',
   },
   {
     text: 'Avocado',
   },
   {
     text: 'Açaí',
   },
   {
     text: 'Akee',
   },
   {
     text: 'Alfalfa',
   },
 ]
  

function Example() {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length

  return inputLength === 0
    ? []
    : fruits.filter(
        (lang) => lang.text.toLowerCase().slice(0, inputLength) === inputValue
      )
}

const getSuggestionValue = (suggestion) => suggestion.text

const renderSuggestion = (suggestion) => <div>{suggestion.text}</div>

  const onChange = (event, { newValue }) => {
    setValue(newValue)
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value))
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const inputProps = {
    placeholder: 'Name a fruit',
    value,
    onChange: onChange,
  }

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  )
}

function SearchBar({ handleQueryChange, getWeatherData, getCitySuggestions }) {

  return (
    <div>
      <label htmlFor="search-city" className="sr-only">
        Search city
      </label>
      <input
        onChange={handleQueryChange}
        id="search-city"
        name="search-city"
        type="search"
        autoComplete="city"
        required
        className="min-w-0 mr-8 flex-auto rounded-md border-0 px-3.5 py-2 text font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Enter city name"
      />

      <button
        onClick={() => {
        getWeatherData();
        getCitySuggestions(); // get city suggestions - only for testing purposes
        }

        }
        type="button"
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Search city
      </button>
    </div>
  )
}



function WeatherInfo({ cityName, weatherData }) {
  const [tabs, setTabs] = useState([
    {
      name: 'Today',
      current: true,
    },
    {
      name: 'Tomorrow',
      current: false,
    },
    {
      name: 'Overmorrow',
      current: false,
    },
  ])

  function formatDate(inputDate) {
    const parsedDate = new Date(`20${inputDate.replace(/-/g, '/')}`)
    const options = { weekday: 'long', day: 'numeric', month: 'numeric' }
    const formatter = new Intl.DateTimeFormat('en-US', options)
    const parts = formatter.formatToParts(parsedDate)
    const formattedDate = `${parts[0].value} ${parts[4].value}.${parts[2].value}.`
    return formattedDate
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  function handleTabChange(index) {
    setTabs((prevTabs) => {
      return prevTabs.map((tab, i) => {
        if (i === index) {
          return { ...tab, current: true }
        } else {
          return { ...tab, current: false }
        }
      })
    })
  }

  return (
    <div>
      {weatherData ? (
        <div>
          <div className=" bg-white rounded-lg shadow-lg border-4 p-10 w-[100%]">
            <h2 className="text-2xl font-bold">{cityName}</h2>
            <h2>
              {weatherData && `Temperature is ${weatherData.current.temp_c}°C`}
            </h2>
            <h2>{weatherData && `${weatherData.current.condition.text}`}</h2>
          </div>

          <Popover className="relative">
            <Popover.Button className="rounded-md w-full bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Display forecast
              <ChevronDownIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-96 rounded-3xl bg-white p-4 shadow-lg ring-1 ring-gray-900/5">
                <div>
                  <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                      Select a tab
                    </label>
                    <select
                      id="tabs"
                      name="tabs"
                      className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      defaultValue={tabs.find((tab) => tab.current).name}
                    >
                      {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden sm:block">
                    <nav
                      className="isolate flex divide-x divide-gray-200 rounded-lg shadow cursor-pointer"
                      aria-label="Tabs"
                    >
                      {tabs.map(
                        (tab, tabIdx) => (
                          (tab.name = formatDate(
                            weatherData.forecast.forecastday[tabIdx].date
                          )),
                          (
                            <a
                              key={tab.name}
                              href={tab.href}
                              onClick={(e) => {
                                e.preventDefault()
                                handleTabChange(tabIdx)
                              }}
                              className={classNames(
                                tab.current
                                  ? 'text-gray-900'
                                  : 'text-gray-500 hover:text-gray-700',
                                tabIdx === 0 ? 'rounded-l-lg' : '',
                                tabIdx === tabs.length - 1
                                  ? 'rounded-r-lg'
                                  : '',
                                'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10'
                              )}
                              aria-current={tab.current ? 'page' : undefined}
                            >
                              <span>{tab.name}</span>
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  tab.current
                                    ? 'bg-indigo-500'
                                    : 'bg-transparent',
                                  'absolute inset-x-0 bottom-0 h-0.5'
                                )}
                              />
                            </a>
                          )
                        )
                      )}
                    </nav>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

function Footer() {
  return (
    <header
      className={`w-full h-8 flex justify-center items-center text-gray-500 text-sm`}
    >
      <h1>WEATHER AROUND THE GLOBE</h1>
      <div className="h-0.5 w-20 bg-gray-500"></div>
    </header>
  )
}

export default function App() {
  const [backgroundColor, setBackgroundColor] = useState('bg-gray-500')

  return (
    <div className="flex flex-col items-center justify-between">
      <Example/>
      <Header bg={backgroundColor} />
      <Card />
      <Footer />
    </div>
  )
}
