const express = require('express')
const cors = require('corse')
const app = express()
const logger = require('./loggerMiddleware')

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

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

// Forma dinamica de recuperar algo del pas
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
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

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    ide: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = notes.concat(newNote) // notes = [ ... notes, newNote]

  response.status(201).json(newNote)
})
app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found'
  })
})
const PORT = 3001 // Sre define el puerto en el cual va a escuchar
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
