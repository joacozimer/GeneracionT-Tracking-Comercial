import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

let connection;
try {
  connection = await mysql.createConnection({
    host: 'localhost',
    database: 'db_tracking_comercial',
    user: 'root',
    password: '',
  });
} catch (error) {
  console.log("error conectandose a la bd");
  console.log(error);
}

export default connection;

