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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash, SquarePen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import BookForm from "./book.form"
import { BookType } from "@/schemas/book"
import { useBooks, useCreateBook } from "@/hooks/books"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ShinyButton } from "./magicui/shiny-button"

const columns: ColumnDef<BookType>[] = [
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
        <div>

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
              <DropdownMenuItem >

              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0"><SquarePen /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Editar Livro
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados para editar o livro na biblioteca"
                </DialogDescription>
              </DialogHeader>
              <BookForm isEditing initialData={book} />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-red-500"><Trash /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá excluir permanentemente o livro.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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

  const { data } = useBooks()
  const table = useReactTable({
    data: data ?? [],
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
        <Dialog>
          <DialogTrigger asChild>
            <ShinyButton className="text-nowrap">
              Criar livro
            </ShinyButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Cadastrar Novo Livro
              </DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar um novo livro na biblioteca"
              </DialogDescription>
            </DialogHeader>
            <BookForm />
          </DialogContent>
        </Dialog>
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