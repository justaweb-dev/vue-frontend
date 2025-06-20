<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import type { Post } from '@/types'
import { HTable } from '@justawebdev/histoire-library'
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const posts = ref<Post[]>([])
const totalPosts = ref(0)
const postsPerPage = 10

// Página actual sincronizada con la query param "page"
const currentPage = ref(1)
const totalItems = ref(0)

// Función para hacer fetch paginado a Strapi
async function fetchPosts(page = 1) {
  try {
    const res = await fetch(
      `http://localhost:1337/api/posts?pagination[page]=${page}&pagination[pageSize]=${postsPerPage}&populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    )
    const data = await res.json()
    if (!res.ok) {
      posts.value = []
      totalPosts.value = 0
      return
    }
    posts.value = data.data
    totalPosts.value = data.meta.pagination.total
    totalItems.value = data.meta.pagination.total
    currentPage.value = page
    console.log('Posts fetched:', posts.value)
  } catch (e) {
    posts.value = []
    totalPosts.value = 0
  }
}

// Lee la página actual del query param y hace fetch
onMounted(() => {
  const pageFromQuery = parseInt(route.query.page as string)
  if (pageFromQuery && pageFromQuery > 0) currentPage.value = pageFromQuery
  fetchPosts(currentPage.value)
})

// Al cambiar currentPage, actualizamos URL y hacemos fetch
watch(currentPage, (newPage) => {
  router.replace({ query: { ...route.query, page: String(newPage) } })
  fetchPosts(newPage)
})
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Posts</h1>
      <p v-if="posts.length === 0" class="mt-4 text-gray-500">
        No posts available.
      </p>
      <HTable
        v-else
        v-model:current-page="currentPage"
        :rows="posts"
        :columns="[
          { key: 'title', label: 'Title' }
        ]"
        :rows-per-page="postsPerPage"
        :total-items="totalItems"
      />
    </div>
  </DefaultLayout>
</template>
