var express = require('express')
var router = express.Router()
var sql = require('../db')

router.post('/insert', function(req, res) {

    if(!global.isAdmin(req)) {
        return res.status(403).end()
    }
    
    sql.query(`SELECT COUNT(NASLOV) AS BR FROM LINK WHERE URL = '${req.body.url}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        if(resp[0].BR > 0) {
            return res.status(400).send(`Link sa datim 'url' parametrom vec postoji!`)
        }
    })

    sql.query(`INSERT INTO LINK (NASLOV, URL, UCESNICI) VALUES ('${req.body.naslov}', '${req.body.url}', '${req.body.ucesnici}')`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(201).end()
    })
})

router.get('/list', function(req, res) {
    sql.query(`SELECT NASLOV, URL, UCESNICI FROM LINK`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.json(resp)
    })
})

router.delete('/delete', function(req, res) {

    if(!global.isAdmin(req)) {
        return res.status(403).end()
    }
    
    sql.query(`DELETE FROM LINK WHERE URL = '${req.body.url}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})
module.exports = router