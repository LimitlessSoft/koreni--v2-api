var express = require('express')
var router = express.Router()
var sql = require('../db')

router.get('/list', function(req, res) {
    sql.query(`select username, aktivnost_id, izgovor_id from izostanak`, (err, resp) => {
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
    
    if(req.body == null ||
        req.body.username == null ||
        req.body.username.trim().length == 0 ||
        req.body.aktivnostid <= 0) {
            return res.status(400).send(`Morate proslediti parametre 'username' i 'aktivnostid'`).end()
        }


    sql.query(`delete from izostanak where username = '${req.body.username}' and aktivnost_id = ${req.body.aktivnostid}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

router.post('/insertorupdate', function(req, res) {

    if(!global.isAdmin(req)) {
        return res.status(403).end()
    }
    
    if(req.body.username == null || req.body.username.trim().length == 0) {
        return res.status(400).send(`Morate proslediti parametar 'username'`)
    }

    if(req.body.aktivnostid == null) {
        return res.status(400).send(`Morate proslediti parametar 'aktivnostid'`)
    }

    if(req.body.izgovorid == null) {
        return res.status(400).send(`Morate proslediti parametar 'izgovorid'`)
    }
    
    sql.query(`insert into izostanak (username, aktivnost_id, izgovor_id)
    values ('${req.body.username}', ${req.body.aktivnostid}, ${req.body.izgovorid})
    on duplicate key update izgovor_id = ${req.body.izgovorid}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

module.exports = router