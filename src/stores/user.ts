import type { User } from '@/types'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const username = computed(() => user.value?.username ?? '')
  const email = computed(() => user.value?.email ?? '')

  const setCurrentUser = (username: string, email: string) => {
    user.value = { username, email }
  }

  const clearCurrentUser = () => {
    user.value = null
  }

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const res = await fetch('http://localhost:1337/api/users/me?populate=*', {
        method: 'GET',
        credentials: 'include'
      })

      if (!res.ok) throw new Error('Failed to fetch user data')

      const data = await res.json()
      const userData: User = {
        username: data.username,
        email: data.email,
      }
      user.value = userData
      return userData
    } catch (err) {
      console.error('Error fetching user data:', err)
      user.value = null
      return null
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
        credentials: 'include'
      })

      const data = await res.json()
      if (!res.ok) {
        return { success: false, message: data?.error?.message || 'Login failed.' }
      }

      const userData = await fetch('http://localhost:1337/api/users/me?populate=*', {
        method: 'GET',
        credentials: 'include'
      })

      const userJson = await userData.json()
      if (!userData.ok) {
        return { success: false, message: 'Failed to fetch user data.' }
      }

      setCurrentUser(userJson.username, userJson.email)
      return { success: true, message: 'Login successful!' }
    } catch (err) {
      return { success: false, message: 'An unexpected error occurred.' }
    }
  }

  const logout = async () => {
    try {
      await fetch('http://localhost:1337/api/auth/local', {
        method: 'DELETE',
        credentials: 'include'
      })
      clearCurrentUser()
    } catch (err) {
      console.error('Error logging out:', err)
    }
  }

  return {
    user,
    isAuthenticated,
    username,
    email,
    setCurrentUser,
    clearCurrentUser,
    getCurrentUser,
    login,
    logout,
  }
})
