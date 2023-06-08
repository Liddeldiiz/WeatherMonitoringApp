const mysql = require('mysql');

const mysql_client = mysql.createConnection({
    host: 'localhost',
    user: 'node_js_server',
    password: '50S55v5m!osE',
    database: 'home'
})

mysql_client.connect((err) => {
    if (err) throw err;
    console.log('MySQL Client connected!');
    
})

module.exports = mysql_client;

