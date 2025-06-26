<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { HButton, HInput } from '@justawebdev/histoire-library'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Store
 */
const usersStore = useUserStore()
const { resetPassword } = usersStore

const password = ref('')
const confirmPassword = ref('')

const route = useRoute()

const handleResetPassword = async () => {
  const code = route.query.code as string
  const result = await resetPassword(
    code,
    password.value,
    confirmPassword.value,
  )
  if (result.success) {
    router.push('/login')
  } else {
    console.error(result.message)
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
          <form @submit.prevent="handleResetPassword" class="w-1/2 space-y-4">
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
