var express = require('express')
var router = express.Router()
var sql = require('../db')

router.post('/update', (req, res) => {
    if(req.body.naziv == null) {
        return res.status(400).send(`Morate proslediti parametar 'naziv'`)
    }

    sql.query(`update parametar set value = '${req.body.value}' where naziv = '${req.body.naziv}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

router.get('/get', (req, res) => {
    if(req.query.naziv == null) {
        return res.status(400).send(`Morate proslediti parametar 'naziv'`)
    }

    sql.query(`select naziv, value from parametar where naziv = '${req.query.naziv}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.json(resp)
    })
})

module.exports = router