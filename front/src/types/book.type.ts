export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publicationDate: string
  genre: string
  language: string
  coverUrl: string
  description?: string
}

export interface CreateBookData {
  title: string
  description?: string
  author: string
  isbn: string
  publicationDate: string
  genre: string
  language: string
  coverUrl: string
}

export interface UpdateBookData {
  title?: string
  author?: string
  isbn?: string
  publicationDate?: string
  genre?: string
  language?: string
  coverUrl?: string
  description?: string
}