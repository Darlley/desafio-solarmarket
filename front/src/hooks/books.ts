import { api } from '@/lib/api'
import { useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query'
import { Book, CreateBookData, UpdateBookData } from "@/types/book.type"

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: async (): Promise<Book[]> => {
      const response = await api.get('/books')
      return response.data
    },
  })
}