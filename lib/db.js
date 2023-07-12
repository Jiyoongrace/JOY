var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '***', // 수정하기
    database: 'joying'
});
db.connect();

module.exports = db;