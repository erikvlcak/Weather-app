/* eslint-disable react/prop-types */
export default function SearchButton({
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
