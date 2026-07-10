<script setup>
import Login from './components/Login.vue'
import AppLayout from './components/AppLayout.vue'
import EmailVerified from './components/EmailVerified.vue'
import ToastContainer from './components/ToastContainer.vue'
import { user } from './session'

const isEmailVerifiedPage = window.location.pathname === '/email-verificado'
</script>

<template>
  <EmailVerified v-if="isEmailVerifiedPage" />
  <AppLayout v-else-if="user" />
  <Login v-else />
  <ToastContainer />
</template>
