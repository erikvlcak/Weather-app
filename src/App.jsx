import Header from './Header.jsx'
import Card from './Card.jsx'
import Footer from './Footer.jsx'
import { useState } from 'react'

export default function App() {
  const [weatherData, setWeatherData] = useState('initial')
  return (
    <div className="flex flex-col h-full justify-between gap-2 items-center bg-[#BDE0FE]">
      <Header />
      <Card weatherData={weatherData} setWeatherData={setWeatherData} />
      <Footer weatherData={weatherData} />
    </div>
  )
}
