import { api } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Book } from "@/types/book.type"

export default function useBooks () {
  return useQuery({ 
    queryKey: ['books'], 
    queryFn: async (): Promise<Book[]> => {
      const response = await api.get('/books')
      return response.data
    }, 
  })
}