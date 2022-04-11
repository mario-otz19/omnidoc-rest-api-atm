require('dotenv').config();
const Sequelize = require('sequelize');
// const pg = require('pg');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

// Configuración para conectar a la base de datos local
module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    pool: { // Para grupo de conexiones desde un sólo proceso
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000 
    },
    define: {
        freezeTableName: true, // Para colocar el nombre de las tablas en singular
        schema: 'public',
        timestamps: false // Sirve para que se creen las columnas createdAd y updatedAt, cuándo fueron creados y actualizados los registros
    },
    logging: false // Para que no se muestren logs sobre la bd, quitar si se quiere ver,
});

// Configuración para conectar a la base de datos en Heroku
// const dbConnectionHeroku = new pg.Client({
//     user: DB_USER,
//     password: DB_PASSWORD,
//     database: DB_NAME,
//     port: DB_PORT,
//     host: DB_HOST,
//     ssl: true
// }); 

// dbConnectionHeroku.connect();
