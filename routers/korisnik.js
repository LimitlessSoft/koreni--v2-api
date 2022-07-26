var express = require('express')
var router = express.Router()
var sql = require('../db')
const { createHash } = require('crypto')

const tokenStash = []

global.verifyToken = function(request) {
    if(request == null ||
        request.headers == null ||
        request.headers.authorization == null) {
            return false
        }

    var bearerToken = request.headers.authorization.substring(7, request.headers.authorization.length)

    if(existsInTokenStash(bearerToken)) {
        return true
    }

    return false
}

global.getUsernameByRequest = function(request) {
    if(request == null ||
        request.headers == null ||
        request.headers.authorization == null) {
            return false
        }

    var bearerToken = request.headers.authorization.substring(7, request.headers.authorization.length)
    
    if(existsInTokenStash(bearerToken)) {
        var ti = tokenStash.findIndex(item => item.token == bearerToken)
        if (ti == -1) {
            return false
        }

        return tokenStash[ti].username
    }

    return false
}

function existsInTokenStash(value) {
    if (tokenStash.findIndex(item => item.token == value) == -1) {
        return false
      } else {
        return true 
      }
}

function hashPassword(rawPassword) {
    return sHash(sHash(sHash(sHash(sHash(sHash(rawPassword))))))
}

function sHash(string) {
    return createHash('sha256').update(string).digest('hex').toUpperCase();
}

router.get('/get', function(req, res) {
    if(req.query.username == null) {
        res.status(400).send("Morate proslediti parametar `username`").end()
    }

    sql.query(`SELECT PW, TIP, DISPLAY_NAME, POSLEDNJE_PLACEN_MESEC, USERNAME FROM KORISNIK WHERE USERNAME = '${req.query.username}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.json(resp)
    })
})

router.get('/list', function(req, res) {

    sql.query(`SELECT USERNAME, PW, TIP, DISPLAY_NAME, POSLEDNJE_PLACEN_MESEC FROM KORISNIK`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.json(resp)
    })
})

router.post('/token/generate', function(req, res) {
    var rbody = req.body

    if(rbody.username == null || rbody.password == null) {
        return res.status(400).send("You must provide username and password!").end()
    }

    sql.query(`SELECT PW FROM KORISNIK WHERE USERNAME = '${rbody.username}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        var hp = hashPassword(rbody.password)

        if(hp == resp[0].PW) {
            var newToken = null
            while(newToken == null || existsInTokenStash(newToken)) {
                newToken = sHash(Math.floor(Math.random() * 10000).toString())
            }
            tokenStash.push({username: rbody.username, token: newToken})
            return res.status(200).send(newToken)
        }
        return res.status(403).end()
    })
})

router.post('/token/verify', function(req, res) {
    if(global.verifyToken(req)) {
        return res.status(200).end()
    }
    return res.status(403).end()
})

router.get('/getbytoken', function(req, res) {
    if(!global.verifyToken(req)) {
        return res.status(403).end()
    }

    var un = global.getUsernameByRequest(req)

    sql.query(`SELECT PW, TIP, DISPLAY_NAME, POSLEDNJE_PLACEN_MESEC, USERNAME FROM KORISNIK WHERE USERNAME = '${un}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.json(resp[0])
    })
})

module.exports = router