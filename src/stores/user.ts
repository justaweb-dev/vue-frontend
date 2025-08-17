import type { User } from '@/types'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * API URL
 */
const API_URL = import.meta.env.VITE_API_URL

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const username = computed(() => user.value?.username ?? '')
  const email = computed(() => user.value?.email ?? '')

  const setCurrentUser = (userData: User) => {
    user.value = userData
  }

  const setToken = (jwt: string) => {
    token.value = jwt
    // Store in sessionStorage instead of localStorage for better security
    sessionStorage.setItem('jwt', jwt)
  }

  const clearCurrentUser = () => {
    user.value = null
    token.value = null
    sessionStorage.removeItem('jwt')
    localStorage.removeItem('jwt') // Remove legacy localStorage tokens
  }

  const loadToken = () => {
    // Try sessionStorage first, then localStorage for migration
    const stored = sessionStorage.getItem('jwt') || localStorage.getItem('jwt')
    if (stored) {
      token.value = stored
      // Migrate from localStorage to sessionStorage if needed
      if (!sessionStorage.getItem('jwt') && localStorage.getItem('jwt')) {
        sessionStorage.setItem('jwt', stored)
        localStorage.removeItem('jwt')
      }
    }
  }

  const getCurrentUser = async (jwt?: string): Promise<User | null> => {
    const authToken = jwt || token.value || sessionStorage.getItem('jwt') || localStorage.getItem('jwt')
    if (!authToken) return null
    try {
      const res = await fetch(`${API_URL}/api/users/me?populate=*`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
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
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userUpdateData),
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
  ): Promise<{ success: boolean; message: string; token?: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        return {
          success: false,
          message: data?.error?.message || 'Login failed.',
        }
      }

      if (data.jwt) {
        setToken(data.jwt)
      }
      await getCurrentUser(data.jwt)
      return { success: true, message: 'Login successful!', token: data.jwt }
    } catch (err) {
      return { success: false, message: 'An unexpected error occurred.' }
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/local`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`,
        },
      })
      clearCurrentUser()
    } catch (err) {
      console.error('Error logging out:', err)
    }
  }

  const changePassword = async (
    currentPassword: string,
    password: string,
    passwordConfirmation: string,
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          password,
          passwordConfirmation,
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        return {
          success: false,
          message: errorData?.message || 'Failed to change password.',
        }
      }

      return {
        success: true,
        message: 'Password changed successfully.',
      }
    } catch (err) {
      console.error('Error changing password:', err)
      return { success: false, message: 'An unexpected error occurred.' }
    }
  }

  const deleteUser = async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`,
        },
      })
      if (!res.ok) {
        const errorData = await res.json()
        return {
          success: false,
          message: errorData?.error?.message || 'Failed to delete user.',
        }
      }
      clearCurrentUser()
      return { success: true, message: 'User deleted successfully.' }
    } catch (err) {
      console.error('Error deleting user:', err)
      return { success: false, message: 'An unexpected error occurred.' }
    }
  }

  const resetPassword = async (
    code: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          password,
          passwordConfirmation,
        }),
      })
      if (!res.ok) {
        throw new Error('Error resetting password')
      }
      return { success: true, message: 'Password reset successfully' }
    } catch (err: any) {
      console.error('Error resetting password:', err)
      return {
        success: false,
        message: err.message || 'Error resetting password',
      }
    }
  }

  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        return { success: true, message: 'Registration successful. Please check your email.' }
      } else {
        return { success: false, message: data.message || 'Registration failed.' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed.' }
    }
  }

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        return { success: true, message: 'Reset link sent to your email.' }
      } else {
        return { success: false, message: data.message || 'Failed to send reset link.' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to send reset link.' }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    username,
    email,
    setCurrentUser,
    setToken,
    clearCurrentUser,
    loadToken,
    getCurrentUser,
    login,
    logout,
    updateUser,
    changePassword,
    deleteUser,
    resetPassword,
    register,
    forgotPassword,
  }
})
