<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import { HTable, HPagination, HButton } from '@justaweb-dev/histoire-library'
import { storeToRefs } from 'pinia'
import { watch, onMounted, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/**
 * Stores
 */
const postStore = usePostStore()
const userStore = useUserStore()
const { fetchAllPosts } = postStore
const { token } = storeToRefs(userStore)
const {loadToken} = userStore
const { currentPage, posts, totalPosts } = storeToRefs(postStore)

const postsPerPage = 10

const postsSorted = computed(() => {
  return [...posts.value].sort((a, b) => a.title.localeCompare(b.title))
})

// Reads the current page from the query parameter and fetches posts
onMounted(async () => {
  if (!token.value) { 
    loadToken() 
  } 
  const pageFromQuery = parseInt(route.query.page as string)
  if (pageFromQuery && pageFromQuery > 0) currentPage.value = pageFromQuery
  if (token.value) {
    await fetchAllPosts(currentPage.value, postsPerPage, token.value)
  }
})

// When currentPage changes, update the URL and fetch posts
watch(currentPage, async (newPage) => {
  router.replace({ query: { ...route.query, page: String(newPage) } })
  if (!token.value) { 
    loadToken()
  }
  if (token.value) {
    await fetchAllPosts(newPage, postsPerPage, token.value)
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4">
      <div class="flex flex-row justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">Posts</h1>
        <RouterLink
          to="/posts/create"
        >
          <HButton label="Create Post" />
        </RouterLink>
      </div>
      <p v-if="posts.length === 0" class="mt-4 text-zinc-500">
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
            class="font-bold text-emerald-700 hover:underline"
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
