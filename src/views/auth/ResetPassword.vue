<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { HButton, HInput } from '@justawebdev/histoire-library'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * API URL
 */
const API_URL = import.meta.env.VITE_API_URL

const password = ref('')
const confirmPassword = ref('')
const error = ref(false)

const route = useRoute()
const router = useRouter()

const resetPassword = async () => {
  error.value = false
  try {
    await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: route.query.code,
        password: password.value,
        passwordConfirmation: confirmPassword.value,
      }),
    })
    router.push('/login')
  } catch (err) {
    console.error('Error resetting password:', err)
    error.value = true
  }
}
</script>

<template>
  <DefaultLayout>
    <div class="flex items-center justify-center h-screen">
      <div class="container mx-auto">
        <div class="p-5 text-left flex flex-col items-center">
          <h1 class="font-bold text-left text-4xl mb-10">
            Recover your Password
          </h1>
          <p v-show="error" class="text-sm text-red-500">
            An Error Occurred, Please Try Again
          </p>
          <form @submit.prevent="resetPassword" class="w-1/2 space-y-4">
            <HInput
              v-model="password"
              label="Password"
              id="password"
              type="password"
              required
            />
            <HInput
              v-model="confirmPassword"
              label="Confirm Password"
              id="confirm-password"
              type="password"
              required
            />
            <HButton label="Reset Password" class-name="mt-4" />
          </form>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
