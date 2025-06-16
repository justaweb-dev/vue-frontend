<script setup lang="ts">
import { HButton, HNavbar, type ImageType } from '@justawebdev/histoire-library'
import { RouterLink } from 'vue-router'

const logo = {
  src: 'https://images.seeklogo.com/logo-png/8/1/lorem-ipsum-logo-png_seeklogo-85587.png',
  alt: 'Logo',
} as ImageType
const menuList = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
]
const user = null
</script>

<template>
  <div
    class="h-full min-h-screen w-full bg-zinc-100 text-black dark:bg-zinc-900 dark:text-white"
  >
    <HNavbar :menu="menuList">
      <template #logo>
        <img :src="logo.src" :alt="logo.alt" class="h-8 w-auto" />
      </template>
      <template #menuList>
        <li v-for="item in menuList" :key="item.label">
          <RouterLink
            :to="item.path"
            class="text-gray-700 transition hover:text-sky-500 dark:text-gray-200 dark:hover:text-sky-400"
          >
            {{ item.label }}
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/login" v-if="!user"
            ><HButton label="login"
          /></RouterLink>
        </li>
        <li>
          <RouterLink to="/register" v-if="!user"
            ><HButton label="register"
          /></RouterLink>
        </li>
      </template>
    </HNavbar>
    <slot />
  </div>
</template>
