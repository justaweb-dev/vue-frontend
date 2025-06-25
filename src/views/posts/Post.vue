<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import type { Post } from '@/types'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

/**
 * API URL
 */
const API_URL = import.meta.env.VITE_API_URL

const route = useRoute()
const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref('')

async function fetchPost() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(
      `http://localhost:1337/api/posts/${route.params.id}?populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    )

    const data = await res.json()
    console.log('Fetched post data:', data)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    post.value = data.data
  } catch (e: any) {
    console.error('Error loading post:', e)
    error.value = e.message || 'Error loading post.'
    post.value = null
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchPost()
})
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4">
      <div v-if="loading" class="text-center py-10 text-gray-500">
        Loading post...
      </div>
      <div v-else-if="error" class="text-center py-10 text-red-500">
        {{ error }}
      </div>
      <div v-else-if="post">
        <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
        <div
          v-if="post.media && post.media.length"
          class="mb-4 flex flex-wrap gap-4"
        >
          <img
            v-for="media in post.media"
            :src="API_URL + media.url"
            :alt="media.alternativeText || post.title"
            class="rounded shadow max-h-64"
          />
        </div>
        <div class="prose dark:prose-invert mb-4" v-html="post.body"></div>
        <div v-if="post.tags && post.tags.length" class="mt-4">
          <RouterLink
            v-for="tag in post.tags"
            :key="tag.id"
            class="inline-block bg-sky-100 text-sky-700 rounded px-2 py-1 mr-2 text-xs"
            :to="`/tags/${tag.documentId}`"
            >{{ tag.name as string }}
          </RouterLink>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
