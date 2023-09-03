// const password = require('./password.js')
const mongoose = require('mongoose')
const { Schema } = mongoose
const { model } = mongoose

// Extraemos todas las variables de entorno que necesitamos
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test' // jprocess.env.MONGO_DB_URI
// const connectionString = `mongodb+srv://Rey:${password}@cluster0.aw0mjm1.mongodb.net/Notes?retryWrites=true&w=majority`
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

if (!connectionString) {
  console.error(' Remember that you have an .env file with the environment variables defined and the MONGO_DB_URI that will serve as the connection string. In the class we use mongoDB Atlas but any mongo database can be used. ')
}
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })

const noteSchema = new Schema({
  content: String, // Changed 'connect' to 'content'
  date: Date,
  important: Boolean
})

const Note = model('Note', noteSchema) // Removed space before 'Note'

/* Otra forma

Note.find({}).then(result => {
    console.log(result)
    mongoose.connection.close() // Para no dejar conexiones abiertas
})
*/

const note = new Note({
  content: 'MongoDB is incredible, Reivaj', // Fixed typo and changed 'Reivaj' to 'Rey'
  date: new Date(),
  important: true
})

note.save()
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  })
  .catch(err => {
    console.error(err)
  })
