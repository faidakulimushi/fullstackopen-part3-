const express = require('express')
const app = express()

// IMPORTANT: allows reading JSON data from requests
app.use(express.json())

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

// GET all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// GET one person
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (!person) {
    return res.status(404).json({ error: 'person not found' })
  }

  res.json(person)
})

// DELETE person
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

/*
===========================
STEP 3.5: ADD NEW PERSON
===========================
*/
app.post('/api/persons', (req, res) => {
  const body = req.body

  // 1. Validate input
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  // 2. Check if name already exists
  const nameExists = persons.some(p => p.name === body.name)

  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  // 3. Create new person
  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(), // random ID
    name: body.name,
    number: body.number
  }

  // 4. Add to array
  persons = persons.concat(newPerson)

  // 5. Return new person
  res.json(newPerson)
})

// start server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})