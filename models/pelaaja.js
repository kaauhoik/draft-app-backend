const mongoose = require('mongoose')


const pelaajaSchema = new mongoose.Schema({
  nimi:  { 
    type: String,
    minLength: 3,
    required:true
  },
  lipukkeet: {
    type: Number,
    min: 1,
  },
  ip: String
})

pelaajaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Pelaaja', pelaajaSchema)
