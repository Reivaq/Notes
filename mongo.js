// const password = require('./password.js')
const mongoose = require('mongoose')
const { Schema } = mongoose
const { model } = mongoose

const connectionString = process.env.MONGO_DB_URI
// const connectionString = `mongodb+srv://Rey:${password}@cluster0.aw0mjm1.mongodb.net/Notes?retryWrites=true&w=majority`

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
