"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Upload, Link, Bold, Italic, List, ListOrdered, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { z } from "zod"
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from "./ui/cropper"
import { ShinyButton } from "./magicui/shiny-button"
import { useCreateBook } from "@/hooks/books"

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

export type BookFormData = z.infer<typeof bookSchema>

interface BookEditorProps {
  initialData?: Partial<BookFormData>
  isEditing?: boolean
  onSuccess?: () => void
}

export default function CreateBookForm({ initialData, isEditing = false, onSuccess }: BookEditorProps) {
  const [date, setDate] = useState<Date | undefined>(
    initialData?.publicationDate ? new Date(initialData.publicationDate) : undefined,
  )
  const [coverType, setCoverType] = useState<"upload" | "url">("url")
  const [previewImage, setPreviewImage] = useState<string>("")

  const createBookMutation = useCreateBook()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: initialData?.title || "",
      author: initialData?.author || "",
      description: initialData?.description || "",
      isbn: initialData?.isbn || "",
      publicationDate: initialData?.publicationDate || "",
      genre: initialData?.genre || "",
      language: initialData?.language || "pt-BR",
      coverUrl: initialData?.coverUrl || "",
    }
  })

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.description || "<p>Digite a descrição do livro...</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setValue("description", editor.getHTML())
    },
  })


  const resetForm = () => {
    reset()
    setDate(undefined)
    setPreviewImage("")
    editor?.commands.setContent("<p>Digite a descrição do livro...</p>")
  }

  const onSubmit = async (data: BookFormData) => {
    try {
      const bookData = {
        ...data,
        publicationDate: new Date(data.publicationDate).toISOString()
      }

      await createBookMutation.mutateAsync({
        data: bookData
      })

      toast.success("Livro cadastrado com sucesso!", {
        description: `"${data.title}" foi adicionado à biblioteca.`
      })

      resetForm()
      onSuccess?.()
    } catch (error: any) {
      console.error("Erro ao criar livro:", error)

      // Tratar diferentes tipos de erro
      if (error?.response?.status === 400) {
        toast.error("Dados inválidos", {
          description: "Verifique os campos obrigatórios e tente novamente."
        })
      } else if (error?.response?.status === 409) {
        toast.error("Livro já existe", {
          description: "Um livro com este ISBN já foi cadastrado."
        })
      } else {
        toast.error("Erro ao cadastrar livro", {
          description: "Tente novamente em alguns instantes."
        })
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande", {
          description: "A imagem deve ter no máximo 5MB."
        })
        return
      }

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error("Formato inválido", {
          description: "Selecione apenas arquivos de imagem."
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Função para capturar dados da imagem cortada
  const handleCropChange = (cropData: any) => {
    if (cropData && cropData.canvas) {
      // Converter canvas para base64 ou blob
      const croppedImageUrl = cropData.canvas.toDataURL('image/jpeg', 0.8)
      setValue("coverUrl", croppedImageUrl)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Livro *</Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              id="title"
              placeholder="Digite o título do livro"
              {...field}
              disabled={isSubmitting}
            />
          )}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Autor */}
      <div className="space-y-2">
        <Label htmlFor="author">Nome do Autor *</Label>
        <Controller
          name="author"
          control={control}
          render={({ field }) => (
            <Input
              id="author"
              placeholder="Digite o nome do autor"
              {...field}
              disabled={isSubmitting}
            />
          )}
        />
        {errors.author && (
          <p className="text-sm text-red-500 mt-1">{errors.author.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gêneros */}
        <div className="space-y-2">
          <Label htmlFor="genre">Genero *</Label>
          <Controller
            name="genre"
            control={control}
            render={({ field }) => (
              <Input
                id="genre"
                placeholder="Digite o genero do livro"
                {...field}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.genre && (
            <p className="text-sm text-red-500 mt-1">{errors.genre.message}</p>
          )}
        </div>

        {/* Idioma */}
        <div className="space-y-2">
          <Label htmlFor="language">Idioma *</Label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Input
                id="language"
                placeholder="Digite o genero do livro"
                {...field}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.language && (
            <p className="text-sm text-red-500 mt-1">{errors.language.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data de Publicação */}
        <div className="space-y-2">
          <Label>Data de Publicação *</Label>
          <Controller
            name="publicationDate"
            control={control}
            render={({ field }) => (
              <>
                <Input type="date" {...field} disabled={isSubmitting} />
                {errors.publicationDate && (
                  <p className="text-sm text-red-500">
                    {errors.publicationDate.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* ISBN */}
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN *</Label>
          <Controller
            name="isbn"
            control={control}
            render={({ field }) => (
              <Input
                id="isbn"
                {...field}
                placeholder="13 dígitos numéricos"
                maxLength={13}
                disabled={createBookMutation.isPending}
              />
            )}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Digite apenas os números do ISBN (13 dígitos)
          </p>
          {errors.isbn && (
            <p className="text-sm text-red-500 mt-1">
              {errors.isbn.message}
            </p>
          )}
        </div>

      </div>

      {/* Descrição com Editor */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição do Livro</Label>

        <div className="border rounded-md">
          <div className="border-b p-2 flex gap-1">
            {/* Botões de formatação */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive("bold") ? "bg-muted" : ""}
              disabled={createBookMutation.isPending}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive("italic") ? "bg-muted" : ""}
              disabled={createBookMutation.isPending}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={editor?.isActive("bulletList") ? "bg-muted" : ""}
              disabled={createBookMutation.isPending}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={editor?.isActive("orderedList") ? "bg-muted" : ""}
              disabled={createBookMutation.isPending}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          <EditorContent editor={editor} className="p-4 min-h-[200px]" />
        </div>

        <p className="text-sm text-muted-foreground mt-1">
          Use a barra de ferramentas para formatar o texto
        </p>
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Capa do Livro */}
      <div className="space-y-2">
        <Label htmlFor="coverUrl">Capa do Livro</Label>
        <Controller
          name="coverUrl"
          control={control}
          render={({ field }) => (
            <Tabs
              value={coverType}
              onValueChange={(value) => setCoverType(value as "upload" | "url")}
            >
              <TabsList>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  URL Externa
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload de Arquivo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2">
                <Input
                  {...field}
                  placeholder="https://exemplo.com/capa-do-livro.jpg"
                  disabled={createBookMutation.isPending}
                />
              </TabsContent>

              <TabsContent value="upload" className="space-y-2">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Clique para fazer upload ou arraste a imagem aqui
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP até 5MB
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    className="mt-4"
                    onChange={handleFileUpload}
                    disabled={createBookMutation.isPending}
                  />

                  {previewImage && (
                    <div className="mt-6 space-y-2">
                      <Label>Ajuste sua imagem</Label>
                      <Cropper
                        className="h-80 w-full rounded-lg border"
                        image={previewImage}
                        aspectRatio={3 / 4}
                        minZoom={1}
                        maxZoom={3}
                        onCropChange={handleCropChange}
                      >
                        <CropperDescription />
                        <CropperImage />
                        <CropperCropArea />
                      </Cropper>
                      <p className="text-sm text-muted-foreground">
                        Arraste para ajustar e use o scroll do mouse para zoom
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        />

        <p className="text-sm text-muted-foreground mt-1">
          Escolha uma URL de imagem ou faça upload de um arquivo
        </p>

        {errors.coverUrl && (
          <p className="text-sm text-red-500 mt-1">
            {errors.coverUrl.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={createBookMutation.isPending}
      >
        {createBookMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Salvando..." : "Cadastrando..."}
          </>
        ) : (
          isEditing ? "Salvar Alterações" : "Cadastrar Livro"
        )}
      </Button>
    </form>
  )
}