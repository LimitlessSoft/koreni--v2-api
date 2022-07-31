var express = require('express')
var router = express.Router()
var sql = require('../db')

router.get('/list', (req, res) => {
    sql.query(`select src from galerija_item`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.json(resp)
    })
})

router.post('/insert', (req, res) => {
    if(req.body.src == null) {
        return res.status(400).send(`Morate proslediti parametar 'src'!`).end()
    }

    sql.query(`insert into galerija_item (src) values ('${req.body.src}')`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(201).end()
    })
})

router.delete('/delete', (req, res) => {
    if(req.body.src == null) {
        return res.status(400).send(`Morate proslediti parametar 'src'!`).end()
    }

    sql.query(`delete from galerija_item where src = '${req.body.src}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

module.exports = router