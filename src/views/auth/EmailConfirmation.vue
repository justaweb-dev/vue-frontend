<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { HButton } from '@justaweb-dev/histoire-library'
import { RouterLink } from 'vue-router'
</script>

<template>
  <DefaultLayout>
    <div
      class="flex flex-col gap-4 max-w-md mx-auto mt-12 p-8 bg-white dark:bg-zinc-800 rounded shadow text-center"
    >
      <h1 class="text-2xl font-bold mb-4 text-zinc-800 dark:text-white">
        Email confirmed
      </h1>
      <p class="text-zinc-600 dark:text-zinc-300">
        Your email has been successfully confirmed.
      </p>
      <p class="text-zinc-600 dark:text-zinc-300">
        You can now log in to your account.
      </p>
      <div class="flex justify-center w-full">
        <RouterLink to="/login" class="w-fit"
        ><HButton class="mt-4" label="login"
        /></RouterLink>
      </div>
    </div>
  </DefaultLayout>
</template>
