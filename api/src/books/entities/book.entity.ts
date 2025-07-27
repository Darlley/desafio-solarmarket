import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;
  
  @Column({ type: 'text', nullable: true })
  description?: string;
  
  @Column()
  isbn: string;
  
  @Column()
  publicationDate: string;
  
  @Column()
  genre: string;
  
  @Column()
  language: string;
  
  @Column({ nullable: true })
  coverUrl?: string;
}
