const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const web_slike_folder = './web_slike/'

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb)  {
        var rs = function () {
            return (Math.random() + 1).toString(36).substring(2)
        }
        var fn = ''
        for(var i = 0; i < 10; i++) {
            fn += rs()
        }
        var newFileName = fn + path.extname(file.originalname)
        cb(null, newFileName)
    }
})

const storage_web_slike = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'web_slike/')
    },
    filename: function(req, file, cb)  {
        var rs = function () {
            return (Math.random() + 1).toString(36).substring(2)
        }
        var fn = ''
        for(var i = 0; i < 10; i++) {
            fn += rs()
        }
        var newFileName = fn + path.extname(file.originalname)
        cb(null, newFileName)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 1048576 } })
const upload_web_slike = multer({ storage: storage_web_slike, limits: { fileSize: 1048576 }})

router.post('/', upload.single('thumbnail'), function(req, res) {

    if(req.file != null) {
        return res.status(200).send(req.file.filename)
    }

    return res.status(400).send("none")
})

router.post('/web-slika', upload_web_slike.single('slika'), function(req, res) {
    if(req.file != null) {
        return res.status(200).send(req.file.filename).end()
    }

    return res.status(400).send('none').end()
})

router.get('/web-slika/list', (req, res) => {
    fs.readdir(web_slike_folder, (err, files) => {
        return res.json(files)
    })
})

router.post('/web-slika/delete', (req, res) => {
    if(req.body.filename == null) {
        return res.status(400).send(`Morate proslediti parametar 'filename'`)
    }
    fs.rm(web_slike_folder + req.body.filename, { force: true }, () => {
        return res.status(200).end()
    })
})

module.exports = router