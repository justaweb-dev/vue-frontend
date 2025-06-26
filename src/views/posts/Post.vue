<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { usePostStore } from '@/stores/post'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

/**
 * API URL
 */
const API_URL = import.meta.env.VITE_API_URL

/**
 * Route
 */
const route = useRoute()

/**
 * Stores
 */
const postStore = usePostStore()
const { fetchPostById } = postStore

/**
 * Lifcycle hooks
 */
onMounted(async () => {
  await fetchPostById(route.params.id as string)
})
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4">
      <div v-if="postStore.loading" class="text-center py-10 text-gray-500">
        Loading post...
      </div>
      <div v-else-if="postStore.error" class="text-center py-10 text-red-500">
        {{ postStore.error }}
      </div>
      <div v-else-if="postStore.post">
        <h1 class="text-3xl font-bold mb-4">{{ postStore.post.title }}</h1>
        <div
          v-if="postStore.post.media && postStore.post.media.length"
          class="mb-4 flex flex-wrap gap-4"
        >
          <img
            v-for="media in postStore.post.media"
            :src="API_URL + media.url"
            :alt="media.alternativeText || postStore.post.title"
            class="rounded shadow max-h-64"
          />
        </div>
        <div
          class="prose dark:prose-invert mb-4"
          v-html="postStore.post.body"
        ></div>
        <div
          v-if="postStore.post.tags && postStore.post.tags.length"
          class="mt-4"
        >
          <RouterLink
            v-for="tag in postStore.post.tags"
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
