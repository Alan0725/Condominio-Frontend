<script setup>
import { onMounted, ref } from 'vue'
import api from '../api'

const users = ref([])

const multaForm = ref({ user_id: '', motivo: '', monto: '' })
const pagoForm = ref({ user_id: '', monto: '', periodo: '' })
const asambleaForm = ref({ titulo: '', descripcion: '', fecha: '' })

const status = ref({ multa: '', pago: '', asamblea: '' })

onMounted(async () => {
  const { data } = await api.get('/admin/users')
  users.value = data
})

async function submitMulta() {
  status.value.multa = 'Guardando...'
  try {
    await api.post('/admin/multas', multaForm.value)
    status.value.multa = 'Multa registrada.'
    multaForm.value = { user_id: '', motivo: '', monto: '' }
  } catch {
    status.value.multa = 'Ocurrió un error al registrar la multa.'
  }
}

async function submitPago() {
  status.value.pago = 'Guardando...'
  try {
    await api.post('/admin/pagos-atrasados', pagoForm.value)
    status.value.pago = 'Pago atrasado registrado.'
    pagoForm.value = { user_id: '', monto: '', periodo: '' }
  } catch {
    status.value.pago = 'Ocurrió un error al registrar el pago.'
  }
}

async function submitAsamblea() {
  status.value.asamblea = 'Guardando...'
  try {
    await api.post('/admin/asambleas', asambleaForm.value)
    status.value.asamblea = 'Asamblea creada y notificada a todos.'
    asambleaForm.value = { titulo: '', descripcion: '', fecha: '' }
  } catch {
    status.value.asamblea = 'Ocurrió un error al crear la asamblea.'
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
        <button type="submit">Registrar multa</button>
        <p class="status">{{ status.multa }}</p>
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
        <button type="submit">Registrar pago atrasado</button>
        <p class="status">{{ status.pago }}</p>
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
        <button type="submit">Crear asamblea (notifica a todos)</button>
        <p class="status">{{ status.asamblea }}</p>
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
.status {
  margin: 0;
  font-size: 0.8rem;
  color: #16a34a;
  min-height: 1em;
}
</style>
