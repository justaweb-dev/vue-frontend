import type { Post } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const post = ref<Post | null>(null)
  const totalPosts = ref(0) // total de posts que devuelve el backend
  const pageSize = 10
  const currentPage = ref(1)

  const fetchPosts = async (page = 1): Promise<void> => {
    try {
      const res = await fetch(
        `http://localhost:1337/api/posts?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
        {
          method: 'GET',
          credentials: 'include',
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
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('http://localhost:1337/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: payload }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        console.log('Failed to create post.')
        return { success: false, message: null }
      }
      post.value = data.data
        ? { ...data.data.attributes, id: data.data.id }
        : null
      return { success: true, message: 'Post created successfully!' }
    } catch (err: any) {
      console.log('Failed to create post.')
      return { success: false, message: null }
    }
  }

  return {
    post,
    posts,
    totalPosts,
    pageSize,
    currentPage,
    createPost,
    fetchPosts,
  }
})
