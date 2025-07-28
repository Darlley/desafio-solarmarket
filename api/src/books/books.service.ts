import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) { }

  create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  findAll() {
    return this.bookRepository.find()
  }

  findOne(id: string) {
    const book = this.bookRepository.findOneBy({ id })
    if(!book){
      throw new Error('Livro não encontrado');
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOneBy({ id })
    
    if(!book){
      throw new NotFoundException('Livro não encontrado');
    }

    const updatedBook = this.bookRepository.merge(book, updateBookDto);
    return await this.bookRepository.save(updatedBook);
  }

  async remove(id: string) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return await this.bookRepository.remove(book);
  }
}
