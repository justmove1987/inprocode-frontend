ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

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
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Grafics() {
  const labels = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny']

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Vendes mensuals',
        data: [10, 20, 15, 30, 25, 35],
        borderColor: 'rgb(37, 99, 235)', // blue-600
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
        label: 'Ingressos mensuals (€)',
        data: [500, 800, 600, 1200, 900, 1100],
        backgroundColor: 'rgb(34, 197, 94)', // green-500
      },
    ],
  }

  return (
    <div className="pt-20 max-w-5xl mx-auto px-4 space-y-12">
      <div>
        <h2 className="text-xl font-semibold mb-4">📈 Gràfic de línia: Vendes mensuals</h2>
        <Line data={lineData} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">📊 Gràfic de barres: Ingressos mensuals</h2>
        <Bar data={barData} />
      </div>
    </div>
  )
}

