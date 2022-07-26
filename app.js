var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var cookieParser = require('cookie-parser')

var app = express()

app.use(cors({ origin: ['http://localhost:3001', 'http://localhost:3002'], allowedHeaders: '*'}))

app.use(cookieParser())
app.use(bodyParser.json({limit: "10mb", extended: true}))
app.use(bodyParser.urlencoded({ extended: true }))

var apiKorisnik = require('./routers/korisnik')
app.use('/korisnik', apiKorisnik)

var apiKorisnikTip = require('./routers/korisnikTip')
app.use('/korisnik/tip', apiKorisnikTip)

var apiClanak = require('./routers/clanak')
app.use('/clanak', apiClanak)

app.listen(3000)
console.log("Started @ http://localhost:3000/")