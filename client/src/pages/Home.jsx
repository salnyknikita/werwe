import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  const load = async () => {
    const { data } = await api.get('/movies')
    setMovies(data); setLoading(false)
  }

  const refresh = async () => {
    await api.post('/movies/refresh') // requires auth
    await load()
  }

  useEffect(() => { load() }, [])

  if (loading) return <p>Завантаження...</p>
  return (
    <div>
      <div className="actions" style={{marginBottom:12}}>
        <h2 style={{margin:'0 8px 0 0'}}>Популярні фільми</h2>
        {token && <button onClick={refresh}>Оновити з TMDb</button>}
      </div>
      <div className="grid">
        {movies.map(m => (
          <Link to={`/movie/${m.id}`} key={m.id} className="card">
            <img className="poster" src={m.poster || ''} alt={m.title} />
            <div>
              <h3 style={{margin:'6px 0'}}>{m.title}</h3>
              <div className="stat">👍 {m.stats.likes} • 👎 {m.stats.dislikes} • 💬 {m.stats.comments}</div>
              <p style={{opacity:.8}}>{m.description?.slice(0,120)}{m.description && m.description.length>120 ? '…' : ''}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
