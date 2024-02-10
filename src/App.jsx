/* eslint-disable react/prop-types */

import { useState } from 'react'

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
  const [searchedCity, setSearchedCity] = useState('What city are you looking for?')

function handleQueryChange(e) {
  setSearchQuery(e.target.value)
}

function handleCityChange() {
setSearchedCity(searchQuery)
}

  return (
    <main className='flex flex-col gap-10'>
      <SearchBar handleQueryChange = {handleQueryChange} handleCityChange = {handleCityChange} />
      <WeatherInfo cityName={searchedCity} />
    </main>
  )
}

function SearchBar({handleQueryChange, handleCityChange}) {
  return (
    <div>
      <input
        onChange={handleQueryChange}
        type="text"
        placeholder="Search for a city"
        className="w-1/2 h-12 rounded-lg p-4"
      />
      <button
        onClick={handleCityChange}
        className="bg-blue-500 text-white font-bold rounded-lg p-4"
      >
        Search
      </button>
    </div>
  )
}

function WeatherInfo({ cityName  }) {
  return (
    <main>
      <div className="w-1/2 h-1/2 bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-bold">{cityName}</h2>
        
      </div>
    </main>
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
      <Header bg={backgroundColor} />
      <Card />
      <Footer />
    </div>
  )
}
