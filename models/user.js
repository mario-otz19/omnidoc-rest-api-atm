const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const User = db.define('user', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    name: Sequelize.STRING(60),
    surname: Sequelize.STRING(60),
    email: {
        type: Sequelize.STRING(60),
        validate: {
            isEmail: {
                msg: 'Agrega un correo electrónico válido'
            }
        }
    },
    username: Sequelize.STRING(60),
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña no debe ir vacía'
            }
        }
    },
    date_birth: Sequelize.DATE,
    ine_id: Sequelize.INTEGER
},
{
    hooks: {
        beforeCreate(user) {
            user.id = User.prototype.idGenerator();
            user.password = User.prototype.hashPassword(user.password);
        }
    }
});

// Método para crear un UUID al usuario
User.prototype.idGenerator = function() {
    return uuidv4();
}

// Método para hashear contraseñas
User.prototype.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = User;