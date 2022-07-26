var express = require('express')
var router = express.Router()
var sql = require('../db')
var multer = require('multer')
var upload = multer({dest: 'uploads/clanak/', limits: 10 * 1024 * 1024})

router.post('/insert', upload.single('thumbnail'), function(req, res) {
    console.log(req.body)
    console.log(req.thumbnail)
    console.log(req.body.thumbnail)
    return res.status(201).end()
    var rbody = req.body;
    var thumbnail = '';
    sql.query(`insert into CLANAK (SRC, NASLOV, THUMBNAIL, BODY, TIP) VALUES ('${rbody.src}', '${rbody.naslov}', '${thumbnail}', '${rbody.body}', ${rbody.tip})`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(201).end()
    })
})

router.get('/list', function(req, res) {

    var whereParameters = []

    if(req.query.tip != null) {
        whereParameters.push(`TIP = '${req.query.tip}'`)
    }

    var whereQuery = '';
    if(whereParameters != null && whereParameters.length > 0) {
        whereQuery = ' WHERE ' + whereParameters.join(' AND ')
    }

    sql.query(`SELECT SRC, NASLOV, THUMBNAIL, BODY, TIP FROM CLANAK ${whereQuery}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.json(resp)
    })
})

module.exports = router