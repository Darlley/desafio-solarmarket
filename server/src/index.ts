import express from 'express'
import env from './env'
import BookRoutes from './routes/books.route'
import sequelize from './util/sequelize.util'
import './models/book.model' 

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/books', BookRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao MySQL com sucesso!');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
  })
  .catch((err: unknown) => console.error('Erro ao conectar ou sincronizar:', err));

app.listen(env.APP_PORT, () => {
  console.log(`Server is running on ${env.APP_URL}:${env.APP_PORT}`)
})