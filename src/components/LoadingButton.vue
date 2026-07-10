<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: 'Cargando...' },
})
</script>

<template>
  <button :disabled="loading">
    <Transition name="fade" mode="out-in">
      <span v-if="loading" key="loading" class="loading-content">
        <span class="spinner" />
        {{ loadingText }}
      </span>
      <span v-else key="idle"><slot /></span>
    </Transition>
  </button>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.loading-content {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
