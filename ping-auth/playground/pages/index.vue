<script setup>
const { login } = useAuth()
</script>

<template>
  <div>
    <h1>Home</h1>
    <button @click="login">Login with Ping</button>
  </div>
</template>