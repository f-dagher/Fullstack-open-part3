const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =`mongodb+srv://fdagher:${password}@cluster0.zh63jtr.mongodb.net/phonebook?retryWrites=true&w=majority&ssl=true`


mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: personName,
    number: personNumber,
})


if (personName && personNumber){
    person.save().then(result => {
        console.log(`added ${personName} number ${personNumber}`)
        mongoose.connection.close()
    })
}
else {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
}


