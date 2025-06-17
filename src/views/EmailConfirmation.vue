<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { HButton } from '@justawebdev/histoire-library';
import { RouterLink } from 'vue-router';

</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-4 max-w-md mx-auto mt-12 p-8 bg-white dark:bg-gray-800 rounded shadow text-center">
      <h1 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Email confirmed</h1>
      <p class="text-gray-600 dark:text-gray-300">Your email has been successfully confirmed.</p>
      <p class="text-gray-600 dark:text-gray-300">You can now log in to your account.</p>
      <RouterLink to="/login"><HButton class="mt-4" label="login" /></RouterLink>
    </div>
  </DefaultLayout>
</template>
