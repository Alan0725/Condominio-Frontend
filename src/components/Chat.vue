<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import api from '../api'
import { createEcho } from '../echo'

const props = defineProps({
  user: { type: Object, required: true },
})
const emit = defineEmits(['logout'])

const messages = ref([])
const newMessage = ref('')
const connected = ref(false)
const scrollArea = ref(null)

let echo = null

const isMine = (message) => message.user.id === props.user.id

async function loadMessages() {
  const { data } = await api.get('/messages')
  messages.value = data
  await scrollToBottom()
}

async function scrollToBottom() {
  await nextTick()
  if (scrollArea.value) {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight
  }
}

async function send() {
  const body = newMessage.value.trim()
  if (!body) return

  newMessage.value = ''
  await api.post('/messages', { body })
}

async function logout() {
  try {
    await api.post('/logout')
  } catch {
    // ignore, we're logging out locally regardless
  }
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  emit('logout')
}

onMounted(async () => {
  await loadMessages()

  echo = createEcho()

  echo.connector.pusher.connection.bind('connected', () => {
    connected.value = true
  })
  echo.connector.pusher.connection.bind('disconnected', () => {
    connected.value = false
  })

  echo.channel('chat').listen('.MessageSent', async (payload) => {
    messages.value.push(payload)
    await scrollToBottom()
  })
})

onUnmounted(() => {
  echo?.leave('chat')
  echo?.disconnect()
})

const statusLabel = computed(() => (connected.value ? 'En vivo' : 'Conectando...'))
</script>

<template>
  <div class="chat-page">
    <header>
      <div>
        <h1>Chat del Condominio</h1>
        <span class="status" :class="{ live: connected }">● {{ statusLabel }}</span>
      </div>
      <div class="who">
        <span>{{ user.name }} · {{ user.departamento }}</span>
        <button type="button" @click="logout">Salir</button>
      </div>
    </header>

    <div class="messages" ref="scrollArea">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="{ mine: isMine(message) }"
      >
        <div class="bubble">
          <span class="meta">{{ message.user.name }} · {{ message.user.departamento }}</span>
          <p>{{ message.body }}</p>
        </div>
      </div>
      <p v-if="messages.length === 0" class="empty">Aún no hay mensajes, ¡sé el primero en escribir!</p>
    </div>

    <form class="composer" @submit.prevent="send">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Escribe un mensaje para todo el condominio..."
        maxlength="1000"
      />
      <button type="submit">Enviar</button>
    </form>
  </div>
</template>

<style scoped>
.chat-page {
  max-width: 640px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e5e5;
}
h1 {
  font-size: 1.1rem;
  margin: 0;
}
.status {
  font-size: 0.75rem;
  color: #999;
}
.status.live {
  color: #16a34a;
}
.who {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #444;
}
.who button {
  border: 1px solid #d7d7d7;
  background: #fff;
  border-radius: 6px;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  font-size: 0.8rem;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: #f7f7f8;
}
.message {
  display: flex;
}
.message.mine {
  justify-content: flex-end;
}
.bubble {
  max-width: 75%;
  background: #fff;
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.message.mine .bubble {
  background: #2563eb;
  color: #fff;
}
.meta {
  display: block;
  font-size: 0.7rem;
  opacity: 0.7;
  margin-bottom: 0.15rem;
}
.bubble p {
  margin: 0;
  font-size: 0.95rem;
  white-space: pre-wrap;
}
.empty {
  text-align: center;
  color: #999;
  font-size: 0.85rem;
  margin-top: 2rem;
}
.composer {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #e5e5e5;
}
.composer input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid #d7d7d7;
  border-radius: 999px;
  font-size: 0.95rem;
}
.composer button {
  border: none;
  background: #2563eb;
  color: #fff;
  border-radius: 999px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
}
</style>
