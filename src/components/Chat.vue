<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, ref } from 'vue'
import api from '../api'
import { user } from '../session'
import { pushToast } from '../toast'
import LoadingButton from './LoadingButton.vue'

const echo = inject('echo')

const messages = ref([])
const newMessage = ref('')
const connected = ref(false)
const sending = ref(false)
const scrollArea = ref(null)

const isMine = (message) => message.user.id === user.value.id

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

  sending.value = true
  try {
    await api.post('/messages', { body })
    newMessage.value = ''
    pushToast('Mensaje enviado', 'success')
  } catch {
    pushToast('No se pudo enviar el mensaje', 'error')
  } finally {
    sending.value = false
  }
}

let channel = null

onMounted(async () => {
  await loadMessages()

  connected.value = echo.connector.pusher.connection.state === 'connected'
  echo.connector.pusher.connection.bind('connected', () => {
    connected.value = true
  })
  echo.connector.pusher.connection.bind('disconnected', () => {
    connected.value = false
  })

  channel = echo.channel('chat')
  channel.listen('.MessageSent', async (payload) => {
    messages.value.push(payload)
    await scrollToBottom()
  })
})

onUnmounted(() => {
  echo.leave('chat')
})

const statusLabel = computed(() => (connected.value ? 'En vivo' : 'Conectando...'))
</script>

<template>
  <div class="chat-page">
    <div class="status-bar">
      <span class="status" :class="{ live: connected }">● {{ statusLabel }}</span>
    </div>

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
      <LoadingButton type="submit" :loading="sending" loading-text="Enviando...">Enviar</LoadingButton>
    </form>
  </div>
</template>

<style scoped>
.chat-page {
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.status-bar {
  padding: 0.5rem 1.25rem 0;
}
.status {
  font-size: 0.75rem;
  color: #999;
}
.status.live {
  color: #16a34a;
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
