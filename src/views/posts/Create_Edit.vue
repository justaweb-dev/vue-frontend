<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { usePostStore } from '@/stores/post'
import { useTagStore } from '@/stores/tag'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HButton, HInput, HInputUpload } from '@justawebdev/histoire-library'
import { storeToRefs } from 'pinia'
import { useFileStore } from '@/stores/file'
import { useUserStore } from '@/stores/user'

/**
 * API URL
 */
const API_URL = import.meta.env.VITE_API_URL

const postStore = usePostStore()
const { createPost, fetchPostById, updatePost } = postStore
const { post } = storeToRefs(postStore)
const tagStore = useTagStore()
const { fetchAllTags } = tagStore
const { tags } = storeToRefs(tagStore)
const router = useRouter()
const route = useRoute()
const fileStore = useFileStore()
const { uploadFile } = fileStore
const usersStore = useUserStore()
const { user } = usersStore
const selectedImage = ref<File | null>(null)

const title = ref('')
const body = ref('')
const selectedTags = ref<number[]>([])
const error = ref('')
const success = ref('')

onMounted(async () => {
  await fetchAllTags()
  // Si es edición, cargar datos del post
  if (route.params.id) {
    await fetchPostById(route.params.id as string)
    if (post.value) {
      title.value = post.value.title
      body.value = post.value.body
      selectedTags.value = Array.isArray(post.value.tags)
        ? post.value.tags.map((t: any) => typeof t === 'object' ? t.id : t)
        : []
    }
  }
})

const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const handleCreateOrEdit = async () => {
  error.value = ''
  success.value = ''
  let mediaId = null
  if (selectedImage.value) {
    const file = selectedImage.value
    const uploaded = await uploadFile(file)
    if (uploaded && typeof uploaded === 'object' && 'id' in uploaded) {
      mediaId = uploaded.id
    } else if (typeof uploaded === 'string') {
      mediaId = uploaded
    } else {
      error.value = 'Image upload failed.'
      return
    }
  }
  if (!title.value || !body.value) {
    error.value = 'Title and body are required.'
    return
  }
  const userId = user?.id
  if (!userId) {
    error.value = 'You must be logged in to create or edit a post.'
    return
  }
  const tagsDocumentIds = selectedTags.value
    .map(tagId => tags.value.find(t => t.id === tagId)?.documentId)
    .filter(Boolean)
  const payload = {
    title: title.value,
    body: body.value,
    slug: slugify(title.value),
    tags: { set: tagsDocumentIds },
    locale: 'en',
    media: mediaId ? [mediaId] : [],
    users_permissions_user: { set: userId },
  }
  // Si es edición, llamar a updatePost, si no, createPost
  if (route.params.id) {
    // Falta implementar updatePost en el store
    if (updatePost) {
      const result = await updatePost(route.params.id as string, payload as any)
      if (result.success) {
        success.value = 'Post updated successfully!'
        setTimeout(() => router.push('/posts/' + route.params.id), 500)
      } else {
        error.value = result.message || 'Failed to update post.'
      }
    }
  } else {
    const result = await createPost(payload as any)
    if (result.success) {
      success.value = 'Post created successfully!'
      setTimeout(() => router.push('/posts'), 500)
    } else {
      error.value = result.message || 'Failed to create post.'
    }
  }
}
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4 max-w-xl">
      <h1 class="text-3xl font-bold mb-6">{{ route.params.id ? 'Edit Post' : 'Create Post' }}</h1>
      <form @submit.prevent="handleCreateOrEdit" class="flex flex-col gap-4">
        <HInput v-model="title" class-name="[&_label]:font-semibold" label="Title" id="title" required />
        <label class="font-semibold">Body</label>
        <textarea v-model="body" id="body" rows="6" class="block w-full px-4 py-2 mt-2 text-gray-800 bg-zinc-100 border border-gray-400 rounded-md dark:border-gray-600 focus:border-sky-400 focus:ring-sky-300 focus:ring-opacity-40 dark:focus:border-sky-300 focus:outline-none focus:ring disabled:cursor-not-allowed disabled:opacity-50" required />
        <label class="font-semibold">Tags</label>
        <select v-model="selectedTags" multiple class="block w-full px-4 py-2 mt-2 text-gray-800 bg-zinc-100 border border-gray-400 rounded-md dark:border-gray-600 focus:border-sky-400 focus:ring-sky-300 focus:ring-opacity-40 dark:focus:border-sky-300 focus:outline-none focus:ring disabled:cursor-not-allowed disabled:opacity-50">
          <option v-for="tag in tags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>
        <pre>post: {{ post }}</pre>
        <div v-if="post?.media?.length > 0" class="mt-6 flex flex-col gap-2">
          <div class="flex gap-2 items-start">
            <img
              :src="API_URL + post.media[0].url"
              :alt="post.media[0].name || 'Post Picture'"
              class="w-auto h-48 object-cover"
            />
            <!-- <button
              @click="showRemoveImageModal = true"
              class="text-red-700 hover:text-red-500 transition duration-200 cursor-pointer"
              title="Remove file"
            >
              <FontAwesomeIcon :icon="faTrash" />
            </button> -->
          </div>
        </div>
        <HInputUpload
          v-else
          v-model="selectedImage"
          id="post-image-upload"
          label="Upload Image"
          class-name="[&_label]:font-semibold"
          :allowed-files="'image/*'"
        />
        <HButton :label="route.params.id ? 'Update' : 'Create Post'" class-name="mt-4" />
        <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
        <div v-if="success" class="text-green-600 mt-2">{{ success }}</div>
      </form>
    </div>
  </DefaultLayout>
</template>
