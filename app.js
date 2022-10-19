const config = require('./utils/config')
const express = require('express');
const app = express();
const cors = require('cors');
const pelaajatRouter = require('./controllers/pelaajat')
const arvontaRouter = require('./controllers/arvonta')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})


app.use(cors())
app.use(express.json());
app.use(middleware.requestLogger)
app.use('/api/pelaajat', pelaajatRouter)
app.use('/api/arvonta', arvontaRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)




module.exports =  app 