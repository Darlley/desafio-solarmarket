import express, { NextFunction, Request, Response } from 'express';

import { ZodError } from 'zod';
import { bookSchema } from '../domain/entities/book.entity';
import { createBookController, listBooksController } from '../controller/book.controller';

const router = express.Router();

router.post(
  '/',
  (req: Request, response: Response, next: NextFunction) => {
    try {
      bookSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }))
        response.status(404).json({ error: 'Invalid data', details: errorMessages });
      } else {
        response.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },
  createBookController
);

router.get('/', listBooksController);

router.patch(
  '/:id',
  (req: Request, response: Response, next: NextFunction) => {
    try {
      bookSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }))
        response.status(404).json({ error: 'Invalid data', details: errorMessages });
      } else {
        response.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },
  () => {}
  //editBookController
);

router.delete(
  '/:id', 
  () => {}
  //deleteBookController
);

export default router