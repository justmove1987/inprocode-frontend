import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex gap-6">
        <li><Link to="/" className="hover:text-blue-300">Inici</Link></li>
        <li><Link to="/mapa" className="hover:text-blue-300">Mapa</Link></li>
        <li><Link to="/calendar" className="hover:text-blue-300">Calendari</Link></li>
        <li><Link to="/grafics" className="hover:text-blue-300">Gràfics</Link></li>
        <li><Link to="/users" className="hover:text-blue-300">Usuaris</Link></li>
      </ul>
    </nav>
  )
}
