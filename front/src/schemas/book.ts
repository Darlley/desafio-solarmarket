import { z } from "zod"

export const bookSchema = z.object({
  title: z.string().min(1, "Título é obrigatório."),
  author: z.string().min(3, "Autor deve conter pelo menos 3 caracteres."),
  description: z.string().optional(),
  isbn: z.string().regex(/^\d{13}$/, "ISBN deve conter 13 dígitos numéricos."),
  publicationDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de publicação inválida.",
  }),
  genre: z.string().min(3, "Gênero é obrigatório."),
  language: z.string().min(2, "Idioma é obrigatório."),
  coverUrl: z.string().url("URL da capa inválida."),
})

export type BookType = z.infer<typeof bookSchema>
export type UpdateBookType = Partial<z.infer<typeof bookSchema>>