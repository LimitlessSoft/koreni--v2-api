var express = require('express')
var router = express.Router()
var sql = require('../db')

router.get('/list', function(req, res) {
    sql.query(`SELECT ID, NAZIV FROM KORISNIK_TIP`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.json(resp)
    })
})

module.exports = router