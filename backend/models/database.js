const mysql = require('mysql2');
require('dotenv').config()
const password = process.env.PASSWORD
const username = process.env.DB_USERNAME
const host = process.env.HOST
const db_name = process.env.DB

// console.log(`Connecting with the following credentials:
//     Username: ${username}
//     Password: ${password ? '******' : 'Not Set'}
//     Host: ${host}
//     Database: ${db_name}`)

const pool = mysql.createPool({
  host: host,
  user: username,
  password: password,
  database: db_name
});

console.log('mysql2 pool ready')



module.exports = pool.promise(); // Export the promise-based pool