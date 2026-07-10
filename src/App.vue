<script setup>
import Login from './components/Login.vue'
import AppLayout from './components/AppLayout.vue'
import { user } from './session'
</script>

<template>
  <AppLayout v-if="user" />
  <Login v-else />
</template>
