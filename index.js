require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const PORT = process.env.PORT || 3001
const BASEURL = '/api/persons'

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

morgan.token('postData', (req, res) => 
  Object.keys(req.body).length ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
/*
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
*/
const getRandInt = () => Math.floor(Math.random() * (Math.pow(2, 31) - 1))
const generateId = () => {
  //js tukee suurempia int:eja, mutta tieda sitten jos kaytetaan tietokantoja jne..?
  //implementoi tarkastus, onko id jo kaytossa! =>
  return getRandInt()
}

const generateErrorJson = (message) => {
  return {error: message}
}

app.get(BASEURL, (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons.map(p => p.toJSON()))
  })
  .catch(error => next(error))
})

app.get(BASEURL + '/:id', (req, res, next) => {
  Person.findById(req.params.id)
  .then(person => {
    if (person) {
      res.json(person.toJSON())
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete(BASEURL + '/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`<p>Puhelinluettelossa on ${count} henkilön tiedot</p>
                <p>${new Date().toString()}</p>`)
    })
    .catch(error => next(error))
})

app.post(BASEURL, (req, res, next) => {
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
  }).catch(error => next(error))

})

const unknownEndpoint = (req, res) => {
  res.status(404).send(generateErrorJson('unknown endpoint'))
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log('VIRHETILANNE: ', error.message)
  //jos virhe on tietyn tyyppinen, kasitellaan se taalla
  //Tassa tapauksessa CastError-poikkeuksesta, eli virheellinen olioid
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send(generateErrorJson('malformatted id'))
  }
  //siirretaan virheenkasittely eteenpain
  //(expressin oletusarvoisen virheenkasittelijan hoidettavaksi)
  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`puhluettelo backend running and listening on port ${PORT}`)
})
