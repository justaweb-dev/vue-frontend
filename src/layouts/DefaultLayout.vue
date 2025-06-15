<script setup lang="ts">
import { HNavbar } from '@justawebdev/histoire-library'
import { RouterLink } from 'vue-router';

const logo = { src: 'https://images.seeklogo.com/logo-png/8/1/lorem-ipsum-logo-png_seeklogo-85587.png', alt: 'Logo' } as ImageType
const menuList = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
]
</script>

<template>
  <div class="w-full h-full min-h-screen bg-zinc-100 text-black dark:bg-zinc-900 dark:text-white">
    <HNavbar :menu="menuList">
      <template #logo>
        <img :src="logo.src" :alt="logo.alt" class="h-8 w-auto" />
      </template>
      <template #menuList>
        <li v-for="item in menuList" :key="item.label">
          <RouterLink :to="item.path"
            class="text-gray-700 dark:text-gray-200 hover:text-sky-500 dark:hover:text-sky-400 transition">
            {{ item.label }}
          </RouterLink>
        </li>
      </template>
    </HNavbar>
    <slot />
  </div>
</template>