<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

/**
 * Stores
 */
const userStore = useUserStore()
const { getCurrentUser } = userStore

/**
 * Reactive variables
 */
const user = ref({
  username: '',
  email: ''
})

/**
 * lifecycle hooks
 */
onMounted(async () => {
  const userData = await getCurrentUser()
  if (userData) {
    user.value = userData
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="max-w-md mx-auto mt-12 p-8 bg-white dark:bg-gray-800 rounded shadow">
      <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">User Profile</h1>
      <div class="mb-4">
        <span class="block text-gray-700 dark:text-gray-200 font-semibold">Username:</span>
        <span class="block text-gray-900 dark:text-white">{{ user.username }}</span>
      </div>
      <div>
        <span class="block text-gray-700 dark:text-gray-200 font-semibold">Email:</span>
        <span class="block text-gray-900 dark:text-white">{{ user.email }}</span>
      </div>
    </div>
  </DefaultLayout>
</template>
