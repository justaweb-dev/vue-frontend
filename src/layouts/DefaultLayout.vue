<script setup lang="ts">
import RunAgentButton from '@/components/runAgentButton.vue'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { HButton, HNavbar } from '@justaweb-dev/histoire-library'
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
    class="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-300"
  >
    <!-- Modern Header -->
    <header class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
      <HNavbar :menu="menuList" class="nav-modern">
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
        <li v-if="user" class="ai-agent-nav-item">
          <RunAgentButton />
        </li>
        <li v-for="item in menuList" :key="item.label">
          <RouterLink
            :to="item.path"
            class="nav-link px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 font-medium"
            :class="{ 'active': route.path === item.path }"
          >
            {{ item.label }}
          </RouterLink>
        </li>
        <li>
          <button
            @click="toggleDark()"
            class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <FontAwesomeIcon
              :icon="isDark ? faSun : faMoon"
              class="w-5 h-5"
            />
          </button>
        </li>
        <template v-if="user">
          <li>
            <HButton 
              label="Logout" 
              @click="handleLogout" 
              variant="outline"
              class="logout-btn"
            />
          </li>
        </template>
        <template v-else>
          <li v-if="route.name !== 'login'">
            <RouterLink to="/login">
              <HButton label="Login" variant="outline" />
            </RouterLink>
          </li>
          <li v-if="route.name !== 'register'">
            <RouterLink to="/register">
              <HButton label="Register" variant="primary" />
            </RouterLink>
          </li>
        </template>
      </template>
    </HNavbar>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Modern Footer -->
    <footer class="mt-auto border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="text-sm text-slate-600 dark:text-slate-400">
            © 2024 JustAWebDev. Built with Vue 3 & AI.
          </div>
          <div class="flex space-x-4 text-sm text-slate-600 dark:text-slate-400">
            <a href="#" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Privacy
            </a>
            <a href="#" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Terms
            </a>
            <a href="#" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
