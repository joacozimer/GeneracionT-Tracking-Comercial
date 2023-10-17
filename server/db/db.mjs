import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

let connection;
try {
  connection = await mysql.createConnection({
    host: 'sql10.freemysqlhosting.net',
    database: 'sql10653891',
    user: 'sql10653891',
    password: 'SzGAPcBkel',
    port:3306
  });
} catch (error) {
  console.log("error conectandose a la bd");
  console.log(error);
}

export default connection;

