const Sequelize = require('sequelize');
const db = require('../config/db');
const User = require('./user');

const DebitAccount = db.define('debit_account', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: Sequelize.UUID,
    balance: Sequelize.FLOAT
});

DebitAccount.belongsTo(User);

module.exports = DebitAccount;