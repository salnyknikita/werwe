import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client.js'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  const login = async (emailOrUsername, password) => {
    const { data } = await api.post('/auth/login', { emailOrUsername, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const register = async (email, username, password) => {
    await api.post('/auth/register', { email, username, password })
    return login(email, password)
  }

  const logout = () => { setToken(null); setUser(null); localStorage.removeItem('user') }

  return (
    <AuthCtx.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}
