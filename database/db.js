import mysql from 'mysql2';
//const mysql=require('mysql2');

import {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
   
  } from './config.js'
  
  
connection=mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

connection.connect((error)=>{
    if(error){
        console.log('El error de conexion es: '+error);
        return;
    }
    console.log('CONECTADO A LA BD WIIII')
});

export const connection = connection;