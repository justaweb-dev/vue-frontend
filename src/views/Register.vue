<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import router from '@/router'
import { HButton, HInput } from '@justawebdev/histoire-library'
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

const validateEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email)
}

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  if (!username.value || !email.value || !password.value) {
    error.value = 'All fields are required.'
    return
  }
  if (!validateEmail(email.value)) {
    error.value = 'Invalid email address.'
    return
  }

  const registerNewUser = await fetch(
    'http://localhost:1337/api/auth/local/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    },
  )

  const data = await registerNewUser.json()
  if (registerNewUser.ok) {
    success.value = 'Registration successful!'
    router.push('/login')
  } else {
    error.value = data.message || 'Registration failed.'
  }

  // Clear the input fields after registration
  username.value = ''
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
        Register
      </h1>
      <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
        <HInput
          v-model="username"
          label="Username"
          id="username"
          type="text"
          required
        />
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
        <HButton label="Register" class-name="mt-4" />
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
