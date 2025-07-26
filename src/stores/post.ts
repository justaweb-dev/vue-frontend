import type { Post } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * API URL
 */
const API_URL = import.meta.env.VITE_API_URL

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const post = ref<Post | null>(null)
  const totalPosts = ref(0) // total de posts que devuelve el backend
  const pageSize = 10
  const currentPage = ref(1)

  const fetchAllPosts = async (page = 1, pageSize = 10, token: string): Promise<void> => {
    try {
      const res = await fetch(
        `${API_URL}/api/posts?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*&sort=title:asc`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        },
      )
      const data = await res.json()
      
      if (!res.ok) {
        posts.value = []
        totalPosts.value = 0
        return
      }
      posts.value = data.data
      totalPosts.value = data.meta.pagination.total
      currentPage.value = page
    } catch (err) {
      posts.value = []
      totalPosts.value = 0
    }
  }

  const createPost = async (
    payload: Omit<Post, 'id'>,
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ data: payload }),
      })
      const data = await res.json()
      if (!res.ok) {
        console.log('Failed to create post.')
        return { success: false, message: '' }
      }
      post.value = data.data
        ? { ...data.data.attributes, id: data.data.id }
        : null
      return { success: true, message: 'Post created successfully!' }
    } catch (err: any) {
      console.log('Failed to create post.')
      return { success: false, message: '' }
    }
  }

  const fetchPostById = async (id: string | number, token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/posts/${id}?populate=*`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      post.value = data.data
    } catch (e: any) {
      post.value = null
      console.error('Error fetching post:', e)
    }
  }

  const updatePost = async (
    id: string | number,
    payload: Partial<Post>,
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ data: payload }),
      })
      const data = await res.json()
      if (!res.ok) {
        console.log('Failed to update post.')
        return { success: false, message: data?.error?.message || '' }
      }
      post.value = data.data
        ? { ...data.data, id: data.data.id }
        : null
      return { success: true, message: 'Post updated successfully!' }
    } catch (err: any) {
      console.log('Failed to update post.')
      return { success: false, message: err?.message || '' }
    }
  }

  /**
   * Clear the current post state (set post to null)
   */
  const clearPost = () => {
    post.value = null
  }

  return {
    post,
    posts,
    totalPosts,
    pageSize,
    currentPage,
    createPost,
    updatePost,
    fetchAllPosts,
    fetchPostById,
    clearPost,
  }
})
