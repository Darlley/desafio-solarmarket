import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/entities/book.entity';

@Module({
  imports: [
    BooksModule,
    TypeOrmModule.forRoot({
      type: 'mysql', // Change to your database type
      host: 'localhost',
      port: 3306,
      username: '',
      password: '',
      database: '',
      entities: [Book],
      synchronize: true, // Set to false in production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
