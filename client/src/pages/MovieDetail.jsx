import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

function Reactions({ movieId, stats, setStats }) {
  const { token } = useAuth()
  const send = async (type) => {
    if (!token) return alert('Потрібен вхід')
    const { data } = await api.post(`/reactions/movie/${movieId}`, { type })
    setStats(data.stats)
  }
  return (
    <div className="actions">
      <button onClick={() => send('LIKE')}>👍 {stats.likes}</button>
      <button onClick={() => send('DISLIKE')}>👎 {stats.dislikes}</button>
    </div>
  )
}

function Comments({ movieId }) {
  const { token, user } = useAuth()
  const [items, setItems] = useState([])
  const [content, setContent] = useState('')
  const [editing, setEditing] = useState(null)

  const load = async () => {
    const { data } = await api.get(`/comments/movie/${movieId}`)
    setItems(data)
  }
  useEffect(() => { load() }, [movieId])

  const add = async () => {
    if (!token) return alert('Потрібен вхід')
    if (!content.trim()) return
    await api.post(`/comments/movie/${movieId}`, { content })
    setContent(''); await load()
  }

  const update = async (id) => {
    await api.put(`/comments/${id}`, { content: editing.content })
    setEditing(null); await load()
  }

  const del = async (id) => {
    await api.delete(`/comments/${id}`); await load()
  }

  return (
    <div>
      <h3>Коментарі</h3>
      <div className="form">
        <textarea className="input" rows="3" value={content} onChange={e => setContent(e.target.value)} placeholder="Ваш коментар..." />
        <button onClick={add}>Надіслати</button>
      </div>
      <div style={{marginTop:12, display:'grid', gap:8}}>
        {items.map(c => (
          <div key={c.id} className="comment">
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <strong>@{c.user.username}</strong>
              <small>{new Date(c.createdAt).toLocaleString()}</small>
            </div>
            {editing?.id === c.id ? (
              <div>
                <textarea className="input" rows="2" value={editing.content} onChange={e => setEditing(v=>({...v, content: e.target.value}))} />
                <div className="actions">
                  <button onClick={() => update(c.id)}>Зберегти</button>
                  <button onClick={() => setEditing(null)}>Скасувати</button>
                </div>
              </div>
            ) : (
              <p>{c.content}</p>
            )}
            {user && user.id === c.user.id && editing?.id !== c.id && (
              <div className="actions">
                <button onClick={() => setEditing({ id: c.id, content: c.content })}>Редагувати</button>
                <button onClick={() => del(c.id)}>Видалити</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MovieDetail() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [stats, setStats] = useState({ likes: 0, dislikes: 0, comments: 0 })

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/movies/${id}`)
      setMovie(data)
      setStats(data.stats)
    }
    load()
  }, [id])

  if (!movie) return <p>Завантаження...</p>
  return (
    <div className="card">
      <img className="poster" src={movie.poster || ''} alt={movie.title} />
      <div style={{flex:1}}>
        <h2>{movie.title}</h2>
        <p style={{opacity:.8}}>{movie.description}</p>
        <Reactions movieId={movie.id} stats={stats} setStats={setStats} />
        <div className="stat" style={{marginTop:8}}>💬 {stats.comments}</div>
        <Comments movieId={movie.id} />
      </div>
    </div>
  )
}
