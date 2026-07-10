<script setup>
import { onMounted, ref, watch } from 'vue'
import api from '../api'

const props = defineProps({
  id: { type: [String, Number], required: true },
})

const multa = ref(null)
const error = ref('')

async function load() {
  error.value = ''
  multa.value = null
  try {
    const { data } = await api.get(`/multas/${props.id}`)
    multa.value = data
  } catch (e) {
    error.value = e.response?.status === 403
      ? 'No tienes permiso para ver esta multa.'
      : 'No se encontró la multa.'
  }
}

onMounted(load)
watch(() => props.id, load)

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('es-MX', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
}
</script>

<template>
  <div class="detail-page">
    <router-link to="/" class="back">← Volver al chat</router-link>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-else-if="multa" class="card">
      <span class="tag">Multa</span>
      <h1>{{ multa.motivo }}</h1>
      <p class="amount">${{ multa.monto }}</p>

      <dl>
        <dt>Departamento</dt>
        <dd>{{ multa.user.departamento }} · {{ multa.user.name }}</dd>

        <dt>Registrada por</dt>
        <dd>{{ multa.creator.name }}</dd>

        <dt>Fecha</dt>
        <dd>{{ formatDate(multa.created_at) }}</dd>
      </dl>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 560px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
  width: 100%;
}
.back {
  display: inline-block;
  margin-bottom: 1rem;
  color: #2563eb;
  text-decoration: none;
  font-size: 0.85rem;
}
.error {
  color: #dc2626;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.tag {
  display: inline-block;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 0.6rem;
}
h1 {
  font-size: 1.3rem;
  margin: 0 0 0.4rem;
}
.amount {
  font-size: 1.6rem;
  font-weight: 700;
  color: #b91c1c;
  margin: 0 0 1.2rem;
}
dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.4rem 1rem;
  margin: 0;
}
dt {
  color: #888;
  font-size: 0.8rem;
}
dd {
  margin: 0;
  font-size: 0.9rem;
}
</style>
