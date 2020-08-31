const mysql = require('mysql2/promise'); // mysql

module.exports = {
   connect: async function () {
      return await mysql.createConnection({
         host: 'localhost',
         user: 'root',
         password: '',
         port: '3306',
         database: 'music-app'
      });
   }
}