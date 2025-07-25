<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { usePostStore } from '@/stores/post'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { HButton } from '@justaweb-dev/histoire-library'
import { VueMarkdownIt } from '@f3ve/vue-markdown-it'

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

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isAuthor = computed(() => {
  if (!user.value || !post.value) return false
  const userField = post.value.users_permissions_user
  if (typeof userField === 'object' && userField !== null && 'id' in userField) {
    return user.value.id === userField.id
  }
  return user.value.id === userField
})

/**
 * Lifecycle hooks
 */
onMounted(async () => {
  await fetchPostById(route.params.id as string)
})
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4 relative">
      <div v-if="post">
        <div class="flex flex-row justify-between items-center mb-4">
          <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
          <HButton
            v-if="isAuthor && post && post.documentId"
            label="Edit"
            @click="$router.push(`/posts/edit/${post.documentId}`)"
          />
        </div>
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
        <vue-markdown-it :source="post.body" class="prose dark:prose-invert pt-4 pb-8 *:mb-4" />
        <!-- <div class="prose dark:prose-invert mb-4" v-html="post.body"></div> -->
        <div v-if="Array.isArray(post.tags) && post.tags.length" class="mt-4">
          <RouterLink
            v-for="tag in post.tags"
            :key="typeof tag === 'object' ? (tag as any).id : tag"
            class="inline-block bg-emerald-100 text-emerald-700 rounded px-2 py-1 mr-2 text-xs"
            :to="typeof tag === 'object' ? `/tags/${(tag as any).documentId}` : '#'"
          >{{ typeof tag === 'object' ? (tag as any).name : tag }}</RouterLink>
        </div>
      </div>
      <div v-else class="text-center py-10 text-red-500">
        Error loading post data.
      </div>
    </div>
  </DefaultLayout>
</template>
