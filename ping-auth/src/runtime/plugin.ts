import { defineNuxtPlugin } from "#app"
import { useAuth } from "#imports"

export default defineNuxtPlugin(() => {
  return {
    provide: {
      auth: useAuth(),
    },
  }
})