import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useEffect, useState } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

type User = {
  location: string
}

export default function Grafics() {
  const [locationData, setLocationData] = useState<{ [city: string]: number }>({})

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`)
        const users: User[] = await res.json()

        const counts: { [city: string]: number } = {}
        users.forEach((user) => {
          if (user.location) {
            const city = user.location.split(',')[0].trim() // agafa només la ciutat
            counts[city] = (counts[city] || 0) + 1
          }
        })

        setLocationData(counts)
      } catch (error) {
        console.error('Error carregant usuaris per gràfics:', error)
      }
    }

    fetchUsers()
  }, [])

  const labels = Object.keys(locationData)
  const values = Object.values(locationData)

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Nombre d’usuaris per ciutat',
        data: values,
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.3)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const barData = {
    labels,
    datasets: [
      {
        label: 'Usuaris per ciutat',
        data: values,
        backgroundColor: 'rgb(34, 197, 94)',
      },
    ],
  }

  return (
    <div className="pt-20 max-w-5xl mx-auto px-4 space-y-12">
      <div>
        <h2 className="text-xl font-semibold mb-4">📈 Gràfic de línia: Usuaris per ciutat</h2>
        <Line data={lineData} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">📊 Gràfic de barres: Usuaris per ciutat</h2>
        <Bar data={barData} />
      </div>
    </div>
  )
}
