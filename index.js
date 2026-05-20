<<<<<<< HEAD
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose') 
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const Note = require('./models/note')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'build')))

// GET all notes
app.get('/api/notes', (req, res, next) => {
  Note.find({})
    .then(notes => {
      res.json(notes)
    })
    .catch(error => next(error))
})


app.get('/info', (req, res, next) => {
  Note.countDocuments({})
    .then(count => {
      const date = new Date()

      res.send(`
        <p>Notes app has info for ${count} notes</p>
        <p>${date}</p>
      `)
    })
    .catch(error => next(error))
})

// GET one note
app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// ADD note
app.post('/api/notes', (req, res, next) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    important: body.important ?? false,
  })

  note.save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => next(error))
})

// DELETE note
app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = req.body

  const note = {
    content,
    important,
  }

  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

// ERROR HANDLER (must be LAST)
app.use(middleware.errorHandler)


=======
// phonebook-backend/index.js

const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()
const PORT = 3001
const filePath = './db.json'

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

 

// ---------- Helpers ----------
const getPersons = () => {
  const data = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(data).persons
}

const savePersons = (persons) => {
  fs.writeFileSync(
    filePath,
    JSON.stringify({ persons }, null, 2)
  )
}

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

// ---------- Routes ----------

// Home
app.get('/', (req, res) => {
  res.send('<h1>Phonebook Backend Running</h1>')
})

// Info page
app.get('/info', (req, res) => {
  const persons = getPersons()
  const date = new Date()

  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

// Get all persons
app.get('/api/persons', (req, res) => {
  res.json(getPersons())
})

// Get one person
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const persons = getPersons()

  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).json({ error: 'person not found' })
  }
})

// Add person
app.post('/api/persons', (req, res) => {
  const body = req.body
  const persons = getPersons()

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  const exists = persons.find(
    p => p.name.toLowerCase() === body.name.toLowerCase()
  )

  if (exists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons.push(newPerson)
  savePersons(persons)

  res.json(newPerson)
})

// Delete person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  const persons = getPersons().filter(
    p => p.id !== id
  )

  savePersons(persons)

  res.status(204).end()
})

// Unknown endpoint
app.use((req, res) => {
  res.status(404).json({
    error: 'unknown endpoint'
  })
})

// Start server
>>>>>>> ccd4b179b518d65099327328031c44664e2f165a
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})