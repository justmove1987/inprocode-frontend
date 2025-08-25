import { useEffect, useState } from 'react'

type Plugin = {
  _id: string
  name: string
  description?: string
  version?: string
  active?: boolean
}

export default function Plugins() {
  const [plugins, setPlugins] = useState<Plugin[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/plugins')
      .then((res) => res.json())
      .then((data) => setPlugins(data))
      .catch((err) => console.error('Error carregant plugins:', err))
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Llista de Plugins</h2>
      {plugins.length === 0 ? (
        <p>No hi ha plugins.</p>
      ) : (
        <ul className="space-y-2">
          {plugins.map((plugin) => (
            <li key={plugin._id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{plugin.name}</h3>
              <p>{plugin.description}</p>
              <p className="text-sm text-gray-500">Versió: {plugin.version}</p>
              <p className="text-sm">{plugin.active ? 'Actiu ✅' : 'Inactiu ❌'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
