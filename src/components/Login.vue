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

const forgotForm = ref({
  email: '',
  code: '',
  password: '',
  password_confirmation: '',
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

async function requestCode() {
  error.value = ''
  loading.value = true

  try {
    const { data } = await api.post('/forgot-password', { email: forgotForm.value.email })
    pushToast(data.message, 'success')
    mode.value = 'forgot-code'
  } catch (e) {
    error.value = e.response?.data?.message || 'Ocurrió un error, intenta de nuevo.'
    pushToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

async function resetPassword() {
  error.value = ''
  loading.value = true

  try {
    const { data } = await api.post('/reset-password', forgotForm.value)
    pushToast(data.message, 'success')
    forgotForm.value = { email: '', code: '', password: '', password_confirmation: '' }
    mode.value = 'login'
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

function goToForgot() {
  mode.value = 'forgot-email'
  error.value = ''
}

function backToLogin() {
  mode.value = 'login'
  error.value = ''
}
</script>

<template>
  <div class="auth-card">
    <h1>Chat del Condominio</h1>
    <p class="subtitle">
      <template v-if="mode === 'login'">Inicia sesión con tu cuenta</template>
      <template v-else-if="mode === 'register'">Crea una cuenta para tu departamento</template>
      <template v-else-if="mode === 'forgot-email'">Recupera el acceso a tu cuenta</template>
      <template v-else>Ingresa el código que te enviamos por correo</template>
    </p>

    <form v-if="mode === 'login' || mode === 'register'" @submit.prevent="submit">
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

    <form v-else-if="mode === 'forgot-email'" @submit.prevent="requestCode">
      <label>
        Correo
        <input v-model="forgotForm.email" type="email" required />
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <LoadingButton type="submit" :loading="loading" loading-text="Enviando...">
        Enviar código
      </LoadingButton>
    </form>

    <form v-else @submit.prevent="resetPassword">
      <label>
        Código de 6 dígitos
        <input v-model="forgotForm.code" type="text" inputmode="numeric" maxlength="6" required />
      </label>
      <label>
        Nueva contraseña
        <input v-model="forgotForm.password" type="password" required minlength="6" />
      </label>
      <label>
        Confirmar nueva contraseña
        <input v-model="forgotForm.password_confirmation" type="password" required minlength="6" />
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <LoadingButton type="submit" :loading="loading" loading-text="Guardando...">
        Restablecer contraseña
      </LoadingButton>
    </form>

    <button v-if="mode === 'login'" class="link" type="button" @click="goToForgot">
      ¿Olvidaste tu contraseña?
    </button>

    <button
      v-if="mode === 'forgot-email' || mode === 'forgot-code'"
      class="link"
      type="button"
      @click="backToLogin"
    >
      ← Volver a iniciar sesión
    </button>

    <button v-if="mode === 'login' || mode === 'register'" class="link" type="button" @click="toggleMode">
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
  display: block;
  margin-top: 1rem;
  border: none;
  background: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 0.85rem;
  text-align: left;
}
.error {
  color: #dc2626;
  font-size: 0.85rem;
  margin: 0;
}
</style>
