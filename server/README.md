# API DE CONTATOS

Este projeto é uma REST API para gerenciar lisvros, permitindo operações de criação, leitura, atualização e exclusão (CRUD). Construída com Express e conectada a um banco de dados MySQL em container Docker usando Sequelize ORM, e validações dos tipos com schemas Zod.

## Instalação

Para executar o projeto sigas as etapas a seguir.

**Pré-requisitos**

- Node.js
- Docker ou Banco de Dados MySQL

### Passos para instalação

- Nas extensões busque por `@recommended` e instale as extensões recomendadas (elas foram configuradas em `.vscode/extensios.json`)
- Instale as dependencias com `npm install`
- COnfigure as variaveis de ambiente:

```bash
APP_URL=http://localhost
APP_PORT=3000

MYSQL_ROOT_PASSWORD=[your-password] # escolha a senha root
MYSQL_DATABASE=[your-database] # escolha um nome para o banco de dados

DATABASE_URL="mysql://root:[your-password]@localhost:3306/[your-database]" // substitua pelos mesmo valores anteriores
```

- Abra o Docker Desktop ou a extensão do Docker
- Suba os containers Docker com o comando `docker-compose up -d`

O Docker Compose vai subir dois containers, um do banco de dados MySQL para persistência dos dados e outro para um micro SGBD chamado Adminer caso precise acessar diretamente o banco de dados em casos exepcionais. Porém existe um comando `npm run studio` que também abre uma tabela com os dados do banco de dados porém é do próprio Prisma, um ORM que estou usando para realizar as consultas SQL. 

- Execute o comando `npm run prisma`


## Uso

- Para testar configurei arquivo `api.http` para realizar as requisições (desde que instalada a extensão REST Client).

```
# @name createdContact
POST {{baseUrl}}/contatos HTTP/1.1
Content-Type: application/json

{
  "nome": "Darlley Brasil",
  "telefone": "5567999999999"
}

###
@contactId = {{ createdContact.response.body.id }}
###
```

`@name createdContact` cria uma variavel ou alais createdContact para podermos acessar o valor retornado da requisição, assim capturar o ID `@contactId = {{ createdContact.response.body.id }}` e reutilizar nas outras requisições sem ter que ficar alterando manualmente.


## Arquitetura

📁 src
├── 📁 controllers
│   └── contact.controller.ts
├── 📁 domain
│   └── 📁 entities
│       └── contact.entity.ts
├── 📁 routes
│   └── contact.route.ts
├── 📁 services
│   └── contact.service.ts
├── 📁 util
│   └── prisma.util.ts
├── env.ts
└── server.ts

- `src/env.ts` contém nossa validação das variaveis de ambiente com Zod.
- `src/server.ts` Ponto de entrada da aplicação com Express.
- `src/util/prisma.util.ts` Inclui a configuração do Prisma.
- `src/domain/entities/contact.entity.ts` Entidade de Contato.
- `src/routes/contact.route.ts` Rotas do sistema, conectando aos controladores.
- `src/controllers/contact.controller.ts` Os controladores lidam com as requisições HTTP.
- `src/services/contact.service.ts` Interações com o banco de dados.

Algumas coisas emprestei do Clean Architecture por que anda não domino a arquitetura. A forma de lidar eu tentei me aproximar de como o Nestjs organiza, definindo DTO com as Entidades com schemas do Zod, as rotas sendo definidas como controllers e exectando uma service que realiza a lógica de negócios e as consultas ao banco de dados.

## Modelo do Banco de dados

```sql
model Contact {
  id Int @id @default(autoincrement())
  nome String
  telefone String @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("contatos")
}
```

- Fiquei na dúvida entre tratar o ID como `id Int @id @default(autoincrement())` ou `id String @default(cuid())` geramente eu optaria pelo `cuid()` para para deixar mais simples optei pela primeira.
- Optei por permitir cadastrar somente um numero de telefone `@unique`.
- Alterei o nome da tabela no banco de dados com `@@map("contatos")` para não gerar o mesmo nome da model (Contact).

## Validações

Eu criei um Schema com Zod para validar os campos do Contato:

```typescript
import { z } from "zod";

export const contactSchema = z.object({
  nome: z.string({
    message: "Nome deve ser uma string valida"
  }).refine((value) => {
    const words = value.split(" ");

    if (words.length < 2) return false;

    return words.every(word => word.length >= 3);
  }, {
    message: "Nome deve conter nome e sobrenome (mínimo 3 letras)",
  }),
  telefone: z.string({
    description: "Telefone deve conter DDD + 9 digitos, exemplo: 5567999999999"
  }).min(13, {
    message: "Telefone deve conter no mínimo 13 digitos (DDD + 9 digitos)",
  }).max(13, {
    message: "Telefone deve conter no máximo 13 digitos (DDD + 9 digitos)"
  }),
})

export type Contact = z.infer<typeof contactSchema>
```

Neste caso contactSchema tem duas propriedades string:

- Para o nome eu criei uma valdiação customizada para duas palavras com 3 letras cada, usando o método `.refine()`
- Para telefone apenas especifiquei que deveria ter no minimo e no máximo 13 caracteres.

O Zod infere os tipos do contato baseado no schema, utilizo os tipo inferido para props e objetos, e o schema utilzio no middleware do Express para valdiar se o request.body esta seguindo a estruura e os tipos corretos:


```typescript
// contact.route.ts
(req: Request, response: Response, next: NextFunction) => {
  try {
    contactSchema.parse(req.body); // o Zod esta validando o request.body 
    next(); // Deixa o handle (controller) ser executado
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
```