import type { User } from '@/types'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const username = computed(() => user.value?.username ?? '')
  const email = computed(() => user.value?.email ?? '')

  const setCurrentUser = (userData: User) => {
    user.value = userData
  }

  const clearCurrentUser = () => {
    user.value = null
  }

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const res = await fetch('http://localhost:1337/api/users/me?populate=*', {
        method: 'GET',
        credentials: 'include',
      })

      if (res.status === 403) {
        console.warn('Usuario no autenticado')
        return null
      }

      if (!res.ok) throw new Error('Failed to fetch user data')

      const data = await res.json()

      setCurrentUser(data)
      return data
    } catch (err) {
      console.error('Error fetching user data:', err)
      user.value = null
      return null
    }
  }

  const updateUser = async (
    id: string,
    userUpdateData: User,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`http://localhost:1337/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userUpdateData),
        credentials: 'include',
      })

      if (!res.ok) {
        const errorData = await res.json()
        return {
          success: false,
          message: errorData?.error?.message || 'Failed to update user.',
        }
      }

      const data = await res.json()

      if (!data) {
        return { success: false, message: 'User not found.' }
      }

      return data
    } catch (err) {
      console.error('Error updating user:', err)
      return { success: false, message: 'An unexpected error occurred.' }
    }
  }

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        return {
          success: false,
          message: data?.error?.message || 'Login failed.',
        }
      }

      const resUser = await fetch(
        'http://localhost:1337/api/users/me?populate=*',
        {
          method: 'GET',
          credentials: 'include',
        },
      )

      if (!resUser.ok) {
        return { success: false, message: 'Failed to fetch user data.' }
      }

      const dataUser = await resUser.json()
      setCurrentUser(dataUser)
      return { success: true, message: 'Login successful!' }
    } catch (err) {
      return { success: false, message: 'An unexpected error occurred.' }
    }
  }

  const logout = async () => {
    try {
      await fetch('http://localhost:1337/api/auth/local', {
        method: 'DELETE',
        credentials: 'include',
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
    updateUser,
  }
})
