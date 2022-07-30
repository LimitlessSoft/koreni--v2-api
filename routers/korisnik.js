var express = require('express')
var router = express.Router()
var sql = require('../db')
const { createHash } = require('crypto')

const tokenStash = []

global.isAdmin = function(request) {
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

        if(tokenStash[ti].tip == 1338) {
            return true
        } else {
            return false
        }
    }

    return false
}

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
            return null
        }

    var bearerToken = request.headers.authorization.substring(7, request.headers.authorization.length)
    
    if(existsInTokenStash(bearerToken)) {
        var ti = tokenStash.findIndex(item => item.token == bearerToken)
        if (ti == -1) {
            return null
        }

        return tokenStash[ti].username
    }

    return null
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

    sql.query(`select pw, tip, display_name, username from korisnik where username = '${req.query.username}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.json(resp)
    })
})

router.get('/list', function(req, res) {

    sql.query(`select username, pw, tip, display_name from korisnik`, (err, resp) => {
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

    sql.query(`select pw, tip from korisnik where username = '${rbody.username}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        var hp = hashPassword(rbody.password)

        if(hp == resp[0].pw) {
            var newToken = null
            while(newToken == null || existsInTokenStash(newToken)) {
                newToken = sHash(Math.floor(Math.random() * 10000).toString())
            }
            tokenStash.push({username: rbody.username, token: newToken, tip: resp[0].tip})
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

    sql.query(`select pw, tip, display_name, username from korisnik where username = '${un}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.json(resp[0])
    })
})

router.post('/insert', function(req, res) {
    
    if(req == null || req.body.key == null || req.body.key != '3998f96e953bc1cb377f2269d637ebb5965f4e271f09e5c61664c807324e9f7b' )
    {
        if(!global.isAdmin(req)) {
            return res.status(403).end()
        }
    }
    if(req.body.username == null) {
        return res.status(400).send(`Morate proslediti parametar 'username'`).end()
    }

    if(req.body.username.trim().length < 5) {
        return res.status(400).send(`Parametar 'username' mora imati najmanje 5 karaktera!`).end()
    }

    if(req.body.username.trim().length > 16) {
        return res.status(400).send(`Parametar 'username' mora imati maksimum 16 karaktera!`).end()
    }

    if(req.body.tip == null) {
        return res.status(400).send(`Morate uneti parametar 'tip'`).end()
    }

    if(req.body.displayName == null) {
        return res.status(400).send(`Morate proslediti parametar 'displayName'`).end()
    }

    if(req.body.displayName.trim().length < 5) {
        return res.status(400).send(`Parametar 'displayName' mora imati najmanje 5 karaktera!`).end()
    }

    if(req.body.displayName.trim().length > 32) {
        return res.status(400).send(`Parametar 'displayName' mora imati maksimum 32 karaktera!`).end()
    }

    if(req.body.password == null || req.body.password.trim().length == 0) {
        return res.status(400).send(`Morate proslediti parametar 'passwod'!`)
    }

    sql.query(`select count(username) as BR from korisnik where username = '${req.body.username}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        if(resp[0].BR > 0) {
            return res.status(400).send(`Ovaj username je vec zauzet!`).end()
        }
    })

    var sifra = hashPassword(req.body.password)

    sql.query(`insert into korisnik (username, pw, tip, display_name)
        values ('${req.body.username.trim()}', '${sifra}', ${req.body.tip}, '${req.body.displayName.trim()}')`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(201).end()
    })
        
})

module.exports = router