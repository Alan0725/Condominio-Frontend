<script setup>
import { onUnmounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import { user, setUser } from '../session'
import { resetNotifications } from '../notifications'
import { createEcho } from '../echo'
import { pushToast } from '../toast'
import api from '../api'
import NotificationBell from './NotificationBell.vue'
import LoadingButton from './LoadingButton.vue'

const router = useRouter()

const echo = createEcho()
provide('echo', echo)

onUnmounted(() => {
  echo.disconnect()
})

const loggingOut = ref(false)

async function logout() {
  loggingOut.value = true
  try {
    await api.post('/logout')
    pushToast('Sesión cerrada.', 'success')
  } catch {
    pushToast('Sesión cerrada localmente (sin conexión con el servidor).', 'error')
  } finally {
    loggingOut.value = false
    resetNotifications()
    setUser(null)
    router.push('/')
  }
}
</script>

<template>
  <div class="layout">
    <header>
      <div class="left">
        <span class="brand">Condominio</span>
        <nav>
          <router-link to="/">Chat</router-link>
          <router-link to="/asambleas">Asambleas</router-link>
          <router-link v-if="user?.is_admin" to="/admin">Admin</router-link>
        </nav>
      </div>
      <div class="right">
        <NotificationBell />
        <span class="who">{{ user.name }} · {{ user.departamento }}</span>
        <LoadingButton type="button" :loading="loggingOut" loading-text="Saliendo..." @click="logout">
          Salir
        </LoadingButton>
      </div>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
}
.left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.brand {
  font-weight: 700;
  font-size: 1.05rem;
}
nav {
  display: flex;
  gap: 1rem;
}
nav a {
  color: #555;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.3rem 0;
  border-bottom: 2px solid transparent;
}
nav a.router-link-exact-active {
  color: #2563eb;
  border-bottom-color: #2563eb;
  font-weight: 600;
}
.right {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}
.who {
  font-size: 0.85rem;
  color: #444;
}
.right button {
  border: 1px solid #d7d7d7;
  background: #fff;
  border-radius: 6px;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  font-size: 0.8rem;
}
main {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
