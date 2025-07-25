<script setup lang="ts">
import { useHasNonSavedChanges } from '@/composables/hasNonSavedChanges'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import router from '@/router'
import { useFileStore } from '@/stores/file'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  HButton,
  HInput,
  HInputUpload,
  HModal,
} from '@justaweb-dev/histoire-library'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

/**
 * API URL
 */
const API_URL = import.meta.env.VITE_API_URL

/**
 * Stores
 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { getCurrentUser, updateUser, changePassword, deleteUser } = userStore
const fileStore = useFileStore()
const { uploadFile, deleteFile } = fileStore

/**
 * Reactive variables
 */
const originalUser = ref<User | null>(null)
const selectedImage = ref<File | null>(null)
const isUploading = ref(false)
const showRemoveImageModal = ref(false)
const showResetModal = ref(false)
const showDeleteAccountModal = ref(false)
// Password change variables
const currentPassword = ref('')
const password = ref('')
const passwordConfirmation = ref('')

/**
 * Composable for checking unsaved changes
 */
const { hasChanges, resetChanges } = useHasNonSavedChanges(user)

/**
 * lifecycle hooks
 */
onMounted(async () => {
  if (user.value) {
    originalUser.value = JSON.parse(JSON.stringify(user.value))
  } else {
    await getCurrentUser()
  }
})

/**
 * Methods
 */
const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedImage.value = file
  }
}

const handleUserUpdate = async () => {
  if (selectedImage.value) {
    isUploading.value = true
    try {
      const uploadedImage = await uploadFile(selectedImage.value, {
        ref: 'plugin::users-permissions.user',
        refId: user.value.id,
        field: 'image',
      })
      if (uploadedImage) {
        await updateUser(user.value.id, {
          user: user.value,
          image: uploadedImage,
        })
        await getCurrentUser()
        hasChanges.value = false
        selectedImage.value = null
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      isUploading.value = false
    }
  }
}

const handleRemoveImage = async () => {
  if (user.value.image) {
    try {
      await deleteFile(user.value.image.id)
      await updateUser(user.value.id, { ...user.value, image: null })
      await getCurrentUser()
      showRemoveImageModal.value = false

      hasChanges.value = false
      selectedImage.value = null
    } catch (error) {
      console.error('Error removing image:', error)
    }
  }
}

const handleChangePassword = async () => {
  if (
    !currentPassword.value ||
    !password.value ||
    !passwordConfirmation.value
  ) {
    alert('All fields are required.')
    return
  }
  if (password.value !== passwordConfirmation.value) {
    alert('Passwords do not match.')
    return
  }

  try {
    await changePassword(
      currentPassword.value,
      password.value,
      passwordConfirmation.value,
    )

    showResetModal.value = false
    currentPassword.value = ''
    password.value = ''
    passwordConfirmation.value = ''
  } catch (error) {
    console.error('Error changing password:', error)
    alert(error.message)
  }
}

const handleDeleteAccount = async () => {
  try {
    await deleteUser(user.value.id)
    showDeleteAccountModal.value = false
    // Redirect to home or login page after deletion
    router.push('/')
  } catch (error) {
    console.error('Error deleting account:', error)
    alert(error.message)
  }
}

watch(selectedImage, (newImage, _oldImage) => {
  const hadNoImageBefore = user.value.image === null
  const hasNewImageNow = newImage !== null

  if (hadNoImageBefore && hasNewImageNow) {
    hasChanges.value = true
  }
})
</script>

<template>
  <DefaultLayout>
    <div
      class="max-w-lg mx-auto flex flex-col p-8 bg-white dark:bg-zinc-800 rounded shadow gap-4 mt-12"
    >
      <h1 class="text-2xl font-bold mb-6 text-zinc-800 dark:text-white">
        User Profile
      </h1>
      <div>
        <span class="block text-zinc-700 dark:text-zinc-200 font-semibold"
          >Username:</span
        >
        <span class="block text-zinc-900 dark:text-white">{{
          user.username
        }}</span>
      </div>
      <div>
        <span class="block text-zinc-700 dark:text-zinc-200 font-semibold"
          >Email:</span
        >
        <span class="block text-zinc-900 dark:text-white">{{
          user.email
        }}</span>
      </div>
      <div class="flex flex-row gap-4 justify-between">
        <HButton
          label="Change Password"
          @click="() => (showResetModal = true)"
        />
        <HButton
          label="Delete account"
          @click="() => (showDeleteAccountModal = true)"
        />
      </div>
      <div v-if="user.image" class="mt-6 flex flex-col gap-2">
        <span class="text-zinc-700 dark:text-zinc-200 font-semibold"
          >Profile Picture</span
        >
        <div class="flex gap-2 items-start">
          <img
            :src="API_URL + user.image.url"
            :alt="user.image.name || 'Profile Picture'"
            class="w-32 h-32 rounded-full object-cover"
          />
          <button
            @click="showRemoveImageModal = true"
            class="text-red-700 hover:text-red-500 transition duration-200 cursor-pointer"
            title="Remove file"
          >
            <FontAwesomeIcon :icon="faTrash" />
          </button>
        </div>
      </div>
      <HInputUpload
        v-else
        id="image-upload"
        label="Profile Picture"
        class-name="[&_label]:font-semibold"
        :allowed-files="'image/*'"
        @change="handleImageChange"
      />
      <HButton
        label="Update Profile"
        class-name="mt-4"
        @click="handleUserUpdate"
        :disabled="!hasChanges || isUploading"
      />
    </div>
    <!-- Modal to confirm image removal -->
    <HModal v-model:modelValue="showRemoveImageModal">
      <template #content>
        <p class="mb-4">
          Are you sure you want to remove your profile picture?
        </p>
      </template>
      <template #footer>
        <div class="flex flex-row gap-4 justify-between">
          <HButton
            label="Remove"
            class-name="bg-red-600 hover:bg-red-500 text-white"
            @click="handleRemoveImage"
          />
          <HButton
            label="Cancel"
            class-name="ml-2"
            @click="showRemoveImageModal = false"
          />
        </div>
      </template>
    </HModal>
    <!-- Modal to change password -->
    <HModal v-model:modelValue="showResetModal">
      <template #content>
        <div class="flex flex-col gap-4">
          <HInput
            v-model="currentPassword"
            label="Current Password"
            type="password"
            required
          />
          <HInput
            v-model="password"
            label="New Password"
            type="password"
            required
          />
          <HInput
            v-model="passwordConfirmation"
            label="Confirm new password"
            type="password"
            required
          />
        </div>
      </template>
      <template #footer>
        <HButton
          label="Save new password"
          @click="handleChangePassword"
          class-name="mt-4"
        />
      </template>
    </HModal>
    <!-- Modal to confirm account deletion -->
    <HModal v-model:modelValue="showDeleteAccountModal">
      <template #content>
        <p class="mb-4">Are you sure you want to delete your account?</p>
      </template>
      <template #footer>
        <div class="flex flex-row gap-4 justify-between">
          <HButton
            label="Cancel"
            class-name="ml-2"
            @click="showDeleteAccountModal = false"
          />
          <HButton
            label="Delete"
            class-name="bg-red-600 hover:bg-red-500 text-white"
            @click="handleDeleteAccount"
          />
        </div>
      </template>
    </HModal>
  </DefaultLayout>
</template>
