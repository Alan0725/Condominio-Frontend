<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import Chat from './components/Chat.vue'

const storedUser = localStorage.getItem('user')
const user = ref(storedUser ? JSON.parse(storedUser) : null)

function onAuthenticated(payload) {
  user.value = payload.user
}

function onLogout() {
  user.value = null
}
</script>

<template>
  <Chat v-if="user" :user="user" @logout="onLogout" />
  <Login v-else @authenticated="onAuthenticated" />
</template>
