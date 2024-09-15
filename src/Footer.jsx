import githublogo from '../src/assets/githublogo.png'

export default function Footer() {
  return (
    <header
      className={`w-full h-8 flex justify-center items-center text-gray-500 text-sm`}
    >
      <div className="flex flex-row gap-1 items-center">
        Made by
        <a href="https://github.com/erikvlcak">
          <img src={githublogo} alt="github logo" className="h-5 w-5" />
        </a>
        <a href="https://github.com/erikvlcak"> Erik Vlcak 2024</a>
      </div>
    </header>
  )
}
