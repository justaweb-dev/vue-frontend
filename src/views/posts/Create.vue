<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { usePostStore } from '@/stores/post'
import { useTagStore } from '@/stores/tag'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { HButton, HInput, HInputUpload } from '@justawebdev/histoire-library'
import { storeToRefs } from 'pinia'
import { useFileStore } from '@/stores/file'

const postStore = usePostStore()
const { createPost } = postStore
const tagStore = useTagStore()
const { fetchAllTags } = tagStore
const { tags } = storeToRefs(tagStore)
const router = useRouter()
const fileStore = useFileStore()
const { uploadFile } = fileStore
const selectedImage = ref<File | null>(null)

const title = ref('')
const body = ref('')
const selectedTags = ref<number[]>([])
const error = ref('')
const success = ref('')

onMounted(async () => {
  await fetchAllTags()
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

const handleCreate = async () => {
  error.value = ''
  success.value = ''
  let mediaId = null
  if (selectedImage.value) {
    const uploaded = await uploadFile(selectedImage.value)
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
  const payload = {
    title: title.value,
    body: body.value,
    slug: slugify(title.value),
    tags: selectedTags.value,
    locale: 'en',
    media: mediaId ? [mediaId] : [],
  }
  const result = await createPost(payload as any)
  if (result.success) {
    success.value = 'Post created successfully!'
    setTimeout(() => router.push('/posts'), 500)
  } else {
    error.value = result.message || 'Failed to create post.'
  }
}
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4 max-w-xl">
      <h1 class="text-3xl font-bold mb-6">Create Post</h1>
      <form @submit.prevent="handleCreate" class="flex flex-col gap-4">
        <HInput v-model="title" class-name="[&_label]:font-semibold" label="Title" id="title" required />
        <label class="font-semibold">Body</label>
        <textarea v-model="body" id="body" rows="6" class="border rounded p-2" required />
        <label class="font-semibold">Tags</label>
        <select v-model="selectedTags" multiple class="border rounded p-2">
          <option v-for="tag in tags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>
        <HInputUpload
          v-model="selectedImage"
          class-name="[&_label]:font-semibold"
          label="Upload Image"
          id="image"
          :allowed-files="'image/*'"
        />
        <HButton label="Create Post" class-name="mt-4" />
        <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
        <div v-if="success" class="text-green-600 mt-2">{{ success }}</div>
      </form>
    </div>
  </DefaultLayout>
</template>
