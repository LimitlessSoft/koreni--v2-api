var express = require('express')
var router = express.Router()
var sql = require('../db')

router.get('/list', function(req, res) {
    sql.query(`select id, datum, tip, ucesnici from aktivnost`, (err, resp) => {
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

    if(req.body.datum == null) {
        return res.status(400).send(`Morate proslediti parametar 'datum'`).end()
    }

    if(req.body.tip == null) {
        return res.status(400).send(`Morate proslediti parametar 'tip'`).end()
    }

    if(req.body.ucesnici == null) {
        return res.status(400).send(`Morate proslediti parametar 'ucesnici'`).end()
    }

    var isoDate = new Date(req.body.datum);
    var mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');

    sql.query(`insert into aktivnost (datum, tip, ucesnici) 
    values ('${mySQLDateString}', ${req.body.tip}, '${req.body.ucesnici}')`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(201).end()
    })
})

router.delete('/delete', function(req, res) {

    if(!global.isAdmin(req)) {
        return res.status(403).end()
    }
    
    if(req.body.id == null) {
        return res.status(400).send(`Morate proslediti parametar 'id'`).end()
    }

    sql.query(`delete from aktivnost where id = ${req.body.id}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

module.exports = router