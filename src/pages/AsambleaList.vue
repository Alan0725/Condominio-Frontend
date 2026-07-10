<script setup>
import { onMounted, ref } from 'vue'
import api from '../api'

const asambleas = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await api.get('/asambleas')
  asambleas.value = data
  loading.value = false
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('es-MX', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
}
</script>

<template>
  <div class="list-page">
    <h1>Asambleas</h1>

    <p v-if="loading" class="hint">Cargando...</p>
    <p v-else-if="asambleas.length === 0" class="hint">Todavía no hay asambleas programadas.</p>

    <router-link
      v-for="asamblea in asambleas"
      :key="asamblea.id"
      :to="{ name: 'asamblea-detail', params: { id: asamblea.id } }"
      class="card"
    >
      <span class="title">{{ asamblea.titulo }}</span>
      <span class="date">{{ formatDate(asamblea.fecha) }}</span>
    </router-link>
  </div>
</template>

<style scoped>
.list-page {
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
.hint {
  color: #999;
  font-size: 0.85rem;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.6rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  text-decoration: none;
  color: inherit;
}
.card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.title {
  font-weight: 600;
  font-size: 0.95rem;
}
.date {
  font-size: 0.8rem;
  color: #1d4ed8;
}
</style>
