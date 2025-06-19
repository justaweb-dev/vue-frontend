export interface User {
  username: string
  email: string
  image?: Media
}

export interface Post {
  title: string
  body: string
  tags?: (string | number)[]
  media?: (string | number)[]
  locale: string
  localizations?: (string | number)[]
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
