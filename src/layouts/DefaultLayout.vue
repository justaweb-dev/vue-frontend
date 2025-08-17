<script setup lang="ts">
import RunAgentButton from '@/components/runAgentButton.vue'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { HButton, HNavbar, type ImageType } from '@justaweb-dev/histoire-library'
import { useDark, useToggle } from '@vueuse/core'
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

/**
 * Stores
 */
const userStore = useUserStore()
const { getCurrentUser, logout } = userStore

/**
 * Route handling
 */
const route = useRoute()

/**
 * Reactive variables
 */
const isDark = useDark()
const toggleDark = useToggle(isDark)

/**
 * Computed variables
 */
const user = computed(() => userStore.user)

const logo = {
  src: 'https://images.seeklogo.com/logo-png/8/1/lorem-ipsum-logo-png_seeklogo-85587.png',
  alt: 'Logo',
} as ImageType
const menuList = computed(() =>
  user.value && user.value.username
    ? [
        { label: 'Posts', path: '/posts' },
        { label: 'User', path: '/user' },
      ]
    : [],
)

/**
 * Lifecycle hooks
 */
onMounted(async () => {
  if (!user.value) {
    await getCurrentUser()
  }
})

const handleLogout = async () => {
  await logout()
  router.push('/')
}
</script>

<template>
  <div
    class="h-full min-h-screen w-full text-black bg-zinc-150 dark:bg-zinc-700! dark:text-white"
  >
    <HNavbar :menu="menuList">
       <template #logo>
        <RouterLink 
          :to="user && user.username ? '/user' : '/'"
          class="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
        >
          <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">JW</span>
          </div>
          <span>JustAWebDev</span>
        </RouterLink>
      </template>
      <template #menuList>
        <!-- <li>
          <RunAgentButton />
        </li> -->
        <li v-for="item in menuList" :key="item.label">
          <RouterLink
            :to="item.path"
            class="text-zinc-700 transition hover:text-emerald-500 dark:text-zinc-200 dark:hover:text-emerald-400"
          >
            {{ item.label }}
          </RouterLink>
        </li>
        <li>
          <FontAwesomeIcon
            class="cursor-pointer text-zinc-700 dark:text-white"
            :icon="isDark ? faSun : faMoon"
            @click="toggleDark()"
          />
        </li>
        <template v-if="user">
          <li>
            <HButton label="logout" @click="handleLogout" />
          </li>
        </template>
        <template v-else>
          <li v-if="route.name !== 'login'">
            <RouterLink to="/login"><HButton label="login" /></RouterLink>
          </li>
          <li v-if="route.name !== 'register'">
            <RouterLink to="/register"><HButton label="register" /></RouterLink>
          </li>
        </template>
      </template>
    </HNavbar>
    <slot />
  </div>
</template>
