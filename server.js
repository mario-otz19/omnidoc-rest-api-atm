require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const dbConnection = require('./config/db');
const user = require('./routes/user');
const operation = require('./routes/operation');

const server = async() => {
    try {
        // Conectar y sincronuizar con la bd
        dbConnection.sync()
            .then(() => console.log('¡Conectado a la base de datos! :v'))
            .catch((error) => console.log('Error: ', error));

        app.use(cors()); // Habilita el CORS (Intercambio de recursos de origen cruzado)
        app.use(express.json()); // Para parseo a JSON

        app.use(express.static('public'));

        // Rutas o endpoints
        app.use('/api/user', user);
        app.use('/api/operation', operation);

        // Escucha por el puerto que se configuró en variables de entorno
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`Servidor corriendo en el puerto: ${ process.env.SERVER_PORT }`);
        });        
    } 
    
    catch (error) {
        console.log('Algo salió mal al arrancar el servidor, favor de contactar al admin. :(');    
        console.log(error);    
    }
}

module.exports = {
    server
}
