const mysql = require('mysql')

const con = mysql.createConnection({
    host: "174.138.184.42",
    port: "3306",
    user: "SYSDBA",
    password: "Plivanje123$",
    database: "kor_main",
    timezone: 'Z'
})

con.connect(error => {
    if(error) throw error
    console.log("Succesfully connected to database!")
})

module.exports = con