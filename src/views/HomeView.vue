<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { HHero, HNavbar, type ImageType } from '@justawebdev/histoire-library';

const logo = { src: 'https://images.seeklogo.com/logo-png/8/1/lorem-ipsum-logo-png_seeklogo-85587.png', alt: 'Logo' } as ImageType
const menuList = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
]
const image = { src: 'https://fastly.picsum.photos/id/3/5000/3333.jpg?hmac=GDjZ2uNWE3V59PkdDaOzTOuV3tPWWxJSf4fNcxu4S2g', alt: 'Hero Image' } as ImageType
</script>

<template>
  <DefaultLayout>
    <HNavbar :menu="menuList">
      <template #logo>
        <img :src="logo.src" :alt="logo.alt" class="h-8 w-auto" />
      </template>
    </HNavbar>
    <HHero class="text-red-500" title="Welcome to Histoire Component Library"
      description="A collection of reusable components">
      <template #image>
        <img :src="image.src" :alt="image.alt" class="object-cover w-full h-full rounded-lg shadow-lg" />
      </template>
    </HHero>
  </DefaultLayout>
</template>