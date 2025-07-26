"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import CreateOrEditBookForm from "./create-or-edit-books.form"

export type Book = {
  title: string
  author: string
  description?: string
  isbn: string
  publicationDate: string
  genre: string
  language: string
  coverUrl?: string
}

const data: Book[] = [
  {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    description: "Romance clássico da literatura brasileira",
    isbn: "9788520925485",
    publicationDate: "1899-12-01",
    genre: "Romance",
    language: "Português",
    coverUrl: "https://example.com/dom-casmurro.jpg"
  },
  {
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    description: "Fábula poética sobre amizade e amor",
    isbn: "9788525412157",
    publicationDate: "1943-04-06",
    genre: "Fábula",
    language: "Português",
    coverUrl: "https://example.com/pequeno-principe.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "Distopia clássica sobre totalitarismo",
    isbn: "9788535914849",
    publicationDate: "1949-06-08",
    genre: "Ficção Científica",
    language: "Português",
    coverUrl: "https://example.com/1984.jpg"
  },
  {
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    description: "Romance naturalista brasileiro",
    isbn: "9788594318817",
    publicationDate: "1890-06-15",
    genre: "Romance",
    language: "Português"
  },
  {
    title: "Harry Potter e a Pedra Filosofal",
    author: "J.K. Rowling",
    description: "Primeiro livro da saga do bruxinho",
    isbn: "9788532511010",
    publicationDate: "1997-06-26",
    genre: "Fantasia",
    language: "Português",
    coverUrl: "https://example.com/harry-potter.jpg"
  },
  {
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    description: "Obra-prima do realismo mágico",
    isbn: "9788535925364",
    publicationDate: "1967-05-30",
    genre: "Realismo Mágico",
    language: "Português"
  },
  {
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    description: "Aventura épica na Terra Média",
    isbn: "9788595084759",
    publicationDate: "1937-09-21",
    genre: "Fantasia",
    language: "Português",
    coverUrl: "https://example.com/hobbit.jpg"
  },
  {
    title: "Quincas Borba",
    author: "Machado de Assis",
    description: "Romance brasileiro do século XIX",
    isbn: "9788520923467",
    publicationDate: "1891-01-01",
    genre: "Romance",
    language: "Português"
  }
]

const columns: ColumnDef<Book>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Título
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Autor
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("author")}</div>,
  },
  {
    accessorKey: "genre",
    header: "Gênero",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("genre")}</div>
    ),
  },
  {
    accessorKey: "isbn",
    header: "ISBN",
    cell: ({ row }) => {
      const isbn = row.getValue("isbn") as string
      // Formatação do ISBN para melhor legibilidade: 978-85-20-92548-5
      const formattedIsbn = `${isbn.slice(0, 3)}-${isbn.slice(3, 5)}-${isbn.slice(5, 7)}-${isbn.slice(7, 12)}-${isbn.slice(12)}`
      return <div className="font-mono text-sm">{formattedIsbn}</div>
    },
  },
  {
    accessorKey: "publicationDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Publicação
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("publicationDate"))
      const formatted = date.toLocaleDateString("pt-BR")
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "language",
    header: "Idioma",
    cell: ({ row }) => <div>{row.getValue("language")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const book = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(book.isbn)}
            >
              Copiar ISBN
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Editar livro</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Excluir livro
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ListBooksTable() {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 gap-4">
        <Input
          placeholder="Filtrar por título..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <CreateOrEditBookForm />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}