var express = require('express')
var router = express.Router()
var sql = require('../db')

router.get('/list', function(req, res) {
    sql.query(`SELECT USERNAME, AKTIVNOST_ID, IZGOVOR_ID FROM IZOSTANAK`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.json(resp)
    })
})

router.delete('/delete', function(req, res) {
    if(req.body == null ||
        req.body.username == null ||
        req.body.username.trim().length == 0 ||
        req.body.aktivnostid <= 0) {
            return res.status(400).send(`Morate proslediti parametre 'username' i 'aktivnostid'`).end()
        }


    sql.query(`DELETE FROM IZOSTANAK WHERE USERNAME = '${req.body.username}' AND AKTIVNOST_ID = ${req.body.aktivnostid}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

router.post('/insertorupdate', function(req, res) {
    
    if(req.body.username == null || req.body.username.trim().length == 0) {
        return res.status(400).send(`Morate proslediti parametar 'username'`)
    }

    if(req.body.aktivnostid == null) {
        return res.status(400).send(`Morate proslediti parametar 'aktivnostid'`)
    }

    if(req.body.izgovorid == null) {
        return res.status(400).send(`Morate proslediti parametar 'izgovorid'`)
    }
    
    sql.query(`INSERT INTO IZOSTANAK (USERNAME, AKTIVNOST_ID, IZGOVOR_ID)
    VALUES ('${req.body.username}', ${req.body.aktivnostid}, ${req.body.izgovorid})
    ON DUPLICATE KEY UPDATE IZGOVOR_ID = ${req.body.izgovorid}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

module.exports = router