var express = require('express')
var router = express.Router()
var sql = require('../db')

router.get('/list', function(req, res) {
    sql.query(`SELECT ID, NAZIV FROM AKTIVNOST_TIP`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.json(resp)
    })
})

router.post('/insert', function(req, res) {

    if(req.body.naziv == null ||
        req.body.naziv.trim().length == 0) {
            return res.status(400).send(`Morate proslediti parametar 'naziv'`)
        }

    sql.query(`INSERT INTO AKTIVNOST_TIP (NAZIV)
    VALUES ('${req.body.naziv}')`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(201).end()
    })
})

module.exports = router