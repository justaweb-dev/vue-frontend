import { useUserStore } from '@/stores/user'
import Home from '@/views/Home.vue'
import User from '@/views/User.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
  {
    path: '/email-confirmation',
    name: 'email-confirmation',
    component: () => import('@/views/auth/EmailConfirmation.vue'),
  },
  {
    path: '/user/resetpassword',
    name: 'resetpassword',
    component: () => import('@/views/auth/ResetPassword.vue'),
  },
  // {
  //   path: '/403',
  //   name: 'forbidden',
  //   component: () => import('@/views/403.vue'),
  // },
  {
    path: '/posts',
    name: 'posts',
    component: () => import('@/views/posts/Index.vue'),
  },
  {
    path: '/posts/:id',
    name: 'post',
    component: () => import('@/views/posts/Post.vue'),
  },
  {
    path: '/tags/:id',
    name: 'tag',
    component: () => import('@/views/tags/Tag.vue'),
  },
  {
    path: '/posts/create',
    name: 'create-post',
    component: () => import('@/views/posts/Create_Edit.vue'),
  },
  {
    path: '/posts/edit/:id',
    name: 'edit-post',
    component: () => import('@/views/posts/Create_Edit.vue'),
  },
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
