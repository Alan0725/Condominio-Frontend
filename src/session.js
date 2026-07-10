import { ref } from 'vue'

export const user = ref(JSON.parse(localStorage.getItem('user') ?? 'null'))

export function setUser(value) {
  user.value = value

  if (value) {
    localStorage.setItem('user', JSON.stringify(value))
  } else {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}
