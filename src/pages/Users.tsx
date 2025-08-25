import { useEffect, useState } from 'react'

type User = {
  _id?: string
  first: string
  last: string
  email: string
  phone: string
  location: string
  hobby: string
}

const defaultUser: User = {
  first: '',
  last: '',
  email: '',
  phone: '',
  location: '',
  hobby: '',
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState<User>(defaultUser)
  const [editingId, setEditingId] = useState<string | null>(null)

  const API = 'http://localhost:3000/api/users'

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const res = await fetch(API)
    const data = await res.json()
    setUsers(data)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `${API}/${editingId}` : API

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setForm(defaultUser)
    setEditingId(null)
    fetchUsers()
  }

  const handleEdit = (user: User) => {
    setForm(user)
    setEditingId(user._id || null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Segur que vols eliminar aquest usuari?')) {
      await fetch(`${API}/${id}`, { method: 'DELETE' })
      fetchUsers()
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">CRUD d'Usuaris</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        {['first', 'last', 'email', 'phone', 'location', 'hobby'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={form[field as keyof User]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="p-2 border rounded"
            required
          />
        ))}
        <button
          type="submit"
          className="col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {editingId ? 'Actualitzar' : 'Afegir usuari'}
        </button>
      </form>

      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Nom</th>
            <th className="p-2">Cognom</th>
            <th className="p-2">Email</th>
            <th className="p-2">Telèfon</th>
            <th className="p-2">Ubicació</th>
            <th className="p-2">Hobby</th>
            <th className="p-2">Accions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.first}</td>
              <td className="p-2">{u.last}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.phone}</td>
              <td className="p-2">{u.location}</td>
              <td className="p-2">{u.hobby}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u._id!)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
