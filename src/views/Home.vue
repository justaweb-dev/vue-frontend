<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { HButton, HHero, type ImageType } from '@justawebdev/histoire-library'
import { RouterLink } from 'vue-router'

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
        <RouterLink to="/about">
          <HButton label="Learn More" />
        </RouterLink>
      </template>
    </HHero>
  </DefaultLayout>
</template>
