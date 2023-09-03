const moongose = require('mongoose')
const { server } = require('../index')
const Note = require('../models/Note')
const { api, initialNotes, getAllContentFromNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})
  console.log('BeforeEach')

  // En paralelo

  const notesObjects = initialNotes.map(note => new Note(note))
  const promises = notesObjects.map(note => note.save())
  await Promise.all(promises)

  // en secuencial

  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('Get all notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('There are two notes', async () => {
    const {
      contents
    } = await getAllContentFromNotes()
    expect(contents).toContain('Aprendiendo FullStack JS con midudev')
  })

  test('The first note is Reivaj', async () => {
    const {
      contents
    } = await getAllContentFromNotes()
    expect(contents).toContain('Aprendiendo FullStack JS con midudev')
  })
})

describe('Create a note', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'next week async/await',
      imporant: true
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('a note wiouth content cant be added', async () => {
    const newNote = {
      imporant: true
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

test('a note can be delate', async () => {
  const { response: firstResponse } = await getAllContentFromNotes()
  const { body: notes } = firstResponse
  const noteToDelete = notes[0]
  await api.delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
  const { contents, response: secondResponse } = await getAllContentFromNotes()

  expect(secondResponse.body.length).toHaveLength(initialNotes.length - 1)
  expect(contents).not.toContain(noteToDelete.content)
})

test('a note that do not exist can not be delate', async () => {
  await api.delete('/api/notes/1234').expect(400)

  const { response } = await getAllContentFromNotes()

  expect(response.body.length).toHaveLength(initialNotes.length)
})

// Recibe un callback despues de que terminan todos los test
afterAll(() => {
  moongose.connection.close()
  server.close()
})
