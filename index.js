require('dotenv').config()
require('./mongo')

require('./mongo.js') // Primero debe realizar la conexion

const express = require('express')
const cors = require('corse')
const app = express()
const logger = require('./loggerMiddleware')
const Note = require(' ./models/Note ')
const notFound = require('./notFound')
const handleErrors = require('./handleErrors')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

// const connectDB = require('./mongo.js')
// connectDB()

require('./mongo.js')

app.use(express.json()) // Maydelwer
// eslint-disable-next-line linebreak-style
app.use(cors())
app.use(logger)
let notes = [
  {
    id: 1,
    content: 'HTML is eisser',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript ',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1> Hello Word </h1>')
})

Sentry.init({
  dsn: 'https://sentry.io/for/javascript/?original_referrer=https%3A%2F%2Fwww.google.com%2F',
  integrations: [
    new Sentry.integrations.Http({ tracing: true }),

    new Tracing.Integrations.Express({ app })

  ],
  tracesSampleRate: 1.0
})

// Forma dinamica de recuperar algo del pas
app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

app.use((request, response, next) => {
  response.status(404).end()
})

// Editar contenido y saber si es importante o no
app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body
  const newNoteInfo = {
    content: note.content, // Corregido "contend" a "content"
    important: note.important
  }
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }) // Corregido "findByIdUpdate" a "findByIdAndUpdate" y agregado el objeto de opciones
    .then((result) => {
      response.json(result)
    })
    .catch((error) => {
      next(error) // Manejo de errores
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  Note.findByAndRemove(id).then(result => {

  }).catch(error => next(error))
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  // const ids = notes.map(note => note.id)
  // const maxId = Math.max(...ids)

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })

  response.status(201).json(newNote)
})
app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found'
  })
})

app.use(notFound)

app.use(handleErrors)
const PORT = process.env || 3001 // Sre define el puerto en el cual va a escuchar
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) // Escuha al puerto 3001

/* Con Http

//const http = require('http')  // esto es similar a relaizar un import http from 'http'
 const app = http.createServer((request, response) => {   // Forma de crear un servidor
    response.writeHead(200, { 'Content-Type': 'application/json' })  // Cada ves que le llegue una peticon al sertvidor se ejecuta
    response.end(JSON.stringify (notes))// esta es la forma correcta de realizar la convercion de una cadena a strings
  })

*/
