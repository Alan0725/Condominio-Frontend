<script setup>
import { inject, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { user } from '../session'
import { notifications, unreadCount, loadNotifications, addNotification, markAsRead } from '../notifications'

const router = useRouter()
const echo = inject('echo')

const open = ref(false)
const justArrived = ref(false)

const typeLabels = {
  mensaje: 'Mensaje',
  multa: 'Multa',
  asamblea: 'Asamblea',
  pago_atrasado: 'Pago atrasado',
}

const detailRoute = {
  multa: (n) => ({ name: 'multa-detail', params: { id: n.notifiable_id } }),
  asamblea: (n) => ({ name: 'asamblea-detail', params: { id: n.notifiable_id } }),
  pago_atrasado: (n) => ({ name: 'pago-detail', params: { id: n.notifiable_id } }),
}

function toggle() {
  open.value = !open.value
}

async function selectNotification(notification) {
  await markAsRead(notification)

  const buildRoute = detailRoute[notification.type]
  if (buildRoute) {
    router.push(buildRoute(notification))
  }

  open.value = false
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

let unsubscribe = null

onMounted(async () => {
  await loadNotifications()

  const channel = echo.private(`notifications.${user.value.id}`)
  channel.listen('.NotificationCreated', (payload) => {
    addNotification(payload)
    justArrived.value = true
    setTimeout(() => {
      justArrived.value = false
    }, 1500)
  })

  unsubscribe = () => echo.leave(`notifications.${user.value.id}`)
})

onUnmounted(() => {
  unsubscribe?.()
})
</script>

<template>
  <div class="bell-wrap">
    <button
      type="button"
      class="bell"
      :class="{ 'has-unread': unreadCount > 0, pulse: justArrived }"
      @click="toggle"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </button>

    <div v-if="open" class="dropdown">
      <div class="dropdown-header">Notificaciones</div>
      <div v-if="notifications.length === 0" class="empty">No tienes notificaciones.</div>
      <button
        v-for="n in notifications"
        :key="n.id"
        type="button"
        class="item"
        :class="{ unread: !n.read_at }"
        @click="selectNotification(n)"
      >
        <span class="tag" :class="n.type">{{ typeLabels[n.type] ?? n.type }}</span>
        <span class="title">{{ n.title }}</span>
        <span class="body">{{ n.body }}</span>
        <span class="time">{{ formatTime(n.created_at) }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.bell-wrap {
  position: relative;
}
.bell {
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
  color: #444;
  padding: 0.3rem;
  display: flex;
  align-items: center;
}
.bell.has-unread {
  color: #2563eb;
}
.bell.pulse {
  animation: pulse 0.5s ease;
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
.badge {
  position: absolute;
  top: -2px;
  right: -4px;
  background: #dc2626;
  color: #fff;
  font-size: 0.65rem;
  line-height: 1;
  padding: 2px 5px;
  border-radius: 999px;
  font-weight: 700;
}
.dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  z-index: 20;
}
.dropdown-header {
  padding: 0.7rem 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid #eee;
}
.empty {
  padding: 1rem;
  font-size: 0.85rem;
  color: #999;
  text-align: center;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  border-bottom: 1px solid #f2f2f2;
  padding: 0.6rem 1rem;
  cursor: pointer;
}
.item.unread {
  background: #eff6ff;
}
.item:hover {
  background: #f5f5f5;
}
.item.unread:hover {
  background: #e0edff;
}
.tag {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 1px 6px;
  border-radius: 4px;
  background: #e5e7eb;
  color: #374151;
}
.tag.multa {
  background: #fee2e2;
  color: #b91c1c;
}
.tag.asamblea {
  background: #dbeafe;
  color: #1d4ed8;
}
.tag.pago_atrasado {
  background: #fef3c7;
  color: #92400e;
}
.tag.mensaje {
  background: #dcfce7;
  color: #15803d;
}
.title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #111;
}
.body {
  font-size: 0.8rem;
  color: #555;
}
.time {
  font-size: 0.7rem;
  color: #999;
  margin-top: 0.15rem;
}
</style>
