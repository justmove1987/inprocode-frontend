import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Mapa from './pages/Mapa'
import Calendar from './pages/Calendar'
import Grafics from './pages/Grafics'
import Plugins from './pages/Plugins'
import Users from './pages/Users'

function App() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto mt-8 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/grafics" element={<Grafics />} />
          <Route path="/plugins" element={<Plugins />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </>
  )
}

export default App
