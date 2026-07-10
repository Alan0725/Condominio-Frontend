<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { pushToast } from '../toast'
import { setUser } from '../session'
import { resetNotifications } from '../notifications'
import LoadingButton from '../components/LoadingButton.vue'

const router = useRouter()

const form = ref({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const error = ref('')
const saving = ref(false)

async function submit() {
  error.value = ''
  saving.value = true

  try {
    const { data } = await api.post('/change-password', form.value)
    pushToast(data.message, 'success')

    // The backend just revoked every token (including this device's), so
    // the current session is no longer valid: log out locally too.
    resetNotifications()
    setUser(null)
    router.push('/')
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      Object.values(e.response?.data?.errors ?? {}).flat().join(' ') ||
      'Ocurrió un error, intenta de nuevo.'
    pushToast(error.value, 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="account-page">
    <h1>Mi cuenta</h1>

    <section class="card">
      <h2>Cambiar contraseña</h2>
      <p class="hint">
        Al cambiar tu contraseña se cerrará la sesión en todos tus dispositivos, incluido este.
      </p>

      <form @submit.prevent="submit">
        <label>
          Contraseña actual
          <input v-model="form.current_password" type="password" required />
        </label>
        <label>
          Nueva contraseña
          <input v-model="form.password" type="password" required minlength="6" />
        </label>
        <label>
          Confirmar nueva contraseña
          <input v-model="form.password_confirmation" type="password" required minlength="6" />
        </label>

        <p v-if="error" class="error">{{ error }}</p>

        <LoadingButton type="submit" :loading="saving" loading-text="Guardando...">
          Cambiar contraseña
        </LoadingButton>
      </form>
    </section>
  </div>
</template>

<style scoped>
.account-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
  width: 100%;
  overflow-y: auto;
}
h1 {
  font-size: 1.2rem;
  margin: 0 0 1rem;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}
h2 {
  font-size: 1rem;
  margin: 0 0 0.4rem;
}
.hint {
  color: #777;
  font-size: 0.8rem;
  margin: 0 0 1rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #333;
}
input {
  padding: 0.5rem 0.6rem;
  border: 1px solid #d7d7d7;
  border-radius: 6px;
  font-size: 0.9rem;
}
button {
  align-self: flex-start;
  border: none;
  background: #2563eb;
  color: #fff;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  margin-top: 0.4rem;
}
.error {
  color: #dc2626;
  font-size: 0.8rem;
  margin: 0;
}
</style>
