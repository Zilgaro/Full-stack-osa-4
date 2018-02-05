const mongoose = require('mongoose')


const url = 'mongodb://fullstack:sekred@ds223578.mlab.com:23578/fullstack-db'

mongoose.connect(url)
mongoose.Promise = global.Promise

const expectedNumOfArguments = 2

//Ekat kaksi ovat aina node ja itse skriptin sijainti
const arguments = process.argv.slice(2)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (arguments.length == expectedNumOfArguments) {
  if (typeof arguments[0] === 'string' && typeof arguments[1] === 'string' ) {
    const person = new Person({
      name: arguments[0],
      number: arguments[1]
    })

    person
      .save()
      .then(response => {
        console.log(`lisätään henkilö ${response.name} numero ${response.number} luetteloon`)
        mongoose.connection.close()
      })
  }
} else {
  Person
    .find({})
    .then(result => {
      console.log('puhelinluettelo:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}` )
      })
      mongoose.connection.close()
    })
}
