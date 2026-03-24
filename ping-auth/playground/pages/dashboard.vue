<script setup>
import { onMounted } from 'vue'

const { logout, roles, user, getUser } = useAuth()

onMounted(async () => {
  await getUser()
  console.log("User roles:", roles.value)
  console.log("User info:", user.value)
})
</script>

<template>
  <div>
    <h1>Dashboard (Protected)</h1>
    <button @click="logout">Logout</button>
    <div v-if="roles['workshops mãos à obra'] && roles['workshops mãos à obra'].length">
      <h2>User Roles:</h2>
      <ul>
        <li v-for="role in roles['workshops mãos à obra']" :key="role">{{ role }}</li>
      </ul>
    </div>
  </div>
</template>