const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

//crear Server Express

const app = express();

// Base de datos
dbConnection();

//cors
app.use(cors());

//middlewear que muestra el index. html que esta en la carpeta publica.

app.use( express.static('public'));

//Lectura y parseo del Body

app.use( express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
//TODO: CRUD:Eventos




//escuchar peticiones

app.listen(process.env.PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
});