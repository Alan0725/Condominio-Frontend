<script setup>
import { onMounted, ref, watch } from 'vue'
import api from '../api'

const props = defineProps({
  id: { type: [String, Number], required: true },
})

const asamblea = ref(null)
const error = ref('')

async function load() {
  error.value = ''
  asamblea.value = null
  try {
    const { data } = await api.get(`/asambleas/${props.id}`)
    asamblea.value = data
  } catch {
    error.value = 'No se encontró la asamblea.'
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
    <router-link to="/asambleas" class="back">← Volver a asambleas</router-link>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-else-if="asamblea" class="card">
      <span class="tag">Asamblea</span>
      <h1>{{ asamblea.titulo }}</h1>
      <p class="date">{{ formatDate(asamblea.fecha) }}</p>
      <p class="descripcion">{{ asamblea.descripcion }}</p>

      <dl>
        <dt>Convocada por</dt>
        <dd>{{ asamblea.creator.name }}</dd>
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
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 0.6rem;
}
h1 {
  font-size: 1.3rem;
  margin: 0 0 0.3rem;
}
.date {
  font-size: 0.9rem;
  color: #1d4ed8;
  font-weight: 600;
  margin: 0 0 1rem;
}
.descripcion {
  font-size: 0.9rem;
  color: #333;
  white-space: pre-wrap;
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
