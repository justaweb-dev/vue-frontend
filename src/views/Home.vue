<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useUserStore } from '@/stores/user'
import { HButton, HHero, type ImageType } from '@justaweb-dev/histoire-library'
import { storeToRefs } from 'pinia'

/**
 * Stores
 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const image = {
  src: 'https://fastly.picsum.photos/id/3/5000/3333.jpg?hmac=GDjZ2uNWE3V59PkdDaOzTOuV3tPWWxJSf4fNcxu4S2g',
  alt: 'Hero Image',
} as ImageType
</script>

<template>
  <DefaultLayout>
    <HHero
      title="Welcome to Histoire Component Library"
      description="A collection of reusable components"
    >
      <template #image>
        <img
          :src="image.src"
          :alt="image.alt"
          class="h-full w-full rounded-lg object-cover shadow-lg"
        />
      </template>
      <template #cta>
        <RouterLink :to="user && user.username ? '/user' : '/login'" class="w-fit">
          <HButton label="Start now" />
        </RouterLink>
      </template>
    </HHero>
  </DefaultLayout>
</template>
