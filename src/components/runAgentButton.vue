<script setup lang="ts">
import { HButton } from '@justaweb-dev/histoire-library'
import { ref, computed } from 'vue'

// State management
const isRunning = ref(false)
const status = ref<'idle' | 'running' | 'success' | 'error'>('idle')
const message = ref('')

async function runAgent() {
  if (isRunning.value) return
  
  isRunning.value = true
  status.value = 'running'
  message.value = 'Starting AI Agent...'
  
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai-agent/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await res.json()
    
    if (data.success) {
      status.value = 'success'
      message.value = 'AI Agent completed successfully! New post created and published.'
    } else {
      status.value = 'error'
      message.value = data.message || 'AI Agent execution failed'
    }
  } catch (err) {
    console.error('Error executing AI agent:', err)
    status.value = 'error'
    message.value = 'Failed to execute AI Agent. Please try again.'
  } finally {
    isRunning.value = false
    // Clear message after 5 seconds
    setTimeout(() => {
      if (status.value !== 'running') {
        status.value = 'idle'
        message.value = ''
      }
    }, 5000)
  }
}

const buttonLabel = computed(() => {
  switch (status.value) {
    case 'running': return 'Running AI Agent...'
    case 'success': return 'Agent Completed!'
    case 'error': return 'Agent Failed'
    default: return 'Run AI Agent'
  }
})

const statusMessageClass = computed(() => {
  return status.value
})
</script>

<template>
  <div class="ai-agent-container">
    <HButton
      class="run-agent-button"
      @click="runAgent"
      :label="buttonLabel"
      :disabled="isRunning"
    />
    <div v-if="message" :class="statusMessageClass" class="status-message">
      <div v-if="status === 'running'" class="loading-spinner"></div>
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.ai-agent-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.status-message {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.status-message.success {
  background-color: rgb(220 252 231);
  color: rgb(22 101 52);
  border: 1px solid rgb(187 247 208);
}

.status-message.error {
  background-color: rgb(254 242 242);
  color: rgb(153 27 27);
  border: 1px solid rgb(252 165 165);
}

.status-message.running {
  background-color: rgb(254 249 195);
  color: rgb(146 64 14);
  border: 1px solid rgb(251 191 36);
}

.dark .status-message.success {
  background-color: rgb(20 83 45);
  color: rgb(187 247 208);
  border: 1px solid rgb(34 197 94);
}

.dark .status-message.error {
  background-color: rgb(127 29 29);
  color: rgb(252 165 165);
  border: 1px solid rgb(239 68 68);
}

.dark .status-message.running {
  background-color: rgb(120 53 15);
  color: rgb(251 191 36);
  border: 1px solid rgb(245 158 11);
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.run-agent-button {
  transition: all 0.3s ease;
}
</style>
