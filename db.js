const mysql = require('mysql')

const con = mysql.createConnection({
    host: "koreni-v2-api.ct97tozelhun.eu-central-1.rds.amazonaws.com",
    port: "3306",
    user: "plivac555",
    password: "zRG69uq7nDdCqwSEURcJ",
    database: "koreni-v2-main",
    timezone: 'Z'
})

con.connect(error => {
    if(error) throw error
    console.log("Succesfully connected to database!")
})

module.exports = con