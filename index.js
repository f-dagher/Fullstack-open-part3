const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


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
    response.json(persons)
  })

//info api as a webpage
app.get('/api/info', (request, response) => {
  let personsLength = persons.length;
  let info = 
    `
    <p> Phonebook has info for ${personsLength} people <p> 
    <p> ${date} </p
    `
  response.send(info)
})

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

//delete a person from phonebook
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

//post a new person to the API
app.post('/api/persons', (request, response) => {
  const body = request.body
  const names = persons.map(person => person.name.toLowerCase());

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
  if (names.includes(body.name.toLowerCase())){
    console.log('error, name must be unique')
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  console.log(`added ${person.name}`)
  response.json(person)
})

const PORT = process.env.PORT || "8080";
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})