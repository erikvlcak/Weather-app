/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useState, Fragment, useEffect } from 'react'
import { Popover, Transition, Combobox } from '@headlessui/react'
import {
  CheckIcon,
  ChevronUpDownIcon,
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
  const [weatherData, setWeatherData] = useState(null)
  const [selectedCity, setSelectedCity] = useState('')
  const [displayedCity, setDisplayedCity] = useState('')

  //  useEffect(() => {
  //    if (selectedCity) {
  //     for(let i = 0; i < 1; i++) {
  //      handleWeatherAPI()
  //    }}
  //  }, [selectedCity])

  useEffect(() => {
    if (searchQuery) {
      for (let i = 0; i < 1; i++) {
        handleCityAPI()
      }
    }
  }, [searchQuery])

  async function handleWeatherAPI() {
    const apiKey = 'ae58c9330c1448dda6f194716240301'
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${selectedCity}&days=3`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setWeatherData(data)
      })
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
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="flex flex-row gap-10 w-[50%] mt-20 mb-20">
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
      />
      <WeatherInfo cityName={displayedCity} weatherData={weatherData} />
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
    <div className="flex flex-col gap-10">
      <Combobox
        as="div"
        value={query.length > 0 ? selectedCity : ''}
        onChange={setSelectedCity}
      >
        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
          What&apos;s the weather like in...
        </Combobox.Label>
        <div className="relative mt-2">
          <Combobox.Input
            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(event) => {
              setQuery(event.target.value)
              refreshSuggestions()
            }}
            displayValue={(selectedCity) => selectedCity}
            onBlur={() => refreshSuggestions()}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredCities.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredCities.map((city) => (
                <Combobox.Option
                  key={city.geoname_id}
                  value={city.name}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-8 pr-4',
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
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
                            active ? 'text-white' : 'text-indigo-600'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
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
}) {
  return (
    <button
      onClick={() => {
        getWeatherData()
        setDisplayedCity(selectedCity)
        showCityAPI()
      }}
      type="button"
      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Search city
    </button>
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
        <div>No city found</div>
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
  const backgroundColor = 'bg-gray-500'

  return (
    <div className="flex flex-col h-[100vh] w-[100vw] items-center justify-between">
      <Header bg={backgroundColor} />
      <Card />
      <Footer />
    </div>
  )
}
