const mongoose = require('mongoose')

const arvontaSchema = new mongoose.Schema({
    nimi: {
        type: String,
        minLength: 3,
        required: true
    },
    jarjestys: Number,
    ip: String,
    id: String
})

arvontaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Arvonta', arvontaSchema)