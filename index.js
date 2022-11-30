require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

app.use(express.json())

app.use(cors())

app.use(express.static('build'))

//morgan middleware
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const date = new Date()

 //Regular main page
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

//persons api, all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})



//info api as a webpage
app.get('/api/info', (request, response) => {
  Person.find({}).then(persons => {
    let personsLength = persons.length;
    let info = 
    `
    <p> Phonebook has info for ${personsLength} people <p> 
    <p> ${date} </p
    `
  response.send(info)
  })
})

//get a single person from phonebook. Respond with error if there isn't an ID.
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person){
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

//delete a person from phonebook
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

//post a new person to the API
app.post('/api/persons', (request, response) => {
  const body = request.body
  //const names = persons.map(person => person.name.toLowerCase());

  if (!body.name) {
    console.log('error, missing name')
    return response.status(400).json({ 
      error: 'missing name' 
    })
  }
  else if (!body.number) {
    console.log('error, missing number')
    return response.status(400).json({ 
      error: 'missing number' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(result => {
    console.log(`added ${body.name} number ${body.number}`)
    response.json(person)
  })
})

//Update a person's number if ID exists (i.e Name is in the phonebook)
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { name: body.name, number: body.number})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || "8080";
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//removed ability to check if name is unique for now
/*
  if (names.includes(body.name.toLowerCase())){
    console.log('error, name must be unique')
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
*/

//persons 
/*
let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
      },
      { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
      },
      { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
      },
      { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
      }
]

//old delete
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(`deleting name with id ${id}`)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

//generate a random ID with a range from maxId to (maxId + 1 000 000 000)
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  return Math.floor(Math.random() * 1000000000) + maxId;
}

//get a single person from phonebook. Respond with error if there isn't an ID.
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

*/