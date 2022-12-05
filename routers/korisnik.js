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

    sql.query(`select pw, tip,display_name, username, mobilni,
        datum_rodjenja, aktivan from korisnik where username = '${req.query.username}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.json(resp)
    })
})

router.get('/list', function(req, res) {

    sql.query(`select username, pw, tip, display_name, mobilni,
        datum_rodjenja, aktivan from korisnik`, (err, resp) => {
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

    sql.query(`select pw, tip, aktivan from korisnik where username = '${rbody.username}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        if(resp.length == 0) {
            return res.status(403).end()
        }

        var hp = hashPassword(rbody.password)

        if(hp == resp[0].pw) {

            if(resp[0].aktivan == 0) {
                return res.status(401).send('Nalog je jos uvek na obradi!').end()
            }
    
            if(resp[0].aktivan == 2) {
                return res.status(401).send('Nalog je blokiran!').end()
            }

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
    
    // req.body.datum_rodjejna se salje u formatu dd-MM-yyyy

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
        return res.status(400).send(`Morate proslediti parametar 'password'!`)
    }

    if(req.body.mobilni == null || req.body.mobilni.trim().length < 9) {
        return res.status(400).send(`Neispravan parametar 'mobilni'!`)
    }

    if(req.body.datum_rodjenja == null || req.body.datum_rodjenja.length != 10) {
        return res.status(400).send(`Neispravan parametar 'datum_rodjenja'!`)
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
    var datumParts = req.body.datum_rodjenja.split('-')
    var datumRodjenja = new Date(datumParts[2], (datumParts[1] * 1) - 1, (datumParts[0] * 1))

    sql.query(`insert into korisnik (username, pw, tip, display_name, mobilni, datum_rodjenja, aktivan)
        values ('${req.body.username.trim()}', '${sifra}', ${req.body.tip}, '${req.body.displayName.trim()}', ${sql.escape(req.body.mobilni)}, ${sql.escape(datumRodjenja)}, 0)`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(201).end()
    })
        
})

router.post('/delete', function(req, res) {
    if(req.body.username == null) {
        return res.status(400).send(`Morate proslediti parametar 'username'`).end()
    }

    sql.query(`delete from korisnik where username = ${sql.escape(req.body.username)}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        sql.query(`delete from clanarina where korisnik = ${sql.escape(req.body.username)}`, (err, resp) => {
            if(err) {
                console.log(err)
                return res.status(500).end()
            }

            sql.query(`delete from izostanak where username = ${sql.escape(req.body.username)}`, (err, resp) => {
                if(err) {
                    console.log(err)
                    return res.status(500).end()
                }

                return res.status(200).end()
            })
        })
        
    })
})

router.post('/password/set', function(req, res) {
    const newPW = hashPassword(req.body.password)
    sql.query(`update korisnik set pw = ${sql.escape(newPW)} where username = ${sql.escape(req.body.username)}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

router.post('/aktivan/set', function(req, res) {
    sql.query(`update korisnik set aktivan = ${sql.escape(req.body.aktivan)} where username = ${sql.escape(req.body.username)}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

router.post('/datum_rodjenja/set', function(req, res) {
    // req.body.datum_rodjejna se salje u formatu dd-MM-yyyy
    var datumParts = req.body.datum_rodjenja.split('-')
    var datumRodjenja = new Date(datumParts[2], (datumParts[1] * 1) - 1, (datumParts[0] * 1))
    sql.query(`update korisnik set datum_rodjenja = ${sql.escape(datumRodjenja)} where username = ${sql.escape(req.body.username)}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

router.post('/mobilni/set', function(req, res) {
    sql.query(`update korisnik set mobilni = ${sql.escape(req.body.mobilni)} where username = ${sql.escape(req.body.username)}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

router.post('/display_name/set', function(req, res) {

    sql.query(`update korisnik set display_name = ${sql.escape(req.body.display_name)} where username = ${sql.escape(req.body.username)}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.status(200).end()
    })
})

router.post('/tip/set', function(req, res) {

    sql.query(`update korisnik set tip = ${sql.escape(req.body.tip)} where username = ${sql.escape(req.body.username)}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.status(200).end()
    })
})

module.exports = router