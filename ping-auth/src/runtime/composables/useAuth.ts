import { computed, useState } from '#imports'

export const useAuth = () => {
  const login = () => {
    window.location.href = "/api/auth/login"
  }

  const logout = () => {
    window.location.href = "/api/auth/logout"
  }

  const authUser = useState<any>('ping_auth_user_data', () => null)

  const getUser = async () => {
    if (!authUser.value) {
      try {
        const data = await $fetch('/api/auth/me')
        authUser.value = data
      } catch {
        authUser.value = null
      }
    }
    return authUser.value
  }

  if (!authUser.value && import.meta.client) {
    getUser()
  }

  const hasAccess = computed(() => (authUser.value?.roles?.length || 0) > 0)
  const roles = computed(() => authUser.value?.roles || [])
  const user = computed(() => authUser.value)

  return { login, logout, getUser, hasAccess, roles, user }
}