import type { Tag } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL

export const useTagStore = defineStore('tag', () => {
  const tag = ref<Tag | null>(null)
  const tagPosts = ref<any[]>([])
  const tags = ref<Tag[]>([])

  const fetchTagById = async (id: string | number, token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tags/${id}?populate=*`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      )
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

  const fetchAllTags = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tags?populate=*`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error('Error fetching tags')
      tags.value = data.data.map((t: any) => ({
        id: typeof t.id === 'string' ? parseInt(t.id, 10) : t.id,
        name: t.attributes?.name || '',
        createdAt: t.attributes?.createdAt || '',
        updatedAt: t.attributes?.updatedAt || '',
        publishedAt: t.attributes?.publishedAt || '',
        ...t.attributes
      }))
    } catch (e) {
      tags.value = []
      console.error('Failed to fetch tags:', e)
    }
  }

  const createTag = async (name: string, token: string): Promise<Tag | null> => {
    try {
      const res = await fetch(`${API_URL}/api/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { name } }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || 'Error creating tag')
      // Defensive: ensure we always return a tag object with id and name
      const newTag = {
        id: data.data.id,
        name: data.data.attributes?.name || name,
        ...data.data.attributes
      }
      // NO push a tags.value aquí
      return newTag
    } catch (e) {
      console.error('Failed to create tag:', e)
      return null
    }
  }

  return {
    tag,
    tagPosts,
    tags,
    fetchTagById,
    fetchAllTags,
    createTag,
  }
})
