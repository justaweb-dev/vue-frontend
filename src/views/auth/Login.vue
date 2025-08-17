<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { HButton, HInput, HModal } from '@justaweb-dev/histoire-library'
import { ref } from 'vue'

/**
 * Stores
 */
const userStore = useUserStore()
const { login, forgotPassword } = userStore

/**
 * Reactive variables
 */
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const resetEmail = ref('')
const showResetModal = ref(false)

/**
 * Methods
 */
const validateEmail = (email: string) => {
  // More robust email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

const validatePassword = (password: string) => {
  // Basic password validation
  return password.length >= 8 && password.length <= 128
}

const handleLogin = async () => {
  error.value = ''
  success.value = ''
  if (!email.value || !password.value) {
    error.value = 'Both fields are required.'
    return
  }
  if (!validateEmail(email.value)) {
    error.value = 'Invalid email address.'
    return
  }
  if (!validatePassword(password.value)) {
    error.value = 'Password must be between 8 and 128 characters.'
    return
  }

  const result = await login(email.value, password.value)

  if (result.success) {
    success.value = result.message
    router.push('/user')
  } else {
    error.value = result.message
  }

  email.value = ''
  password.value = ''

  // Clear the input fields after registration
  email.value = ''
  password.value = ''
}

const handleResetPassword = async () => {
  if (!resetEmail.value) {
    error.value = 'Email is required.'
    return
  }
  const result = await forgotPassword(resetEmail.value)
  if (result.success) {
    success.value = result.message
  } else {
    error.value = result.message
  }
  resetEmail.value = ''
  showResetModal.value = false
}
</script>

<template>
  <DefaultLayout>
    <div class="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
      <div class="animate-fade-in-up w-full">
        <div class="modern-card max-w-md w-full mx-auto p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span class="text-white font-bold text-xl">🔐</span>
            </div>
            <h1 class="heading-md mb-2">Welcome Back</h1>
            <p class="text-muted">Sign in to your account to continue</p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="form-modern">
            <div class="form-group">
              <HInput
                v-model="email"
                label="Email"
                id="email"
                type="email"
                required
                class="input-modern focus-modern"
                placeholder="Enter your email"
              />
            </div>
            
            <div class="form-group">
              <HInput
                v-model="password"
                label="Password"
                id="password"
                type="password"
                required
                class="input-modern focus-modern"
                placeholder="Enter your password"
              />
            </div>

            <!-- Error/Success Messages -->
            <div v-if="error" class="alert alert-error">
              {{ error }}
            </div>
            <div v-if="success" class="alert alert-success">
              {{ success }}
            </div>

            <!-- Submit Button -->
            <HButton 
              label="Sign In" 
              class="btn-modern w-full"
              :disabled="!email || !password"
            />
          </form>

          <!-- Additional Actions -->
          <div class="mt-6 space-y-4">
            <div class="text-center">
              <button
                @click="() => (showResetModal = true)"
                class="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
            
            <div class="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <p class="text-sm text-muted">
                Don't have an account?
                <RouterLink 
                  to="/register" 
                  class="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
                >
                  Sign up
                </RouterLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <HModal v-model:modelValue="showResetModal">
      <template #content>
        <div class="text-center mb-6">
          <h3 class="heading-sm mb-2">Reset Password</h3>
          <p class="text-muted">Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        
        <div class="form-group">
          <HInput 
            v-model="resetEmail" 
            label="Email" 
            type="email" 
            required 
            class="input-modern focus-modern"
            placeholder="Enter your email"
          />
        </div>
        
        <div v-if="error" class="alert alert-error mt-4">
          {{ error }}
        </div>
      </template>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <HButton
            label="Cancel"
            @click="showResetModal = false"
            class="btn-modern"
          />
          <HButton
            label="Send Reset Link"
            @click="handleResetPassword"
            class="btn-modern"
          />
        </div>
      </template>
    </HModal>
  </DefaultLayout>
</template>
