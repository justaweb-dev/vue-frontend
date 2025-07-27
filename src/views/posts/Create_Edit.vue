<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { usePostStore } from '@/stores/post'
import { useTagStore } from '@/stores/tag'
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HButton, HInput, HInputUpload } from '@justaweb-dev/histoire-library'
import { storeToRefs } from 'pinia'
import { useFileStore } from '@/stores/file'
import { useUserStore } from '@/stores/user'
import type { Tag } from '@/types'

/**
 * API URL for backend requests
 */
const API_URL = import.meta.env.VITE_API_URL

/**
 * Stores and router setup
 */
const postStore = usePostStore()
const { createPost, fetchPostById, updatePost } = postStore
const { post } = storeToRefs(postStore)
const tagStore = useTagStore()
const { fetchAllTags } = tagStore
const { tags } = storeToRefs(tagStore)
const fileStore = useFileStore()
const { uploadFile } = fileStore
const userStore = useUserStore()
const { user, token } = storeToRefs(userStore)
const { loadToken } = userStore
const router = useRouter()
const route = useRoute()

// --- Form state ---
// Form fields for post creation/editing
const title = ref('') // Post title
const body = ref('') // Post body/content
const selectedTags = ref<number[]>([]) // Selected tag IDs
const selectedImages = ref<File[] | File | null>(null) // Images to upload
const mediaIds = ref<(number | string)[]>([]) // Uploaded media IDs
const error = ref('') // Error message
const success = ref('') // Success message

// --- Tag input and dropdown state ---
const tagInput = ref('') // Value of tag input field
const tagInputFocused = ref(false) // Whether tag input is focused
const tagDropdownOpen = ref(false) // Whether tag dropdown is open
const highlightedTagIndex = ref(-1) // Highlighted tag index for keyboard navigation
const isCreatingTag = ref(false) // Loading state for tag creation
const tagError = ref('') // Error message for tag creation

const setTimeoutGlobal = setTimeout

// --- Lifecycle functions ---
onMounted(async () => {
  // On mount, clear media IDs and form state if creating a new post
  mediaIds.value = []
  // Clear post state if creating a new post
  if (!route.params.id) {
    postStore.clearPost()
    title.value = ''
    body.value = ''
    selectedTags.value = []
    selectedImages.value = null
  }
  // Ensure token is loaded and fetch tags (and post if editing)
  if (!token.value) { 
    loadToken() 
  } 
  if (token.value) {
    await fetchAllTags(token.value!)
    if (route.params.id) {
      await fetchPostById(route.params.id as string, token.value!)
      if (post.value) {
        title.value = post.value.title
        body.value = post.value.body
        selectedTags.value = Array.isArray(post.value.tags)
          ? post.value.tags.map((t: any) => typeof t === 'object' ? t.id : t)
          : []
      }
    }
  }
})

// --- Methods ---
// Converts a string to a URL-friendly slug
const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

// --- Form submission handler ---
// Handles post creation or update, including file upload and validation
const handleCreateOrEdit = async () => {
  error.value = ''
  success.value = ''

  // --- Media upload logic ---
  if (selectedImages.value) {
    const files = Array.isArray(selectedImages.value)
      ? selectedImages.value
      : [selectedImages.value]

    // Upload all files in parallel
    const uploadedArr = await Promise.all(files.map(file => uploadFile(file, {refId: post.value?.id || '', ref: 'post', field: 'media'}, token.value as string)))

    // Extract uploaded file IDs
    mediaIds.value = uploadedArr
      .map(uploaded => {
        if (uploaded && typeof uploaded === 'object' && 'id' in uploaded) {
          return uploaded.id
        } else if (typeof uploaded === 'string') {
          return uploaded
        }
        return null
      })
      .filter(Boolean) as (number | string)[]
    
    if (mediaIds.value.length === 0) {
      error.value = 'Image upload failed.'
      return
    }
  }
  // --- Form validation ---
  if (!title.value || !body.value) {
    error.value = 'Title and body are required.'
    return
  }
  const userId = user.value?.id
  if (!userId) {
    error.value = 'You must be logged in to create or edit a post.'
    return
  }
  // --- Prepare payload for API ---
  const tagsDocumentIds = selectedTags.value
    .map(tagId => tags.value.find(t => t.id === tagId)?.documentId)
    .filter(Boolean)
  const payload = {
    title: title.value,
    body: body.value,
    slug: slugify(title.value),
    tags: { set: tagsDocumentIds },
    locale: 'en',
    media: mediaIds.value,
    users_permissions_user: { set: userId },
  }
  // --- Create or update post ---
  if (route.params.id) {
    if (updatePost) {
      const result = await updatePost(route.params.id as string, payload as any, token.value!)
      if (result.success) {
        success.value = 'Post updated successfully!'
        setTimeout(() => router.push('/posts/' + route.params.id), 500)
      } else {
        error.value = result.message || 'Failed to update post.'
      }
    }
  } else {
    const result = await createPost(payload as any, token.value!)
    if (result.success) {
      success.value = 'Post created successfully!'
      setTimeout(() => router.push('/posts'), 500)
    } else {
      error.value = result.message || 'Failed to create post.'
    }
  }
}

// --- Tag dropdown and creation logic ---
// Returns tags that match the input and are not already selected
const filteredTags = computed(() => {
  if (!tagInput.value.trim()) return tags.value.filter(t => !selectedTags.value.includes(t.id))
  return tags.value.filter(
    t =>
      t.name.toLowerCase().includes(tagInput.value.trim().toLowerCase()) &&
      !selectedTags.value.includes(t.id)
  )
})

// Called on input event: opens dropdown and resets highlight
const handleTagInput = () => {
  tagDropdownOpen.value = !!tagInput.value.trim() && filteredTags.value.length > 0
  highlightedTagIndex.value = filteredTags.value.length > 0 ? 0 : -1
}

// Handles keyboard navigation and selection in the dropdown
const handleTagInputKeydown = async (e: KeyboardEvent) => {
  if (!tagDropdownOpen.value || filteredTags.value.length === 0) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightedTagIndex.value = (highlightedTagIndex.value + 1) % filteredTags.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightedTagIndex.value = (highlightedTagIndex.value - 1 + filteredTags.value.length) % filteredTags.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (highlightedTagIndex.value >= 0 && highlightedTagIndex.value < filteredTags.value.length) {
      handleTagSelect(filteredTags.value[highlightedTagIndex.value])
    } else {
      await handleTagInputEnter()
    }
  }
}

// Selects a tag from the dropdown and adds it to the selectedTags list
const handleTagSelect = (tag: Tag) => {
  if (!selectedTags.value.includes(tag.id)) {
    selectedTags.value.push(tag.id)
  }
  tagInput.value = ''
  tagDropdownOpen.value = false
}

// Handles Enter key: selects if tag exists, creates if not
const handleTagInputEnter = async () => {
  const input = tagInput.value.trim()
  if (!input) return
  // If it already exists, select it
  const found = tags.value.find(t => t.name.toLowerCase() === input.toLowerCase())
  if (found) {
    handleTagSelect(found)
    return
  }
  // If it does not exist, create it in the backend and select it
  if (!token.value) {
    loadToken()
    tagError.value = 'No token loaded.'
    return
  }
  isCreatingTag.value = true
  const created = await tagStore.createTag(input, token.value)
  isCreatingTag.value = false
  if (created) {
    selectedTags.value.push(created.id)
    tagInput.value = ''
    await fetchAllTags(token.value)
    tagDropdownOpen.value = false
  } else {
    tagError.value = 'Could not create tag.'
  }
}

// Removes a tag from the selectedTags list
const removeTag = (id: number) => {
  selectedTags.value = selectedTags.value.filter(tid => tid !== id)
}
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto p-4 max-w-xl">
      <h1 class="text-3xl font-bold mb-6">{{ route.params.id ? 'Edit Post' : 'Create Post' }}</h1>
      <form @submit.prevent="handleCreateOrEdit" class="flex flex-col gap-4">
        <HInput v-model="title" class-name="[&_label]:font-semibold" label="Title" id="title" required />
        <label class="font-semibold">Body</label>
        <textarea v-model="body" id="body" rows="6" class="block w-full px-4 py-2 mt-2 text-zinc-800 bg-zinc-100 border border-zinc-400 rounded-md dark:border-zinc-600 focus:border-emerald-400 focus:ring-emerald-300 focus:ring-opacity-40 dark:focus:border-emerald-300 focus:outline-none focus:ring disabled:cursor-not-allowed disabled:opacity-50" required />
        <label class="font-semibold">Tags</label>
        <div class="flex flex-col gap-2 mb-2 relative">
          <HInput
            v-model="tagInput"
            class-name="[&_label]:font-semibold"
            label="Nuevo tag o selecciona existentes"
            id="new-tag"
            placeholder="Escribe para buscar o crear tag"
            @focus="tagInputFocused = true; handleTagInput()"
            @blur="setTimeoutGlobal(() => { tagDropdownOpen = false }, 200)"
            @input="handleTagInput"
            @keydown="handleTagInputKeydown"
            @keyup.enter="handleTagInputEnter"
            :disabled="isCreatingTag"
          />
          <div v-if="tagDropdownOpen && filteredTags.length > 0" class="absolute top-full z-10 bg-white border border-zinc-300 rounded shadow w-full max-h-48 overflow-auto">
            <div
              v-for="(tag, i) in filteredTags"
              :key="tag.id"
              class="px-3 py-2 cursor-pointer text-zinc-800 hover:bg-emerald-100"
              :class="{ 'bg-emerald-200': highlightedTagIndex === i }"
              @mousedown.prevent="handleTagSelect(tag)"
            >
              {{ tag.name }}
            </div>
          </div>
          <div v-if="tagError" class="text-red-600">{{ tagError }}</div>
        </div>
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="tagId in selectedTags"
            :key="tagId"
            class="px-2 py-1 rounded bg-emerald-600 dark:text-zinc-800 dark:bg-emerald-200 text-white flex items-center gap-1"
          >
            {{ tags.find(t => t.id === tagId)?.name || tagId }}
            <button type="button" class="ml-1 text-xs cursor-pointer" @click="removeTag(tagId)">×</button>
          </span>
        </div>
        <div v-if="Array.isArray(post?.media) && post.media.length > 0" class="mt-6 flex flex-col gap-2">
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
          v-model="selectedImages as any"
          :multiple="true"
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
