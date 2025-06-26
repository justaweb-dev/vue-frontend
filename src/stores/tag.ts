import type { Tag } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL

export const useTagStore = defineStore('tag', () => {
  const tag = ref<Tag | null>(null)
  const tagPosts = ref<any[]>([])

  const fetchTagById = async (id: string | number) => {
    try {
      const res = await fetch(`${API_URL}/api/tags/${id}?populate=*`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      tag.value = { id: data.data.id, ...data.data }
      tagPosts.value =
        data.data.posts?.map((p: any) => ({ id: p.id, ...p })) || []
    } catch (e: any) {
      tag.value = null
      tagPosts.value = []
      console.error('Failed to fetch tag:', e)
    }
  }

  return {
    tag,
    tagPosts,
    fetchTagById,
  }
})
