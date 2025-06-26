<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { usePostStore } from '@/stores/post'
import { storeToRefs } from 'pinia'
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
const { post } = storeToRefs(postStore)

/**
 * Lifecycle hooks
 */
onMounted(async () => {
  await fetchPostById(route.params.id as string)
})
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4">
      <div v-if="post">
        <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
        <div
          v-if="Array.isArray(post.media) && post.media.length"
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
        <div v-if="Array.isArray(post.tags) && post.tags.length" class="mt-4">
          <RouterLink
            v-for="tag in post.tags"
            :key="typeof tag === 'object' && tag.id ? tag.id : tag"
            class="inline-block bg-sky-100 text-sky-700 rounded px-2 py-1 mr-2 text-xs"
            :to="
              typeof tag === 'object' && tag.documentId
                ? `/tags/${tag.documentId}`
                : '#'
            "
            >{{ typeof tag === 'object' && tag.name ? tag.name : tag }}
          </RouterLink>
        </div>
      </div>
      <div v-else class="text-center py-10 text-red-500">
        Error loading post data.
      </div>
    </div>
  </DefaultLayout>
</template>
