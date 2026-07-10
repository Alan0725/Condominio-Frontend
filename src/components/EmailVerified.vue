<script setup>
function goToLogin() {
  window.location.href = '/'
}
</script>

<template>
  <div class="verified-card">
    <span class="icon">✓</span>
    <h1>¡Correo confirmado!</h1>
    <p>Tu cuenta ya está verificada. Ahora puedes iniciar sesión con normalidad.</p>
    <button type="button" @click="goToLogin">Ir a iniciar sesión</button>
  </div>
</template>

<style scoped>
.verified-card {
  max-width: 360px;
  margin: 6rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #dcfce7;
  color: #16a34a;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
h1 {
  font-size: 1.2rem;
  margin: 0 0 0.6rem;
}
p {
  color: #555;
  font-size: 0.9rem;
  margin: 0 0 1.5rem;
}
button {
  border: none;
  background: #2563eb;
  color: #fff;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
}
</style>
