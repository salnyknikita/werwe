import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const nav = useNavigate()
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    await register(email, username, password)
    nav('/')
  }
  return (
    <form className="form" onSubmit={submit}>
      <h2>Реєстрація</h2>
      <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input className="input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
      <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Пароль" />
      <button type="submit">Створити акаунт</button>
    </form>
  )
}
