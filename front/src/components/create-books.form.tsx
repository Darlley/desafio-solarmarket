"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { CalendarIcon, Upload, Link, Bold, Italic, List, ListOrdered } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { z } from "zod"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from "./ui/cropper"
import { ShinyButton } from "./magicui/shiny-button"

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
  coverUrl: z.string().url("URL da capa inválida.").optional(),
})

export type Book = z.infer<typeof bookSchema>

interface BookEditorProps {
  initialData?: Partial<Book>
  isEditing?: boolean
  onSave?: (data: Book) => void
}

export default function CreateBookForm({ initialData, isEditing = false, onSave }: BookEditorProps) {

  const [date, setDate] = useState<Date | undefined>(
    initialData?.publicationDate ? new Date(initialData.publicationDate) : undefined,
  )
  const [coverType, setCoverType] = useState<"upload" | "url">("url")
  const [genres, setGenres] = useState<string[]>(
    initialData?.genre ? initialData.genre.split(",").map((g) => g.trim()) : [],
  )
  const [currentGenre, setCurrentGenre] = useState("")

  const form = useForm<Book>({
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
    },
  })

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.description || "<p>Digite a descrição do livro...</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      form.setValue("description", editor.getHTML())
    },
  })

  const addGenre = () => {
    if (currentGenre.trim() && !genres.includes(currentGenre.trim())) {
      const newGenres = [...genres, currentGenre.trim()]
      setGenres(newGenres)
      form.setValue("genre", newGenres.join(", "))
      setCurrentGenre("")
    }
  }

  const removeGenre = (genreToRemove: string) => {
    const newGenres = genres.filter((genre) => genre !== genreToRemove)
    setGenres(newGenres)
    form.setValue("genre", newGenres.join(", "))
  }

  const onSubmit = (data: Book) => {
    console.log("Dados do livro:", data)
    onSave?.(data)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      form.setValue("publicationDate", selectedDate.toISOString().split("T")[0])
    }
  }

  const [previewImage, setPreviewImage] = useState<string>("")

  return (
    <Dialog>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <ShinyButton className="text-nowrap">Criar livro</ShinyButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-11/12 max-h-[90%] scroll-y-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastro</DialogTitle>
            <DialogDescription>
              Cadastre um novo livro
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título do Livro *</Label>
              <Input id="title" placeholder="Digite o título do livro" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* Autor */}
            <div className="space-y-2">
              <Label htmlFor="author">Nome do Autor *</Label>
              <Input id="author" placeholder="Digite o nome do autor" {...form.register("author")} />
              {form.formState.errors.author && (
                <p className="text-sm text-red-500">{form.formState.errors.author.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gêneros */}
              <div className="space-y-2">
                <Label>Gêneros *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite um gênero"
                    value={currentGenre}
                    onChange={(e) => setCurrentGenre(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGenre())}
                  />
                  <Button type="button" onClick={addGenre} variant="outline">
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="cursor-pointer">
                      {genre}
                      <button
                        type="button"
                        onClick={() => removeGenre(genre)}
                        className="ml-2 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                {form.formState.errors.genre && (
                  <p className="text-sm text-red-500">{form.formState.errors.genre.message}</p>
                )}
              </div>

              {/* Idioma */}
              <div className="space-y-2">
                <Label htmlFor="language">Idioma *</Label>
                <Input id="language" placeholder="ex: pt-BR, en-US" {...form.register("language")} />
                {form.formState.errors.language && (
                  <p className="text-sm text-red-500">{form.formState.errors.language.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data de Publicação */}
              <div className="space-y-2">
                <Label>Data de Publicação *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.publicationDate && (
                  <p className="text-sm text-red-500">{form.formState.errors.publicationDate.message}</p>
                )}
              </div>

              {/* ISBN */}
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN *</Label>
                <Input id="isbn" placeholder="13 dígitos numéricos" maxLength={13} {...form.register("isbn")} />
                {form.formState.errors.isbn && (
                  <p className="text-sm text-red-500">{form.formState.errors.isbn.message}</p>
                )}
              </div>
            </div>

            {/* Descrição com Editor */}
            <div className="space-y-2">
              <Label>Descrição do Livro</Label>
              <div className="border rounded-md">
                {/* Toolbar do Editor */}
                <div className="border-b p-2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive("bold") ? "bg-muted" : ""}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive("italic") ? "bg-muted" : ""}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive("bulletList") ? "bg-muted" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={editor?.isActive("orderedList") ? "bg-muted" : ""}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 min-h-[200px]">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>

            {/* Capa do Livro */}
            <div className="space-y-4">
              <Label>Capa do Livro</Label>
              <Tabs value={coverType} onValueChange={(value) => setCoverType(value as "upload" | "url")}>
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
                  <Input placeholder="https://exemplo.com/capa-do-livro.jpg" {...form.register("coverUrl")} />
                  {form.formState.errors.coverUrl && (
                    <p className="text-sm text-red-500">{form.formState.errors.coverUrl.message}</p>
                  )}
                </TabsContent>

                <TabsContent value="upload" className="space-y-2">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Clique para fazer upload ou arraste a imagem aqui
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP até 5MB</p>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-4"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (e) => {
                            if (e.target?.result) {
                              setPreviewImage(e.target.result as string)
                            }
                          }
                          reader.readAsDataURL(file)
                          // podemos armazenar o File ou a imagem base64 posteriormente após o crop
                        }
                      }}
                    />

                    {previewImage && (
                      <div className="space-y-2">
                        <Label>Ajuste sua imagem</Label>
                        <Cropper
                          className="h-80 w-full rounded-lg border"
                          image={previewImage}
                          aspectRatio={3 / 4}
                          minZoom={1}
                          maxZoom={3}
                          onCropChange={(data: any) => {
                            if (data) {
                              form.setValue("coverUrl", data)
                            }
                          }}
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
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg">Cancel</Button>
            </DialogClose>
            <Button type="submit" size="lg">
              {isEditing ? "Salvar Alterações" : "Cadastrar Livro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
