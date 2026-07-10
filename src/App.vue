<script setup>
import Login from './components/Login.vue'
import AppLayout from './components/AppLayout.vue'
import ToastContainer from './components/ToastContainer.vue'
import { user } from './session'
</script>

<template>
  <AppLayout v-if="user" />
  <Login v-else />
  <ToastContainer />
</template>
