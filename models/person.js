const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const uniqueValidator = require('mongoose-unique-validator')


const url = process.env.MONGODB_URI

console.log('Connecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
  .then(res => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('Error connection to MongoDB:', err.message)
  })

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true,
      unique: true
    },
    number: {
      type: String,
      minlength: 8,
      required: true
    },
  })
  
  personSchema.plugin(uniqueValidator)

  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)