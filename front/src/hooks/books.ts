import { api } from '@/lib/api'
import { useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query'
import { BookType, UpdateBookType } from "@/schemas/book"

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: async (): Promise<BookType[]> => {
      const response = await api.get('/books')
      return response.data
    },
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ data }: { data: BookType }) => await api.post(`/books`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] })
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      id, data
    }: { 
      id: string;
      data: UpdateBookType;
    }) => {
      const response = await api.patch(`/books/${id}`, data)
      return response.data
    },
    
    onSuccess: (updatedBook) => {
      queryClient.setQueryData(['books', updatedBook.id], updatedBook)
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}