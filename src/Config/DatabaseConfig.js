const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'labs-dbservices01.ucab.edu.ve',
    user: 'bd2_202225_28215217',
    password: '28215217',
    port:3306,
    database:'bd2_202225_g2'
  });
  
conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = conn;