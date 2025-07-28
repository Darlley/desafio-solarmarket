# DESAFIO SOLARMARKET

https://github.com/user-attachments/assets/bb9e1413-f73e-4297-8244-b69261817b28

## BACKEND

Inicialmente fiz uma API REST em Express mas mudei para **Nestjs** usando MySQL em container Docker, Sequelize ORM. 

1. Entre na pasta `api`
2. Altere as chaves api no arquivo `.env-example` e renomeie para `.env`

```bash
APP_URL=http://localhost
APP_PORT=3000
MYSQL_ROOT_PASSWORD=[your-password] # escolha a senha root
MYSQL_DATABASE=[your-database] # escolha um nome para o banco de dados
DATABASE_URL="mysql://root:[your-password]@localhost:3306/[your-database]" // substitua pelos mesmo valores anteriores
```

3. Suba o container Docker do MySQL com o comando `docker compose up -d`

O Docker Compose vai subir dois containers, um do banco de dados MySQL para persistência dos dados e outro para um micro SGBD chamado Adminer caso precise acessar diretamente o banco de dados em casos exepcionais. Porém existe um comando npm run studio que também abre uma tabela com os dados do banco de dados porém é do próprio Prisma, um ORM que estou usando para realizar as consultas SQL.

4. Instale as dependencias com `npm install`
5. Execute a aplicação `npm run start`
6. Teste a API com o arquivo `api.http` *(execute a listagem de livros por exemplo)*

Para testar configurei arquivo api.http para realizar as requisições (desde que instalada a extensão REST Client).

@name createdBook cria uma variavel ou alias createdBook para podermos acessar o valor retornado da requisição, assim capturar o ID @bookId = {{ createdBook.response.body.id }} e reutilizar nas outras requisições sem ter que ficar alterando manualmente.


```
# @name createdBook
POST {{baseUrl}}/books HTTP/1.1
Content-Type: application/json

{
  "title": "O Senhor dos Anéis: A Sociedade do Anel",
  "author": "J.R.R. Tolkien",
  "isbn": "9788595084759",
  "publicationDate": "2019-03-19T14:30:00-03:00",
  "genre": "fantasia",
  "language": "pt-br",
  "coverUrl": "https://m.media-amazon.com/images/I/81hCVEC0ExL._SY466_.jpg"
}
```

Minha API com Express foi bem mais manual e deu mais trabalho por que utilziei o meu [boilerplate](https://github.com/Darlley/setup-node-2025) e uma arquitetura com domain e services da Clean Archtecture por que não domino plenamente.

Com Nestjs eu apenas fiz o setup do TypeORM pesquisando por videos por que não utilizei este ORM, com Express fiz com Sequelize que também não tenho familiaridade, o ORM que mais tenho familiaridade é o Prisma. Mas ja utilizei Nestjs antes na minha ultima experiência (com MongoDB).

#### Modelo do Banco de dados

Mais de 4 campos:

```
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //...
}
````

Fiquei na dúvida entre tratar o ID como um inteiro sequencial (o padrão) ou uuid aleatório, mas utilizei o segundo.

--- 

## FRONTEND

No frontend uso **Nextjs** com Tanstack Query e Shadcn.

1. Entre na pasta `front`
2. Instale as dependencias com `npm install`
3. Execute a aplicação `npm run dev`

Inicialmente a tela estará vazia:

<img width="1919" height="1079" alt="Captura de tela 2025-07-27 213552" src="https://github.com/user-attachments/assets/c0a87168-9f7a-4814-9a72-a3d6070d52e6" />

4. Clique no botão *"Criar livro"*:

<img width="1919" height="1079" alt="Captura de tela 2025-07-27 213601" src="https://github.com/user-attachments/assets/f6686f5b-7043-490f-afe6-5f400f3c37cf" />

5. Preencha as informações:

<img width="1919" height="1079" alt="Captura de tela 2025-07-27 213906" src="https://github.com/user-attachments/assets/02a0a2e4-c135-479d-9066-31ef9e829531" />

6 Agora você pode editar ou excluir e cadastrar novos livros com um slider interativo.

<img width="1919" height="1079" alt="Captura de tela 2025-07-27 213917" src="https://github.com/user-attachments/assets/c7f986bb-a5b0-4c24-92b0-34d0f81430a0" />

- Utilizei o componente de slide do [skiper-ui](https://skiper-ui.com/docs/components/card-swipe) 
- Utilizei o componente de tabela do [originui](https://originui.com/table)
- Na criação de um livro utilize também o [tiptap](https://tiptap.dev/docs/examples/basics/default-text-editor)
- Devido às formatações de texto na descrição (italico, bold, etc) utilizei o [Isomorphic DOMPurify](https://www.npmjs.com/package/isomorphic-dompurify) para sanetizar o HTML para que não seja injetado código malicioso.