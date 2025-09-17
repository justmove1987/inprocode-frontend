// src/pages/Calendar.tsx
import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, DateSelectArg } from '@fullcalendar/core'
import { v4 as uuidv4 } from 'uuid'

const COLORS = [
  '#f87171', '#facc15', '#4ade80', '#38bdf8',
  '#a78bfa', '#f472b6', '#fb923c', '#94a3b8'
]

type Event = {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  userId?: string
  user?: { first: string; last: string } // si el backend fa populate
}

type User = {
  _id: string
  first: string
  last: string
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    color: COLORS[0],
    startTime: '10:00',
    endTime: '11:00',
    userId: ''
  })
  const [selectInfo, setSelectInfo] = useState<DateSelectArg | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`)
        const data = await res.json()
        setEvents(data)
      } catch (error) {
        console.error('Error carregant esdeveniments:', error)
      }
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`)
        const data = await res.json()
        setUsers(data)
      } catch (error) {
        console.error('Error carregant usuaris:', error)
      }
    }

    fetchEvents()
    fetchUsers()
  }, [])

  const handleDateSelect = (info: DateSelectArg) => {
    setSelectInfo(info)
    setModalOpen(true)
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Vols eliminar l'esdeveniment "${clickInfo.event.title}"?`)) {
      setEvents((prev) => prev.filter((event) => event.id !== clickInfo.event.id))
      // TODO: Cridar DELETE al backend si vols persistència real
    }
  }

  const handleSubmit = async () => {
    if (selectInfo && newEvent.title) {
      const date = selectInfo.startStr.split('T')[0]
      const start = `${date}T${newEvent.startTime}`
      const end = `${date}T${newEvent.endTime}`

      const newEvt = {
        id: uuidv4(),
        title: newEvent.title,
        start,
        end,
        backgroundColor: newEvent.color,
        userId: newEvent.userId || undefined,
      }

      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvt),
        })

        setEvents((prev) => [...prev, newEvt])
        setNewEvent({ title: '', color: COLORS[0], startTime: '10:00', endTime: '11:00', userId: '' })
        setModalOpen(false)
        selectInfo.view.calendar.unselect()
      } catch (error) {
        console.error('Error enviant esdeveniment al backend:', error)
      }
    }
  }

  return (
    <div className="pt-16 p-4 relative">
      <h2 className="text-2xl font-semibold mb-4">📅 Calendari d'esdeveniments</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        selectable={true}
        selectMirror={true}
        events={events.map(e => ({
          ...e,
          title: users.length && e.userId
            ? `${e.title} (${users.find(u => u._id === e.userId)?.first || ''})`
            : e.title
        }))}
        select={handleDateSelect}
        eventClick={handleEventClick}
        editable={true}
        height="auto"
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Nou esdeveniment</h3>
            <input
              type="text"
              placeholder="Títol"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            />

            <div className="flex gap-4 mb-4">
              <div className="flex flex-col w-1/2">
                <label className="mb-1 text-sm">Hora inici:</label>
                <input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label className="mb-1 text-sm">Hora final:</label>
                <input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  className="border p-2 rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm">Assigna un usuari:</label>
              <select
                value={newEvent.userId}
                onChange={(e) => setNewEvent({ ...newEvent, userId: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="">-- Cap usuari --</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.first} {user.last}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <p className="mb-2">Color:</p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <div
                    key={color}
                    onClick={() => setNewEvent({ ...newEvent, color })}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      newEvent.color === color ? 'border-black' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel·lar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Afegir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
