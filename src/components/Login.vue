<script setup>
import { ref } from 'vue'
import api from '../api'
import { setUser } from '../session'
import { pushToast } from '../toast'
import LoadingButton from './LoadingButton.vue'

const mode = ref('login')
const loading = ref(false)
const error = ref('')

const form = ref({
  name: '',
  email: '',
  departamento: '',
  password: '',
})

async function submit() {
  error.value = ''
  loading.value = true

  try {
    const url = mode.value === 'login' ? '/login' : '/register'
    const payload =
      mode.value === 'login'
        ? { email: form.value.email, password: form.value.password }
        : form.value

    const { data } = await api.post(url, payload)

    localStorage.setItem('token', data.token)
    setUser(data.user)

    if (mode.value === 'register') {
      pushToast('Cuenta creada. Revisa tu correo para confirmarla.', 'success')
    } else {
      pushToast(`Bienvenido, ${data.user.name}`, 'success')
    }
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      Object.values(e.response?.data?.errors ?? {}).flat().join(' ') ||
      'Ocurrió un error, intenta de nuevo.'
    pushToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
}
</script>

<template>
  <div class="auth-card">
    <h1>Chat del Condominio</h1>
    <p class="subtitle">
      {{ mode === 'login' ? 'Inicia sesión con tu cuenta' : 'Crea una cuenta para tu departamento' }}
    </p>

    <form @submit.prevent="submit">
      <template v-if="mode === 'register'">
        <label>
          Nombre
          <input v-model="form.name" type="text" required />
        </label>
        <label>
          Departamento
          <input v-model="form.departamento" type="text" placeholder="Ej. Depto 4B" required />
        </label>
      </template>

      <label>
        Correo
        <input v-model="form.email" type="email" required />
      </label>
      <label>
        Contraseña
        <input v-model="form.password" type="password" required minlength="6" />
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <LoadingButton type="submit" :loading="loading" loading-text="Entrando...">
        {{ mode === 'login' ? 'Entrar' : 'Registrarme' }}
      </LoadingButton>
    </form>

    <button class="link" type="button" @click="toggleMode">
      {{ mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
    </button>
  </div>
</template>

<style scoped>
.auth-card {
  max-width: 360px;
  margin: 4rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: left;
}
h1 {
  font-size: 1.4rem;
  margin-bottom: 0.25rem;
}
.subtitle {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: #333;
}
input {
  padding: 0.55rem 0.7rem;
  border: 1px solid #d7d7d7;
  border-radius: 8px;
  font-size: 0.95rem;
}
button[type='submit'] {
  margin-top: 0.4rem;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
button[type='submit']:disabled {
  opacity: 0.6;
  cursor: default;
}
.link {
  margin-top: 1rem;
  border: none;
  background: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 0.85rem;
}
.error {
  color: #dc2626;
  font-size: 0.85rem;
  margin: 0;
}
</style>
