import Header from './Header.jsx'
import Card from './Card.jsx'
import Footer from './Footer.jsx'

export default function App() {
  return (
    <div className="flex flex-col h-[100%] justify-between items-center bg-[#BDE0FE]">
      <Header />
      <Card />
      <Footer />
    </div>
  )
}
