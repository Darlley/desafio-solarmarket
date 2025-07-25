
import { Book as BookType } from '../domain/entities/book.entity';
import Book from '../models/book.model';

export const listBooksService = async () => {
  const books = await Book.findAll();
  return books;
};

export const createBookService = async (bookData: BookType) => {
  const book = await Book.create(bookData as any);
  return book;
};

export const getBookByIdService = async (id: string) => {
    const book = await Book.findByPk(id);
    return book;
};

export const updateBookService = async (id: string, bookData: Partial<BookType>) => {
  const [updatedRows] = await Book.update(bookData, {
    where: { id: id },
  });
  if (updatedRows > 0) {
    const updatedBook = await Book.findByPk(id);
    return updatedBook;
  }
  return null;
};

export const deleteBookService = async (id: string) => {
  const deletedRows = await Book.destroy({
    where: { id: id },
  });
  return deletedRows > 0;
};
