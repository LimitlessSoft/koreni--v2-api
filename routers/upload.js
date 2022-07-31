const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

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

const upload = multer({ storage: storage })

router.post('/', upload.single('thumbnail'), function(req, res) {

    if(req.file != null) {
        return res.status(200).send(req.file.filename)
    }

    return res.status(400).send("none")
})

module.exports = router