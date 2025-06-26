<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { usePostStore } from '@/stores/post'
import { HTable, HPagination } from '@justawebdev/histoire-library'
import { storeToRefs } from 'pinia'
import { watch, onMounted, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/**
 * Stores
 */
const postStore = usePostStore()
const { fetchAllPosts } = postStore
const { currentPage, posts, totalPosts } = storeToRefs(postStore)

const postsPerPage = 10

// Reads the current page from the query parameter and fetches posts
onMounted(async () => {
  const pageFromQuery = parseInt(route.query.page as string)
  if (pageFromQuery && pageFromQuery > 0) currentPage.value = pageFromQuery
  await fetchAllPosts(currentPage.value, postsPerPage)
})

// When currentPage changes, update the URL and fetch posts
watch(currentPage, async (newPage) => {
  router.replace({ query: { ...route.query, page: String(newPage) } })
  await fetchAllPosts(newPage, postsPerPage)
})

const postsSorted = computed(() => {
  return [...posts.value].sort((a, b) => a.title.localeCompare(b.title))
})
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4">
      <div class="flex flex-row justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">Posts</h1>
        <RouterLink
          to="/posts/create"
          class="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
        >
          Create Post
        </RouterLink>
      </div>
      <p v-if="postsSorted.length === 0" class="mt-4 text-gray-500">
        No posts available.
      </p>
      <HTable
        v-model:current-page="currentPage"
        :rows="postsSorted"
        :columns="[{ key: 'title', label: 'Title' }]"
        :rows-per-page="postsPerPage"
        :total-items="totalPosts"
      >
        <template #cell-title="{ value, row }">
          <RouterLink
            :to="`/posts/${row.documentId}`"
            class="font-bold text-sky-700 hover:underline"
          >
            <pre>{{ row.title }}</pre>
          </RouterLink>
        </template>
      </HTable>
      <HPagination
        v-if="totalPosts > postsPerPage"
        v-model:currentPage="currentPage"
        :rows-per-page="postsPerPage"
        :total-items="totalPosts"
      />
    </div>
  </DefaultLayout>
</template>
