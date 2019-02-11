require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const PORT = process.env.PORT || 3001
const BASEURL = '/api/persons'

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('postData', (req, res) => 
  Object.keys(req.body).length ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '045-1236543',
  },
  {
    id: 2,
    name: 'Arto Järvinen',
    number: '041-21423123',
  },
  {
    id: 3,
    name: 'Lea Kutvonen',
    number: '040-4323234',
  },
  {
    id: 4,
    name: 'Martti Tienari',
    number: '09-784232',
  },
]

const getRandInt = () => Math.floor(Math.random() * (Math.pow(2, 31) - 1))
const generateId = () => {
  //js tukee suurempia int:eja, mutta tieda sitten jos kaytetaan tietokantoja jne..?
  //implementoi tarkastus, onko id jo kaytossa! =>
  return getRandInt()
}

const generateErrorJson = (message) => {
  //return {error: field.concat(' missing')}
  return {error: message}
}

app.get(BASEURL, (req, res) => {
  //res.json(persons)
  Person.find({}).then(persons => {
    res.json(persons.map(p => p.toJSON()))
  })
})

app.get(BASEURL + '/:id', (req, res) => {
  /*
  Person.find({ _id: req.params.id }).then(persons => {
    res.json(persons.map(p => p.toJSON()))
  }).catch(err => {
    console.log('ERROR ERROR when getting single person from DB: ', err.message)
    res.status(404).end()
  })*/
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON())
  }).catch(err => {
    console.log('ERROR ERROR when getting single person from DB: ', err.message)
    res.status(404).end()
  })
  /*
  //const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  person ? res.json(person) : res.status(404).end()
  */
})

app.delete(BASEURL + '/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`<p>Puhelinluettelossa on ${count} henkilön tiedot</p>
                <p>${new Date().toString()}</p>`)
    })
    .catch(err => {
      console.log('ERROR ERROR when trying to count amount of persons in DB: ', err.message)
    })
  //const message = `<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
  //                <p>${new Date().toString()}</p>`
  //res.send(message)
})

app.post(BASEURL, (req, res) => {
  //console.log('post: ', req.headers)
  //console.log(req.get('Content-Type').toLowerCase())
  //console.log('post: ', req.get('Content-Type').toLowerCase() === 'application/json')
  //const contentHeader = req.get('Content-Type')
  //if (contentHeader) {
  //  console.log('oli headerit: ', contentHeader)
  //  if (contentHeader.toLowerCase() !== 'application/json') {
  //    console.log('vaikkakin vaaria')
  //    return res.status(400).json(
  //      generateErrorJson('Unsupported Content-Type, must be \'application/json\''))
  //  }
  //} else {
  //  console.log('EI headereita')
  //  return res.status(400).json(
  //    generateErrorJson('No headers included'))
  //}
  //console.log('tultiin tanne')
  
  /* TALLENTAA LISTAAN, ENNEN MONGOOSEA!
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json(generateErrorJson('name missing'))
  } else if (body.number === undefined) {
    return res.status(400).json(generateErrorJson('number missing'))
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  if (persons.find(p => p.name === newPerson.name)) {
    return res.status(400).json(
      generateErrorJson(`name '${newPerson.name}' already in database, must be unique`))
  } else if (persons.find(p => p.number === newPerson.number)) {
    return res.status(400).json(
      generateErrorJson(`number '${newPerson.number}' already in database, must be unique`))
  }
  
  //console.log(newPerson)
  persons = persons.concat(newPerson)
  res.json(newPerson)
  */
  const body = req.body
  
  if (body.name === undefined) {
    return res.status(400).json(generateErrorJson('name missing'))
  } else if (body.number === undefined) {
    return res.status(400).json(generateErrorJson('number missing'))
  }
  
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })

})

const unknownEndpoint = (req, res) => {
  res.status(404).send(generateErrorJson('unknown endpoint'))
}

app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`puhluettelo backend running and listening on port ${PORT}`)
})
