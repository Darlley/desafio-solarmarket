import { Request, Response } from "express";

import { ZodError } from "zod";
import { createBookService, listBooksService } from "../services/book.service";
import { bookSchema } from "../domain/entities/book.entity";

export const createBookController = async (request: Request, response: Response): Promise<void> => {
  try {
    const data = bookSchema.parse(request.body);
    const result = await createBookService(data);
    response.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ errors: error.errors });
      return;
    }
    if (error instanceof Error) {
      response.status(409).json({ message: error.message });
      return;
    }
    response.status(500).json({ message: 'Erro ao criar contato' });
    return;
  }
}

export const listBooksController = async (request: Request, response: Response) => {
  try {
    const result = await listBooksService();
    response.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ errors: error.errors });
      return;
    }
    response.status(500).json({ message: 'Erro ao listar contatos' });
    return;
  }
}
