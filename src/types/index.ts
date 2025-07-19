export interface User {
  id: number
  username: string
  email: string
  image?: Media
}

export interface Post {
  id: number
  documentId: string
  title: string
  slug: string
  body: string
  tags?: (string | number)[]
  media?: Media
  locale: string
  localizations?: (string | number)[]
  users_permissions_user: User
}

export interface Media {
  id: number
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: any
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
}

export interface Tag {
  id: number
  documentId: string
  name: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}
