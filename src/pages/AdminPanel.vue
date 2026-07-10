<script setup>
import { onMounted, ref } from 'vue'
import api from '../api'
import { pushToast } from '../toast'
import LoadingButton from '../components/LoadingButton.vue'

const users = ref([])

const multaForm = ref({ user_id: '', motivo: '', monto: '' })
const pagoForm = ref({ user_id: '', monto: '', periodo: '' })
const asambleaForm = ref({ titulo: '', descripcion: '', fecha: '' })

const saving = ref({ multa: false, pago: false, asamblea: false })

onMounted(async () => {
  const { data } = await api.get('/admin/users')
  users.value = data
})

async function submitMulta() {
  saving.value.multa = true
  try {
    await api.post('/admin/multas', multaForm.value)
    pushToast('Multa registrada.', 'success')
    multaForm.value = { user_id: '', motivo: '', monto: '' }
  } catch {
    pushToast('Ocurrió un error al registrar la multa.', 'error')
  } finally {
    saving.value.multa = false
  }
}

async function submitPago() {
  saving.value.pago = true
  try {
    await api.post('/admin/pagos-atrasados', pagoForm.value)
    pushToast('Pago atrasado registrado.', 'success')
    pagoForm.value = { user_id: '', monto: '', periodo: '' }
  } catch {
    pushToast('Ocurrió un error al registrar el pago.', 'error')
  } finally {
    saving.value.pago = false
  }
}

async function submitAsamblea() {
  saving.value.asamblea = true
  try {
    await api.post('/admin/asambleas', asambleaForm.value)
    pushToast('Asamblea creada y notificada a todos.', 'success')
    asambleaForm.value = { titulo: '', descripcion: '', fecha: '' }
  } catch {
    pushToast('Ocurrió un error al crear la asamblea.', 'error')
  } finally {
    saving.value.asamblea = false
  }
}
</script>

<template>
  <div class="admin-page">
    <h1>Panel de administrador</h1>

    <section class="card">
      <h2>Registrar multa</h2>
      <form @submit.prevent="submitMulta">
        <label>
          Departamento
          <select v-model="multaForm.user_id" required>
            <option value="" disabled>Selecciona un usuario</option>
            <option v-for="u in users" :key="u.id" :value="u.id">{{ u.departamento }} · {{ u.name }}</option>
          </select>
        </label>
        <label>
          Motivo
          <input v-model="multaForm.motivo" type="text" required />
        </label>
        <label>
          Monto
          <input v-model="multaForm.monto" type="number" min="0" step="0.01" required />
        </label>
        <LoadingButton type="submit" :loading="saving.multa" loading-text="Guardando...">
          Registrar multa
        </LoadingButton>
      </form>
    </section>

    <section class="card">
      <h2>Registrar pago atrasado</h2>
      <form @submit.prevent="submitPago">
        <label>
          Departamento
          <select v-model="pagoForm.user_id" required>
            <option value="" disabled>Selecciona un usuario</option>
            <option v-for="u in users" :key="u.id" :value="u.id">{{ u.departamento }} · {{ u.name }}</option>
          </select>
        </label>
        <label>
          Periodo
          <input v-model="pagoForm.periodo" type="text" placeholder="Ej. Julio 2026" required />
        </label>
        <label>
          Monto
          <input v-model="pagoForm.monto" type="number" min="0" step="0.01" required />
        </label>
        <LoadingButton type="submit" :loading="saving.pago" loading-text="Guardando...">
          Registrar pago atrasado
        </LoadingButton>
      </form>
    </section>

    <section class="card">
      <h2>Crear asamblea</h2>
      <form @submit.prevent="submitAsamblea">
        <label>
          Título
          <input v-model="asambleaForm.titulo" type="text" required />
        </label>
        <label>
          Descripción
          <textarea v-model="asambleaForm.descripcion" rows="3" required></textarea>
        </label>
        <label>
          Fecha y hora
          <input v-model="asambleaForm.fecha" type="datetime-local" required />
        </label>
        <LoadingButton type="submit" :loading="saving.asamblea" loading-text="Creando...">
          Crear asamblea (notifica a todos)
        </LoadingButton>
      </form>
    </section>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 560px;
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
  margin-bottom: 1rem;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}
h2 {
  font-size: 1rem;
  margin: 0 0 0.8rem;
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
input,
select,
textarea {
  padding: 0.5rem 0.6rem;
  border: 1px solid #d7d7d7;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
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
}
</style>
