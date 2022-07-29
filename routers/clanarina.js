var express = require('express')
var router = express.Router()
var sql = require('../db')

router.get('/get', function(req, res) {
    if(req.query.username == null ||
        req.query.username.trim().length == 0) {
            
        return res.status(400).send(`Morate proslediti parametar 'username'`).end()
    }

    if(req.query.mesec == null) {
            
        return res.status(400).send(`Morate proslediti parametar 'mesec'`).end()
    }

    if(req.query.godina == null) {
        return res.status(400).send(`Morate proslediti parametar 'godina'`).end()
    }

    sql.query(`select korisnik, mesec, godina, datum_placanja from clanarina where
    korisnik = '${req.query.username}'
        and mesec = ${req.query.mesec} and
        godina = ${req.query.godina}`, (err, resp) => {
            if(err) {
                console.log(err)
                return res.status(500).end()
            }

            if(resp[0] == null) {
                return res.status(204).end()
            }

            return res.json(resp[0])
        })
})

router.get('/list', function(req, res) {
    sql.query(`select korisnik, mesec, godina, datum_placanja from clanarina`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        
        return res.json(resp)
    })
})

router.post('/insertorupdate', function(req, res) {

    if(!global.isAdmin(req)) {
        return res.status(403).end()
    }
    
    
    if(req.body.username == null || req.body.username.trim().length == 0) {
        return res.status(400).send(`Morate poslati parametar 'username'!`)
    }
    if(req.body.mesec == null || req.body.mesec < 0 || req.body.mesec > 11) {
        return res.status(400).send(`Morate poslati parametar 'mesec'! Najmanje moze biti 0, a najvise 11!`)
    }
    if(req.body.godina == null || req.body.godina < 0) {
        return res.status(400).send(`Morate poslati parametar 'godina'!`)
    }
    if(req.body.datumPlacanja == null) {
        return res.status(400).send(`Neispravan parametar 'datumPlacanja'!`)
    }

    var isoDate = new Date(req.body.datumPlacanja);
    var mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');

    sql.query(`insert into clanarina (korisnik, mesec, datum_placanja, godina)
    values ('${req.body.username}', ${req.body.mesec}, '${mySQLDateString}', ${req.body.godina})`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

router.delete('/delete', function(req, res) {

    if(!global.isAdmin(req)) {
        return res.status(403).end()
    }
    
    if(req.body == null ||
        req.body.korisnik == null ||
        req.body.korisnik.trim().length == 0 ||
        req.body.mesec == null ||
        req.body.godina == null ||
        req.body.mesec <= 0 ||
        req.body.godina <= 0) {
            return res.status(400).send(`Morate proslediti parametre 'korisnik', 'mesec' i 'godina'!` ).end()
        }


    sql.query(`delete from clanarina where korisnik = '${req.body.korisnik}'
        and mesec = ${req.body.mesec} and godina = ${req.body.godina}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})
module.exports = router