<script setup>
import { toasts, removeToast } from '../toast'
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="t.type"
        @click="removeToast(t.id)"
      >
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 200;
  max-width: min(320px, calc(100vw - 2rem));
}
.toast {
  padding: 0.7rem 1rem;
  border-radius: 8px;
  background: #1f2937;
  color: #fff;
  font-size: 0.85rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  cursor: pointer;
}
.toast.success {
  background: #16a34a;
}
.toast.error {
  background: #dc2626;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
.toast-move {
  transition: transform 0.25s ease;
}
</style>
