var express = require('express')
var router = express.Router()
var sql = require('../db')

router.post('/insert', function(req, res) {

    if(!global.isAdmin(req)) {
        return res.status(403).end()
    }
    
    sql.query(`select count(naslov) as BR from link where url = '${req.body.url}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        if(resp[0].BR > 0) {
            return res.status(400).send(`Link sa datim 'url' parametrom vec postoji!`)
        }
    })

    sql.query(`insert into link (naslov, url, ucesnici) values ('${req.body.naslov}', '${req.body.url}', '${req.body.ucesnici}')`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(201).end()
    })
})

router.get('/get', function(req, res) {
    sql.query(`select naslov, url, ucesnici from link where url = ${sql.escape(req.query.url)}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.json(resp[0])
    })
})

router.get('/list', function(req, res) {
    sql.query(`select naslov, url, ucesnici from link`, (err, resp) => {
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
    
    sql.query(`delete from link where url = '${req.body.url}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})
module.exports = router