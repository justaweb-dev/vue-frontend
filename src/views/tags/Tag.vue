<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useTagStore } from '@/stores/tag'
import { HCard, HPagination } from '@justaweb-dev/histoire-library'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

/**
 * API URL
 */
const API_URL = import.meta.env.VITE_API_URL

const route = useRoute()
const tagStore = useTagStore()
const { fetchTagById } = tagStore
const { tag, tagPosts } = storeToRefs(tagStore)

const currentPage = ref(1)
const rowsPerPage = 10

const paginatedPosts = computed(() => {
  if (!tagPosts.value) return []
  const start = (currentPage.value - 1) * rowsPerPage
  const end = start + rowsPerPage
  return tagPosts.value.slice(start, end)
})

onMounted(async () => {
  await fetchTagById(route.params.id as string)
})
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4">
      <div v-if="tag">
        <h1 class="text-3xl font-bold mb-8">{{ tag.name }}</h1>
        <div v-if="tagPosts.length">
          <h2 class="text-xl font-semibold mb-4">Posts with this tag:</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:!gap-6">
            <HCard
              v-for="post in paginatedPosts"
              :key="post.id"
              :title="post.title"
              :body="post.body.substring(0, 100) + '...'"
              :link="`/posts/${post.documentId}`"
              :date="post.createdAt"
            >
              <template #title>
                <RouterLink
                  :to="`/posts/${post.documentId}`"
                  class="text-xl font-bold text-zinc-700 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-200 hover:underline"
                >
                  {{ post.title }}
                </RouterLink>
              </template>
              <template #bottom-right>
                <div class="flex items-center">
                  <img
                    v-if="post.author?.avatar"
                    class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                    :src="`${API_URL}/${post.author.avatar.url}`"
                    :alt="post.author.name"
                  />
                  <span class="font-bold text-zinc-700 dark:text-zinc-200">
                    {{ post.author?.name || 'Unknown Author' }}
                  </span>
                </div>
              </template>
              <template #link>
                <div class="flex items-center justify-between mt-4">
                  <RouterLink
                    :to="`/posts/${post.documentId}`"
                    class="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Read more
                  </RouterLink>
                </div>
              </template>
            </HCard>
          </div>
        </div>
        <div v-if="tagPosts.length > rowsPerPage" class="mt-6">
          <HPagination
            :current-page="currentPage"
            :rows-per-page="rowsPerPage"
            :total-items="tagPosts.length"
            @update:currentPage="(val) => (currentPage = val)"
          />
        </div>
      </div>
      <div v-else class="text-center py-10 text-red-500">
        Error loading tag data.
      </div>
    </div>
  </DefaultLayout>
</template>
