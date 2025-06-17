<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { HButton, HInput } from '@justawebdev/histoire-library'
import { ref } from 'vue'

/**
 * Stores
 */
const userStore = useUserStore()
const { login } = userStore

/**
 * Reactive variables
 */
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

/**
 * Methods
 */
const validateEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email)
}

const handleLogin = async () => {
  error.value = ''
  success.value = ''
  if (!email.value || !password.value) {
    error.value = 'Both fields are required.'
    return
  }
  if (!validateEmail(email.value)) {
    error.value = 'Invalid email address.'
    return
  }

  const result = await login(email.value, password.value)

  if (result.success) {
    success.value = result.message
    router.push('/user')
  } else {
    error.value = result.message
  }

  email.value = ''
  password.value = ''

  // Clear the input fields after registration
  email.value = ''
  password.value = ''
}
</script>

<template>
  <DefaultLayout>
    <div
      class="max-w-md mx-auto mt-12 p-8 bg-white dark:bg-gray-800 rounded shadow"
    >
      <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Login
      </h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <HInput
          v-model="email"
          label="Email"
          id="email"
          type="email"
          required
        />
        <HInput
          v-model="password"
          label="Password"
          id="password"
          type="password"
          required
        />
        <HButton label="Login" class-name="mt-4" />
        <div v-if="error" class="text-red-600 dark:text-red-400 mt-2">
          {{ error }}
        </div>
        <div v-if="success" class="text-green-600 dark:text-green-400 mt-2">
          {{ success }}
        </div>
      </form>
    </div>
  </DefaultLayout>
</template>
