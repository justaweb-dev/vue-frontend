<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import RunAgentButton from '@/components/runAgentButton.vue'
import { useUserStore } from '@/stores/user'
import { HButton } from '@justaweb-dev/histoire-library'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

/**
 * Stores
 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/**
 * Computed properties
 */
const isAuthenticated = computed(() => !!user.value?.username)
const features = [
  {
    title: 'AI-Powered Content',
    description: 'Generate high-quality blog posts with our advanced AI agent that researches latest web development trends.',
    icon: '🤖'
  },
  {
    title: 'Real-time Publishing',
    description: 'Automatically publish generated content with smart editing and optimization.',
    icon: '⚡'
  },
  {
    title: 'Modern Interface',
    description: 'Beautiful, responsive design with dark mode support and modern UI components.',
    icon: '✨'
  },
  {
    title: 'Smart Analytics',
    description: 'Track your content performance with detailed analytics and insights.',
    icon: '📊'
  }
]
</script>

<template>
  <DefaultLayout>
    <!-- Hero Section -->
    <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900/20"></div>
      
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-32 w-80 h-80 bg-emerald-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-40 -left-32 w-80 h-80 bg-teal-300/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div class="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div class="animate-fade-in-up w-full">
          <h1 class="heading-xl mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            AI-Powered Content Creation
          </h1>
          <p class="text-xl text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your content strategy with intelligent AI agents that research, write, and publish high-quality blog posts automatically.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <RouterLink v-if="!isAuthenticated" to="/register">
              <HButton label="Get Started Free" class="btn-modern text-lg px-8 py-4" />
            </RouterLink>
            <RouterLink v-if="isAuthenticated" to="/posts">
              <HButton label="View Posts" class="btn-modern text-lg px-8 py-4" />
            </RouterLink>
            <div v-if="isAuthenticated" class="flex flex-col items-center gap-2">
              <RunAgentButton />
              <span class="text-sm text-muted">Try the AI agent now!</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap justify-center gap-8 text-center">
            <div class="animate-bounce-in" style="animation-delay: 0.2s;">
              <div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">500+</div>
              <div class="text-sm text-muted">Posts Generated</div>
            </div>
            <div class="animate-bounce-in" style="animation-delay: 0.4s;">
              <div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
              <div class="text-sm text-muted">AI Agent Active</div>
            </div>
            <div class="animate-bounce-in" style="animation-delay: 0.6s;">
              <div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
              <div class="text-sm text-muted">Automated</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="container-modern">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="heading-lg mb-4">Powerful Features</h2>
          <p class="text-xl text-muted max-w-2xl mx-auto">
            Everything you need to automate your content creation and grow your audience.
          </p>
        </div>

        <div class="grid-modern">
          <div 
            v-for="(feature, index) in features" 
            :key="feature.title"
            class="modern-card p-8 text-center animate-fade-in-up"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="text-4xl mb-4">{{ feature.icon }}</div>
            <h3 class="heading-sm mb-3">{{ feature.title }}</h3>
            <p class="text-muted">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-emerald-500 to-teal-500">
      <div class="container-modern text-center">
        <div class="animate-fade-in-up">
          <h2 class="heading-lg text-white mb-4">Ready to Get Started?</h2>
          <p class="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who trust our AI to generate engaging, high-quality posts.
          </p>
          <div class="flex flex-row flex-wrap sm:flex-row gap-4 justify-center">
            <RouterLink v-if="!isAuthenticated" to="/register">
              <HButton label="Start Free Trial" class="btn-modern text-lg px-8 py-4" />
            </RouterLink>
            <RouterLink v-if="!isAuthenticated" to="/login">
              <HButton label="Sign In" class="btn-modern text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-emerald-600" />
            </RouterLink>
            <RouterLink v-if="isAuthenticated" to="/user">
              <HButton label="Go to Dashboard" class="btn-modern text-lg px-8 py-4" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>
