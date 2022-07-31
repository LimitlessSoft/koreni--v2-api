var express = require('express')
var router = express.Router()
var sql = require('../db')

router.post('/insertorupdate', function(req, res) {

    if(!global.isAdmin(req)) {
        return res.status(403).end()
    }

    if(req.body.src == null || req.body.src.trim().length == 0) {
        return res.status(400).send(`Morate proslediti parametar 'src'!`).end()
    }

    if(req.body.naslov == null || req.body.naslov.trim().length == 0) {
        return res.status(400).send(`Morate proslediti parametar 'naslov'!`).end()
    }

    if(req.body.thumbnail == null || req.body.thumbnail.trim().length == 0) {
        return res.status(400).send(`Morate proslediti parametar 'thumbnail'!`).end()
    }

    if(req.body.body == null || req.body.body.trim().length == 0) {
        return res.status(400).send(`Morate proslediti parametar 'body'!`).end()
    }

    if(req.body.tip == null) {
        return res.status(400).send(`Morate proslediti parametar 'tip'`).end()
    }
    
    sql.query(`insert into clanak (src, naslov, thumbnail, body, tip) VALUES
    ('${req.body.src}', '${req.body.naslov}', '${req.body.thumbnail}', '${req.body.body}', ${req.body.tip})
    on duplicate key update naslov = '${req.body.naslov}', thumbnail = '${req.body.thumbnail}', body = '${req.body.body}'`, (err, resp) => {
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
        whereParameters.push(`tip = ${req.query.tip}`)
    }

    if(req.query.src != null) {
        whereParameters.push(`src = '${req.query.src}'`)
    }

    var whereQuery = '';
    if(whereParameters != null && whereParameters.length > 0) {
        whereQuery = ' WHERE ' + whereParameters.join(' AND ')
    }

    sql.query(`select src, naslov, thumbnail, body, tip from clanak ${whereQuery}`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }
        return res.json(resp)
    })
})

router.delete('/delete', function(req, res) {
    if(req.body.src == null) {
        return res.status(400).send(`Morate proslediti parametar 'src'`)
    }

    sql.query(`delete from clanak where src = '${req.body.src}'`, (err, resp) => {
        if(err) {
            console.log(err)
            return res.status(500).end()
        }

        return res.status(200).end()
    })
})

module.exports = router