import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import User from '@/views/User.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/user',
    name: 'user',
    component: User,
  },
  // {
  //   path: '/403',
  //   name: 'forbidden',
  //   component: () => import('@/views/403.vue'),
  // },
  // {
  //   path: '/posts',
  //   name: 'posts',
  //   component: () => import('@/views/Posts.vue'),
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guard for protected routes
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // try to load the user
  if (!userStore.user) {
    await userStore.getCurrentUser()
  }

  // redirect to login if there is no user
  if (to.path === '/user' && !userStore.user) {
    return next('/login')
  }

  next()
})

export default router