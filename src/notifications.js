import { ref } from 'vue'
import api from './api'

export const notifications = ref([])
export const unreadCount = ref(0)

export async function loadNotifications() {
  const { data } = await api.get('/notifications')
  notifications.value = data
  unreadCount.value = data.filter((n) => !n.read_at).length
}

export function addNotification(payload) {
  notifications.value.unshift(payload)
  unreadCount.value++
}

export async function markAsRead(notification) {
  if (notification.read_at) return

  notification.read_at = new Date().toISOString()
  unreadCount.value = Math.max(0, unreadCount.value - 1)

  await api.post(`/notifications/${notification.id}/read`)
}

export function resetNotifications() {
  notifications.value = []
  unreadCount.value = 0
}
