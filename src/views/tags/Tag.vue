<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import type { Tag } from '@/types'
import { HCard } from '@justawebdev/histoire-library'
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

/**
 * API URL
 */
const API_URL = import.meta.env.VITE_API_URL

const route = useRoute()
const tag = ref<Tag | null>(null)

async function fetchTag() {
  try {
    const res = await fetch(
      `${API_URL}/api/tags/${route.params.id}?populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    )

    const data = await res.json()
    console.log('Fetched tag data:', data)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    tag.value = { id: data.data.id, ...data.data }
  } catch (e) {
    console.error('Error loading tag:', e)
    tag.value = null
  }
}

onMounted(async () => {
  await fetchTag()
})
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4">
      <div v-if="tag">
        <h1 class="text-3xl font-bold mb-8">{{ tag.name }}</h1>
        <div v-if="tag.posts.length">
          <h2 class="text-xl font-semibold mb-4">Posts with this tag:</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:!gap-6">
            <HCard
              v-for="post in tag.posts"
              :key="post.id"
              :title="post.title"
              :body="post.body.substring(0, 100) + '...'"
              :link="`/posts/${post.documentId}`"
              :date="post.createdAt"
            >
              <template #title>
                <RouterLink
                  :to="`/posts/${post.documentId}`"
                  class="text-xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline"
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
                  <span class="font-bold text-gray-700 dark:text-gray-200">
                    {{ post.author?.name || 'Unknown Author' }}
                  </span>
                </div>
              </template>
              <template #link>
                <div class="flex items-center justify-between mt-4">
                  <RouterLink
                    :to="`/posts/${post.documentId}`"
                    class="text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Read more
                  </RouterLink>
                </div>
              </template>
            </HCard>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-10 text-red-500">
        Error loading tag data.
      </div>
    </div>
  </DefaultLayout>
</template>
