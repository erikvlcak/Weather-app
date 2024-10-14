/* eslint-disable react/prop-types */
import { Combobox } from '@headlessui/react'
export default function SearchBar({
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
    <div className="w-full">
      <Combobox
        as="div"
        value={selectedCity}
        onChange={(value) => {
          const selectedCityData = suggestions.find(
            (city) => city.geoname_id === value
          )
          setSelectedCity(
            selectedCityData
              ? `${selectedCityData.name}, ${selectedCityData.country}`
              : ''
          )
        }}
      >
        <Combobox.Input
          placeholder="Enter city name..."
          className="w-full md:w-[50vw] h-full placeholder-grey rounded-xl border-0 text-2xl bg-pink-50 py-3 pl-3 text-black font-bold shadow-sm ring-4 ring-inset ring-[#FFAFCC] focus:ring-4 focus:ring-inset focus:ring-white"
          onChange={(event) => {
            setQuery(event.target.value)
            refreshSuggestions()
          }}
          displayValue={(selectedCity) => {
            const selectedCityData = suggestions.find(
              (city) => city.name === selectedCity
            )
            return selectedCityData
              ? `${selectedCityData.name}, ${selectedCityData.country}`
              : selectedCity
          }}
          onBlur={() => refreshSuggestions()}
        />

        {filteredCities.length > 0 && (
          <Combobox.Options className="absolute z-20 mt-1 max-h-64 w-[96%] md:w-[50vw] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredCities.map((city) => (
              <Combobox.Option
                key={city.geoname_id}
                value={city.geoname_id}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-3 px-4 text-xl',
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
      </Combobox>
    </div>
  )
}
