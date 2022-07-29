var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var cookieParser = require('cookie-parser')

var app = express()

app.use(require('express-status-monitor')())

app.use(cors({ origin: '*', allowedHeaders: '*'}))

app.use(cookieParser())
app.use(bodyParser.json({limit: "10mb", extended: true}))
app.use(bodyParser.urlencoded({ extended: true }))

var apiKorisnik = require('./routers/korisnik')
app.use('/korisnik', apiKorisnik)

var apiKorisnikTip = require('./routers/korisnikTip')
app.use('/korisnik/tip', apiKorisnikTip)

var apiClanak = require('./routers/clanak')
app.use('/clanak', apiClanak)

var apiAktivnost = require('./routers/aktivnost')
app.use('/aktivnost', apiAktivnost)

var apiIzostanak = require('./routers/izostanak')
app.use('/izostanak', apiIzostanak)

var apiIzgovor = require('./routers/izgovor')
app.use('/izgovor', apiIzgovor)

var apiClanarine = require('./routers/clanarina')
app.use('/clanarina', apiClanarine)

var apiAktivnostTip = require('./routers/aktivnostTip')
app.use('/aktivnost/tip', apiAktivnostTip)

var apiLink = require('./routers/link')
app.use('/link', apiLink)

app.listen(3000)
console.log("Started @ http://localhost:3000/")