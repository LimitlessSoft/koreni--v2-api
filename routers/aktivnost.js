var express = require('express')
var router = express.Router()
var sql = require('../db')

router.get('/list', function(req, res) {
    sql.query(`SELECT ID, DATUM, TIP, UCESNICI FROM AKTIVNOST`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.json(resp)
    })
})

router.post('/insert', function(req, res) {

    if(req.body.datum == null) {
        return res.status(400).send(`Morate proslediti parametar 'datum'`)
    }

    if(req.body.tip == null) {
        return res.status(400).send(`Morate proslediti parametar 'tip'`)
    }

    if(req.body.ucesnici == null) {
        return res.status(400).send(`Morate proslediti parametar 'ucesnici'`)
    }

    var isoDate = new Date(req.body.datum);
    var mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');

    sql.query(`INSERT INTO AKTIVNOST (DATUM, TIP, UCESNICI)
    VALUES ('${mySQLDateString}', ${req.body.tip}, '${req.body.ucesnici}')`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.json(resp)
    })
})

module.exports = router