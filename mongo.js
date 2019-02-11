const mongoose = require('mongoose')
/*
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const ATLASDB_USER = process.env.ATLAS_USER
  ? process.env.ATLAS_USER
  : process.argv[2]
const ATLASDB_PASSWRD = process.env.ATLAS_PASS
  ? process.env.ATLAS_PASS
  : process.argv[3]
if (ATLASDB_USER === undefined
    || ATLASDB_PASSWRD === undefined) {
  console.log('give user and password as arguments')
  process.exit(1)
}
*/

if (process.argv.length < 3) {
  console.log('give password as an argument')
  process.exit(1)
}

const ATLASDB_USER = 'tayspino'
const ATLASDB_PASSWRD = process.argv[2]

const url = `mongodb+srv://${ATLASDB_USER}:${ATLASDB_PASSWRD}@hy-fullstack-cluster-gie04.mongodb.net/numbers-app?retryWrites=true`
//console.log('using url: ', url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

const getAndPrintAll = (Person) => {
  mongoose.connect(url, { useNewUrlParser: true })
  console.log('puhelinluettelo: ')
  Person.find({}).then(res => {
    res.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
}

const insertNew = (person) => {
  mongoose.connect(url, { useNewUrlParser: true })
  person.save().then(res => {
    console.log(`lisätään ${person.name} numero ${person.number} luetteloon`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  getAndPrintAll(Person)
} else if (process.argv.length === 5) {
  insertNew(new Person({
    name: process.argv[3],
    number: process.argv[4],
  }))
} else {
  console.log('got incorrect amount of arguments')
  process.exit(1)
}


/*
const person = new Person({
  name: 'Tieto Kanta',
  number: '123-2233445',
})
*/
/*
person.save().then(res => {
  console.log(res)
  console.log('person saved!')
  mongoose.connection.close()
})
*/
/*
Person.find({}).then(res => {
  console.log('puhelinluettelo:')
  res.forEach(p => {
    console.log(`${p.name} ${p.number}`)
  })
  mongoose.connection.close()
})
*/