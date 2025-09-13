import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [emailOrUsername, setE] = useState('demo@example.com')
  const [password, setP] = useState('password')

  const submit = async (e) => {
    e.preventDefault()
    await login(emailOrUsername, password)
    nav('/')
  }
  return (
    <form className="form" onSubmit={submit}>
      <h2>Вхід</h2>
      <input className="input" value={emailOrUsername} onChange={e=>setE(e.target.value)} placeholder="Email або username" />
      <input className="input" type="password" value={password} onChange={e=>setP(e.target.value)} placeholder="Пароль" />
      <button type="submit">Увійти</button>
    </form>
  )
}
