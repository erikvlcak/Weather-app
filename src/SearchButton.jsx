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
      //className="rounded-xl bg-[#FFAFCC] border-4 border-[#FFAFCC] text-white hover:bg-[#FFC8DD] text-2xl font-bold px-10 py-3 shadow-lg hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
      className="select-none h-full w-full rounded-xl border-4 text-2xl px-10 py-2 font-bold relative flex items-center justify-center overflow-hidden bg-[#e16d99] text-white shadow-2xl md:transition-all before:absolute before:h-0 before:w-0 md:before:rounded-full before:bg-[#d25a88] md:before:duration-500 md:before:ease-out md:hover:shadow-[#FFAFCC] md:before:h-56 md:hover:before:w-56"
    >
      <span className="relative z-10">Search</span>
    </button>
  )
}
