import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'

// Fix icones Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

type Location = {
  _id?: string
  name: string
  lat: number
  lng: number
  category: string
}

type Suggestion = {
  display_name: string
  lat: string
  lon: string
}

const categoryColors: Record<string, string> = {
  restaurant: 'bg-red-500',
  museu: 'bg-blue-500',
  parking: 'bg-green-500',
  hotel: 'bg-yellow-500',
  ruta: 'bg-purple-500',
}

const getCustomIcon = (category: string) =>
  L.divIcon({
    className: '',
    html: `
      <div class="w-10 h-10 ${categoryColors[category] || 'bg-gray-400'} rounded-full flex items-center justify-center border-2 border-white shadow-md">
        <img src="/icons/${category}.png" class="w-5 h-5 object-contain" />
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })

const getIconForLocation = (loc: Location, index: number) => {
  if (loc.category === 'ruta') {
    return L.divIcon({
      className: '',
      html: `
        <div class="w-10 h-10 bg-purple-500 text-white text-sm font-bold rounded-full flex items-center justify-center border-2 border-white shadow-md">
          ${index + 1}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    })
  }

  return getCustomIcon(loc.category)
}

export default function Mapa() {
  const [locations, setLocations] = useState<Location[]>([])
  const [form, setForm] = useState<Location>({ name: '', lat: 0, lng: 0, category: 'restaurant' })
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [filters, setFilters] = useState<string[]>(['restaurant', 'museu', 'parking', 'hotel', 'ruta'])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    const res = await fetch('http://localhost:3000/api/locations')
    const data = await res.json()
    setLocations(data)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'lat' || name === 'lng' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      await fetch(`http://localhost:3000/api/locations/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setEditingId(null)
    } else {
      await fetch('http://localhost:3000/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }

    setForm({ name: '', lat: 0, lng: 0, category: 'restaurant' })
    fetchLocations()
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    await fetch(`http://localhost:3000/api/locations/${id}`, {
      method: 'DELETE',
    })
    fetchLocations()
  }

  const handleEdit = (loc: Location) => {
    setForm(loc)
    setEditingId(loc._id ?? null)
  }

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)

    if (value.length > 2) {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}&limit=5`)
      const data = await res.json()
      setSuggestions(data)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (place: Suggestion) => {
    setForm(prev => ({
      ...prev,
      name: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    }))
    setSearch('')
    setSuggestions([])
  }

  const toggleCategory = (cat: string) => {
    setFilters(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  return (
    <div className="pt-16 h-[calc(100vh-64px)] flex flex-col">

      {/* 🔍 Buscador */}
      <div className="relative z-10 w-full max-w-2xl mx-auto p-4 bg-white">
        <input
          type="text"
          placeholder="Cerca un lloc del món"
          value={search}
          onChange={handleSearchChange}
          className="border p-2 rounded w-full"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-14 left-0 w-full bg-white border rounded z-10 shadow max-h-60 overflow-y-auto">
            {suggestions.map((sug, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(sug)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {sug.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📝 Formulari */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow flex flex-wrap gap-4 items-center justify-center max-w-5xl mx-auto w-full">
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded w-[200px]"
          required
        />
        <input
          type="number"
          name="lat"
          placeholder="Latitud"
          value={form.lat}
          onChange={handleChange}
          className="border p-2 rounded w-[120px]"
          step="any"
          required
        />
        <input
          type="number"
          name="lng"
          placeholder="Longitud"
          value={form.lng}
          onChange={handleChange}
          className="border p-2 rounded w-[120px]"
          step="any"
          required
        />
        <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded w-[160px]">
          <option value="restaurant">Restaurant</option>
          <option value="museu">Museu</option>
          <option value="parking">Parking</option>
          <option value="hotel">Hotel</option>
          <option value="ruta">Ruta</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editingId ? 'Desar canvis' : 'Afegir'}
        </button>
      </form>

      {/* ✅ Filtres */}
      <div className="flex gap-4 justify-center mt-4 mb-2 bg-white p-2 shadow flex-wrap">
        {['restaurant', 'museu', 'parking', 'hotel', 'ruta'].map(cat => (
          <label key={cat} className="flex items-center gap-1">
            <input type="checkbox" checked={filters.includes(cat)} onChange={() => toggleCategory(cat)} />
            <span className="capitalize">{cat}</span>
          </label>
        ))}
      </div>

      {/* 🗺️ Mapa */}
      <div className="relative z-20 flex-grow mt-4 mb-8">
        <MapContainer center={[41.3874, 2.1699]} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations
            .filter(loc => filters.includes(loc.category))
            .map((loc) => {
              const rutaIndex = locations
                .filter(l => l.category === 'ruta')
                .findIndex(l => l._id === loc._id)

              return (
                <Marker
                  key={loc._id}
                  position={[loc.lat, loc.lng]}
                  icon={getIconForLocation(loc, rutaIndex)}
                >
                  <Popup>
                    <strong>{loc.name}</strong><br />
                    Categoria: {loc.category}
                    <div className="mt-2 flex flex-col gap-1">
                      <button onClick={() => handleEdit(loc)} className="bg-yellow-400 text-xs px-2 py-1 rounded hover:bg-yellow-500">Edita</button>
                      <button onClick={() => handleDelete(loc._id)} className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600">Esborra</button>
                    </div>
                  </Popup>
                </Marker>
              )
            })}

          {locations.filter(loc => loc.category === 'ruta').length > 1 && (
            <Polyline
              positions={locations
                .filter(loc => loc.category === 'ruta')
                .map(loc => [loc.lat, loc.lng])}
              pathOptions={{ color: 'purple' }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  )
}
