import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'

// Icones per Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// Tipus
interface Location {
  _id?: string
  name: string
  lat: number
  lng: number
  category?: string
}

export default function Mapa() {
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/locations`)
      const data = await res.json()
      setLocations(data)
    } catch (err) {
      console.error('❌ Error carregant ubicacions:', err)
    }
  }

  const getIconForLocation = (loc: Location, index: number) => {
    if (!loc.category) {
      return L.divIcon({
        className: '',
        html: `
          <div class="w-10 h-10 bg-black text-white text-xs rounded-full flex items-center justify-center border-2 border-white shadow-md">
            👤
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      })
    }

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

    return L.divIcon({
      className: '',
      html: `
        <div class="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
          <span class="text-white text-sm">🏷️</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    })
  }

  return (
    <div className="h-screen">
      <MapContainer center={[41.3874, 2.1699]} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc, i) => (
          <Marker
            key={loc._id}
            position={[loc.lat, loc.lng]}
            icon={getIconForLocation(loc, i)}
          >
            <Popup>
              <strong>{loc.name}</strong><br />
              {loc.category ? `Categoria: ${loc.category}` : 'Usuari'}
            </Popup>
          </Marker>
        ))}

        {/* 🔁 Dibuixa línia si hi ha ruta */}
        {locations.filter(l => l.category === 'ruta').length > 1 && (
          <Polyline
            positions={locations
              .filter(l => l.category === 'ruta')
              .map(l => [l.lat, l.lng])}
            pathOptions={{ color: 'purple' }}
          />
        )}
      </MapContainer>
    </div>
  )
}
