import axios from 'axios'
import { setUser } from './session'
import { pushToast } from './toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// The backend's session-active middleware revokes tokens that have been
// idle too long (or otherwise invalid). When that happens mid-session, log
// the user out locally too instead of leaving them stuck on a broken screen.
// Several requests (chat, notifications, etc.) can all fail at once when a
// token dies, so a flag keeps that from firing the toast/redirect repeatedly.
let handlingExpiredSession = false

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token') && !handlingExpiredSession) {
      handlingExpiredSession = true
      pushToast(
        error.response?.data?.message || 'Tu sesión ha expirado. Inicia sesión de nuevo.',
        'error',
      )
      setUser(null)
      window.location.href = '/'
    }

    return Promise.reject(error)
  },
)

export default api
