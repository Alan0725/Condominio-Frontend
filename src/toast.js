import { ref } from 'vue'

export const toasts = ref([])

let nextId = 1

export function pushToast(message, type = 'info') {
  const id = nextId++
  toasts.value.push({ id, message, type })
  setTimeout(() => removeToast(id), 3500)
}

export function removeToast(id) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}
