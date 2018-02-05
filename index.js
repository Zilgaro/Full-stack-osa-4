const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('JSON', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :JSON :status :res[content-length] - :response-time ms'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})

    .then(persons => {
      response.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  Person
    .findById(id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })

})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(`<div>puhelinluettelossa ${persons.length} henkilön tiedot</div> <br>
                ${Date()}</br>`)
    })
})

app.put('/api/persons/:id', (request,response) => {
  const body = request.body

  const normalPerson = {name: body.name, number: body.number}

  Person
    .findByIdAndUpdate(request.params.id, normalPerson, {new: true} )
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  if (person.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (person.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  Person
    .find({name: person.name})
    .then(query => {
      console.log(query.length)
      if (query.length > 0) {
        response.status(400).send({error: 'Names must be unique!'})
      } else {
        person
          .save()
          .then(savedPerson => {
            response.json(Person.format(savedPerson))
          })
          .catch(error => {
            console.log(error)
          })
      }
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log(id)
  Person
    .findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
