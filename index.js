const express = require('express')
const cors = require('cors')
const readApis = require('./core')

const router = express.Router()
const app = express()
const bodyParser = require('body-parser')

const options = {
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: '*',
    preflightContinue: false,
}

const param = {
    port: 8082,
    path: './apis',
    status: 200,
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors(options))

readApis(app, param)

app.listen(param.port, function() {
    console.log(`CORS-enabled web server listening on port ${param.port}`)
})
