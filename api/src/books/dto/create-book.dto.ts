import {
  IsString,
  MinLength,
  IsOptional,
  Matches,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'Insira um titulo válido, somente letras.' })
  @MinLength(1, { message: 'Título é obrigatório.' })
  title: string;

  @IsString({ message: 'Autor deve conter pelo menos 3 caracteres.' })
  @MinLength(3, { message: 'Autor deve conter pelo menos 3 caracteres.' })
  author: string;
  
  @IsOptional()
  @IsString()
  description?: string;

  @Matches(/^\d{13}$/, {
    message: 'ISBN deve conter 13 dígitos numéricos.',
  })
  isbn: string;

  @IsDateString({}, { message: 'Data de publicação inválida.' })
  publicationDate: string;

  @IsString({ message: 'Gênero é obrigatório.' })
  @MinLength(3, { message: 'Gênero é obrigatório.' })
  genre: string;

  @IsString({ message: 'Idioma é obrigatório.' })
  @MinLength(2, { message: 'Idioma é obrigatório.' })
  language: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL da capa inválida.' })
  coverUrl?: string;
}
