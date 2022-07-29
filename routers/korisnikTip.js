var express = require('express')
var router = express.Router()
var sql = require('../db')

router.get('/list', function(req, res) {
    sql.query(`select id, naziv from korisnik_tip`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.json(resp)
    })
})

router.post('/insert', function(req, res) {

    if(!global.isAdmin(req)) {
        return res.status(403).end()
    }
    
    sql.query(`insert into korisnik_tip (naziv) values ('${req.body.naziv}')`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(201).end()
    })
})
module.exports = router