import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileStore = defineStore('file', () => {
  const files = ref<any[]>([])
  const error = ref<string | null>(null)

  const uploadFile = async (
    file: File,
    options?: {
      ref?: string
      refId?: string | number
      field?: string
    },
  ): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('files', file)

      if (options?.ref) formData.append('ref', options.ref)
      if (options?.refId) formData.append('refId', String(options.refId))
      if (options?.field) formData.append('field', options.field)

      const res = await fetch('http://localhost:1337/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Upload failed.')

      const data = await res.json()
      return data.length > 0 ? data[0] : null
    } catch (err) {
      console.error('Image upload error:', err)
      return null
    }
  }

  const deleteFile = async (id: string | number): Promise<boolean> => {
    try {
      const res = await fetch(`http://localhost:1337/api/upload/files/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete file.')

      return true
    } catch (err) {
      error.value = (err as Error).message || 'Failed to delete file.'
      return false
    }
  }

  return {
    files,
    error,
    uploadFile,
    deleteFile,
  }
})
